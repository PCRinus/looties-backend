import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type Decimal from 'decimal.js';

import { CurrencyService } from '@@currency/currency.service';
import { ItemService } from '@@item/item.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
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
    private readonly itemService: ItemService,
    private readonly transactionsService: TransactionsService,
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

    await this.itemService.depositTokens(userId, tokenAmount);
    await this.transactionsService.updateTransaction(newTransactionId, { status: 'APPROVED', transactionHash: txHash });

    return tokenAmount;
  }

  async depositNft(userId: string, payload: SignedNftTransactions[]): Promise<void> {
    this.logger.log(`Deposit ${payload.length} NFTs for user ${userId}`);

    for await (const nftTransaction of payload) {
      const { txHash, mintAddress } = nftTransaction;

      const { lastValidBlockHeight } = await this.rpcConnectionService.getLatestBlockhash();

      const isTransactionValid = await this.rpcConnectionService.isTransactionValid(txHash, lastValidBlockHeight);
      if (!isTransactionValid) {
        throw new InternalServerErrorException(`Transaction ${txHash} is not valid`);
      }
    }
  }
}
