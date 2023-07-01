import type { OnModuleInit } from '@nestjs/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Connection } from '@solana/web3.js';
import type Decimal from 'decimal.js';

import { CurrencyService } from '@@currency/currency.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class DepositService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rpcConnectionService: RpcConnectionService,
    private readonly currencyService: CurrencyService,
  ) {}

  private _rpcConnection: Connection;

  onModuleInit() {
    this._rpcConnection = this.rpcConnectionService.getRpcConnection();
  }

  async depositSol(userId: string, txHash: string, lamports: number): Promise<Decimal> {
    const { lastValidBlockHeight } = await this._rpcConnection.getLatestBlockhash();

    const isTransactionValid = await this.rpcConnectionService.isTransactionValid(txHash, lastValidBlockHeight);

    if (!isTransactionValid) {
      throw new InternalServerErrorException(`Transaction ${txHash} is not valid`);
    }

    const solAmount = this.rpcConnectionService.convertLamportsToSol(lamports);
    const tokenAmount = this.currencyService.convertSolToToken(solAmount);

    return tokenAmount;
  }
}
