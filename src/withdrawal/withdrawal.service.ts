import type { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Connection } from '@solana/web3.js';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SystemProgram, Transaction } from '@solana/web3.js';
import { decode } from 'bs58';
import Decimal from 'decimal.js';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { TransactionsService } from '@@transactions/transactions.service';

@Injectable()
export class WithdrawalService implements OnModuleInit {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(
    private readonly transactionService: TransactionsService,
    private readonly rpcConnectionService: RpcConnectionService,
    private readonly configService: ConfigService,
  ) {}

  private _houseWalletSecret: string;
  private _maxWithdrawalAmount: Decimal;
  private _rpcConnection: Connection;

  onModuleInit() {
    this._houseWalletSecret = this.configService.get<string>('HOUSE_WALLET_SECRET') ?? '';
    if (!this._houseWalletSecret) {
      throw new InternalServerErrorException('House wallet is not defined, withdrawals can not be created');
    }

    const maxWithdrawalAmount = this.configService.get<string>('MAX_WITHDRAWAL_AMOUNT');
    this._maxWithdrawalAmount = maxWithdrawalAmount ? new Decimal(maxWithdrawalAmount) : new Decimal(0);
    if (this._maxWithdrawalAmount.lessThanOrEqualTo(0)) {
      throw new InternalServerErrorException('MAX_WITHDRAWAL_AMOUNT is not defined or is less than or equal to 0');
    }

    this._rpcConnection = this.rpcConnectionService.getRpcConnection();
  }

  async withdraw(userId: string, walletPublicKey: string, tokenAmount: Decimal): Promise<string> {
    this.logger.log(`Withdrawal request for user ${userId} with wallet ${walletPublicKey} for ${tokenAmount} tokens`);

    this.checkIfUserCanWithdrawTokens(tokenAmount);

    this.logger.log('Fetching SOL price');

    const transactionId = await this.createWithdrawalTransaction(userId, tokenAmount);
    this.logger.log(`Pending transaction created with id ${transactionId}`);

    const signature = await this.createWithdrawal(walletPublicKey, tokenAmount, transactionId);
    this.logger.log(`Withdrawal created with signature ${signature}`);

    return signature;
  }

  private checkIfUserCanWithdrawTokens(tokenAmount: Decimal): void {
    //TODO: add additional checks for required games for example, or referral bonuses limitations
    this.logger.log(`Checking if user can withdraw ${tokenAmount} tokens`);

    if (tokenAmount.lessThan(0)) {
      throw new BadRequestException('Token amount can not be negative');
    }

    if (tokenAmount.greaterThanOrEqualTo(this._maxWithdrawalAmount)) {
      throw new BadRequestException('Token amount is greater than max withdrawal amount');
    }
  }

  private async createWithdrawalTransaction(userId: string, tokenAmount: Decimal): Promise<number> {
    return await this.transactionService.createNewTransaction(userId, 'WITHDRAWAL', tokenAmount);
  }

  private async createWithdrawal(
    payeePublicKey: string,
    withdrawalAmount: Decimal,
    transactionId: number,
  ): Promise<string> {
    this.logger.log(`Creating withdrawal for ${withdrawalAmount} tokens for user with wallet ${payeePublicKey}`);

    try {
      const decoded = decode(this._houseWalletSecret);
      const houseKeyPair = Keypair.fromSecretKey(decoded);
      const { blockhash, lastValidBlockHeight } = await this._rpcConnection.getLatestBlockhash();

      const lamports = Math.ceil(withdrawalAmount.toNumber() * LAMPORTS_PER_SOL);

      const withdrawal = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: houseKeyPair.publicKey,
          toPubkey: new PublicKey(payeePublicKey),
          lamports,
        }),
      );

      withdrawal.recentBlockhash = blockhash;
      withdrawal.feePayer = houseKeyPair.publicKey;
      withdrawal.sign(houseKeyPair);

      const serializedWithdrawal = withdrawal.serialize();

      const signature = await this._rpcConnection.sendRawTransaction(serializedWithdrawal, {
        skipPreflight: true,
      });

      const isTransactionValid = await this.rpcConnectionService.isTransactionValid(signature, lastValidBlockHeight);

      if (!isTransactionValid) {
        throw new Error();
      }

      await this.transactionService.updateTransaction({
        transactionId,
        status: 'APPROVED',
        transactionHash: signature,
        coinsAmount: withdrawalAmount,
      });

      return signature;
    } catch (error) {
      this.logger.error(error);
      await this.transactionService.updateTransactionStatus(transactionId, 'DECLINED');

      throw new InternalServerErrorException('Failed to create withdrawal');
    }
  }
}
