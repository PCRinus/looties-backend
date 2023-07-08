import type { Nft, NftClient } from '@metaplex-foundation/js';
import { Metaplex } from '@metaplex-foundation/js';
import type { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Connection, PublicKey } from '@solana/web3.js';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';

@Injectable()
export class NftMetadataService implements OnModuleInit {
  private readonly logger = new Logger(NftMetadataService.name);

  constructor(private readonly rpcConnectionService: RpcConnectionService) {}

  private _connection: Connection;
  private _metaplex: Metaplex;

  onModuleInit() {
    this._connection = this.rpcConnectionService.getRpcConnection();
    this._metaplex = new Metaplex(this._connection);
  }

  getNftClient(): NftClient {
    return this._metaplex.nfts();
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
