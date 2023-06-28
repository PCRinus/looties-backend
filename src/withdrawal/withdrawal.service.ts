import type { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SystemProgram, Transaction } from '@solana/web3.js';
import base58 from 'bs58';
import Decimal from 'decimal.js';

import { CurrencyService } from '@@currency/currency.service';
import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class WithdrawalService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
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

    const solanaEndpoint = this.configService.get<string>('SOLANA_RPC_ENDPOINT');
    if (!solanaEndpoint) {
      throw new InternalServerErrorException('SOLANA_RPC_ENDPOINT is not defined');
    }

    try {
      this._rpcConnection = new Connection(solanaEndpoint, 'confirmed');
    } catch (error) {
      throw new InternalServerErrorException('Failed to connect to Solana RPC endpoint');
    }
  }

  async getWithdrawalData(): Promise<{ tokenToSolExchangeRate: Decimal; solanaWithdrawalFee: Decimal }> {
    const tokenToSolExchangeRate = await this.currencyService.getTokenToSolExchangeRate();
    const solanaWithdrawalFee = new Decimal(0.000005);

    return { tokenToSolExchangeRate, solanaWithdrawalFee };
  }

  async withdraw(userId: string, walletPublicKey: string, tokenAmount: Decimal): Promise<string> {
    this.checkIfUserCanWithdrawTokens(tokenAmount);

    const solData = await this.currencyService.getSolData();
    const solPrice = solData.quote.USD.price;
    const signature = await this.createWithdrawal(walletPublicKey, tokenAmount, solPrice);

    await this.updateUserInventoryAndTransactions(userId, tokenAmount);

    return signature;
  }

  private checkIfUserCanWithdrawTokens(tokenAmount: Decimal): void {
    //TODO: add additional checks for required games for example, or referral bonuses limitations
    if (tokenAmount.lessThan(0)) {
      throw new BadRequestException('Token amount can not be negative');
    }

    if (tokenAmount.greaterThanOrEqualTo(this._maxWithdrawalAmount)) {
      throw new BadRequestException('Token amount is greater than max withdrawal amount');
    }
  }

  private async createWithdrawal(payeePublicKey: string, withdrawalAmount: Decimal, solPrice: number): Promise<string> {
    const decoded = base58.decode(this._houseWalletSecret);
    const houseKeyPair = Keypair.fromSecretKey(decoded);
    const { blockhash } = await this._rpcConnection.getLatestBlockhash();

    const lamports = Math.ceil((withdrawalAmount.toNumber() * LAMPORTS_PER_SOL) / solPrice);

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

    return signature;
  }

  //TODO: refactor this, one we update the inventory
  private async updateUserInventoryAndTransactions(userId: string, tokenAmount: Decimal): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.transactions.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          coinsAmount: tokenAmount,
        },
      }),
    ]);
  }
}
