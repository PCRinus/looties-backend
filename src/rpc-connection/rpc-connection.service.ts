import type { OnModuleInit } from '@nestjs/common';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Decimal from 'decimal.js';

/**
 * The number of blocks before a blockhash expires
 * @see https://docs.solana.com/integrations/retrying-transactions#how-rpc-nodes-broadcast-transactions
 * @see https://www.quicknode.com/guides/solana-development/transactions/solana-transaction-propagation-handling-dropped-transactions#check-if-a-blockhash-is-expired
 */
const BLOCKHASH_EXPIRATION_LIMIT = 150;

@Injectable()
export class RpcConnectionService implements OnModuleInit {
  private readonly _logger = new Logger(RpcConnectionService.name);

  constructor(private readonly configService: ConfigService) {}

  private _rpcConnection: Connection;

  onModuleInit() {
    const rpcEndpoint = this.configService.get<string>('SOLANA_RPC_ENDPOINT');
    if (!rpcEndpoint) {
      throw new InternalServerErrorException('SOLANA_RPC_ENDPOINT is not defined');
    }

    try {
      this._rpcConnection = new Connection(rpcEndpoint);
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(`Can't create RPC connection: ${error}`);
    }
  }

  getRpcConnection(): Connection {
    return this._rpcConnection;
  }

  async getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
    return await this._rpcConnection.getLatestBlockhash();
  }

  convertLamportsToSol(lamports: number): Decimal {
    const solAmount = new Decimal(lamports / LAMPORTS_PER_SOL);

    return solAmount;
  }

  async isTransactionValid(txHash: string, lastValidBlockHeight: number): Promise<boolean> {
    let hashExpired = false;
    let txSuccess = false;
    const startTime = new Date();

    this._logger.log(`Checking transaction ${txHash}...`);

    do {
      const { value: status } = await this._rpcConnection.getSignatureStatus(txHash);

      // Break loop if transaction has succeeded
      if (status && (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized')) {
        txSuccess = true;

        const endTime = new Date();
        const elapsed = (endTime.getTime() - startTime.getTime()) / 1000;
        this._logger.log(`Transaction Success. Elapsed time: ${elapsed} seconds.`);
        //TODO: change cluster based on current environment
        this._logger.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
        return true;
      }

      hashExpired = await this.isBlockhashExpired(lastValidBlockHeight);

      // Break loop if blockhash has expired
      if (hashExpired) {
        const endTime = new Date();
        const elapsed = (endTime.getTime() - startTime.getTime()) / 1000;
        this._logger.log(`Blockhash has expired. Elapsed time: ${elapsed} seconds.`);
        // (add your own logic to Fetch a new blockhash and resend the transaction or throw an error)

        this._logger.error(`Transaction ${txHash} is not valid`);
        return false;
      }

      await this.sleep(1500);
    } while (!hashExpired && !txSuccess);

    return false;
  }

  private async isBlockhashExpired(lastValidBlockHeight: number): Promise<boolean> {
    const currentBlockHeight = await this._rpcConnection.getBlockHeight();

    return currentBlockHeight > lastValidBlockHeight - BLOCKHASH_EXPIRATION_LIMIT;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendRawTransaction(serializedTx: Buffer): Promise<string> {
    return await this._rpcConnection.sendRawTransaction(serializedTx, {
      skipPreflight: true,
    });
  }
}
