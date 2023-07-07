import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Nfts } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import type Decimal from 'decimal.js';

import { CurrencyService } from '@@currency/currency.service';
import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { TokensService } from '@@tokens/tokens.service';
import { TransactionsService } from '@@transactions/transactions.service';

type SignedNftTransactions = {
  txHash: string;
  mintAddress: string;
};

@Injectable()
export class DepositService {
  private readonly logger = new Logger(DepositService.name);

  constructor(
    private readonly rpcConnectionService: RpcConnectionService,
    private readonly currencyService: CurrencyService,
    private readonly tokensService: TokensService,
    private readonly transactionsService: TransactionsService,
    private readonly nftService: NftService,
    private readonly nftMetadataService: NftMetadataService,
  ) {}

  async depositSol(userId: string, txHash: string, lamports: number): Promise<Decimal> {
    this.logger.log(`Deposit ${lamports} lamports for user ${userId}`);

    const newTransactionId = await this.transactionsService.createNewTransaction(userId, {
      transactionType: 'DEPOSIT',
    });

    const { lastValidBlockHeight } = await this.rpcConnectionService.getLatestBlockhash();
    const isTransactionValid = await this.rpcConnectionService.isTransactionValid(txHash, lastValidBlockHeight);
    if (!isTransactionValid) {
      throw new InternalServerErrorException(`Transaction ${txHash} is not valid`);
    }

    const solAmount = this.rpcConnectionService.convertLamportsToSol(lamports);
    const tokenAmount = this.currencyService.convertSolToToken(solAmount);

    await this.tokensService.deposit(userId, tokenAmount);
    await this.transactionsService.updateTransaction(newTransactionId, { status: 'APPROVED', transactionHash: txHash });

    return tokenAmount;
  }

  async depositNfts(userId: string, payload: SignedNftTransactions[]): Promise<Array<Nfts>> {
    this.logger.log(`Depositing ${payload.length} NFTs for user ${userId}`);

    const depositedNfts = new Array<Nfts>();

    for await (const nftTransaction of payload) {
      const { txHash } = nftTransaction;

      if (txHash === null) {
        this.logger.log(`Transaction hash is null, skipping...`);
        continue;
      }

      this.logger.log(`Processing transaction ${txHash}, NFT mint ${nftTransaction.mintAddress}...`);

      const nftDepositTransactionId = await this.transactionsService.createNewTransaction(userId, {
        transactionType: 'DEPOSIT',
        transactionHash: txHash,
      });

      const mintPublicKey = new PublicKey(nftTransaction.mintAddress);

      const { lastValidBlockHeight } = await this.rpcConnectionService.getLatestBlockhash();
      const isTransactionValid = await this.rpcConnectionService.isTransactionValid(txHash, lastValidBlockHeight);
      if (!isTransactionValid) {
        await this.transactionsService.updateTransactionStatus(nftDepositTransactionId, 'DECLINED');
        this.logger.error(`Transaction ${txHash} is not valid`);

        continue;
      }

      const nftMetadata = await this.nftMetadataService.getNftMetadata(mintPublicKey);

      const depositedNft = await this.nftService.deposit(userId, nftMetadata);
      this.transactionsService.updateTransaction(nftDepositTransactionId, {
        status: 'APPROVED',
        transactionHash: txHash,
        nftName: depositedNft.name,
      });

      depositedNfts.push(depositedNft);
    }

    return depositedNfts;
  }
}
