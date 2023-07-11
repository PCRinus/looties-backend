import type { Nft, SendAndConfirmTransactionResponse } from '@metaplex-foundation/js';
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import type { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keypair, type PublicKey } from '@solana/web3.js';
import { decode } from 'bs58';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';

@Injectable()
export class NftMetadataService implements OnModuleInit {
  private readonly logger = new Logger(NftMetadataService.name);

  constructor(
    private readonly rpcConnectionService: RpcConnectionService,
    private readonly configService: ConfigService,
  ) {}

  private _metaplex: Metaplex;

  onModuleInit() {
    const houseSecret = this.configService.get<string>('HOUSE_WALLET_SECRET') ?? '';
    if (!houseSecret) {
      throw new InternalServerErrorException('House wallet is not defined, withdrawals can not be created');
    }

    const decodedHouseSecret = decode(houseSecret);
    const houseKeyPair = Keypair.fromSecretKey(decodedHouseSecret);

    const connection = this.rpcConnectionService.getRpcConnection();
    this._metaplex = new Metaplex(connection);
    this._metaplex.use(keypairIdentity(houseKeyPair));
  }

  async transferNft(
    mintPublicKey: PublicKey,
    nftMetadata: Nft,
    receiverPublicKey: PublicKey,
  ): Promise<SendAndConfirmTransactionResponse> {
    const { response } = await this._metaplex.nfts().transfer({
      nftOrSft: {
        address: mintPublicKey,
        tokenStandard: nftMetadata.tokenStandard,
      },
      toOwner: receiverPublicKey,
      authorizationDetails: nftMetadata.programmableConfig?.ruleSet
        ? {
            rules: nftMetadata.programmableConfig?.ruleSet,
          }
        : undefined,
    });

    return response;
  }

  async getNftMetadata(mintAddress: PublicKey): Promise<Nft> {
    this.logger.log(`Fetching NFT metadata for mint ${mintAddress.toBase58()}...`);
    const nftMetadata = await this._metaplex.nfts().findByMint({ mintAddress });

    if (nftMetadata.model !== 'nft') {
      throw new BadRequestException(`Mint ${mintAddress.toBase58()} is not an NFT`);
    }

    if ('token' in nftMetadata) {
      throw new BadRequestException(`Mint ${mintAddress.toBase58()} is not an NFT, it also has a token attached`);
    }

    this.logger.log(`Fetched NFT metadata for mint ${mintAddress.toBase58()}`);

    return nftMetadata;
  }
}
