import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SystemProgram, Transaction } from '@solana/web3.js';
import base58 from 'bs58';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class WithdrawalService {
  private readonly _houseWalletSecret: string | undefined;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly rpcConnection: Connection,
  ) {
    this._houseWalletSecret = this.configService.get<string>('HOUSE_WALLET_SECRET');

    const solanaEndpoint = this.configService.get<string>('SOLANA_RPC_ENDPOINT');
    if (!solanaEndpoint) {
      throw new InternalServerErrorException('SOLANA_RPC_ENDPOINT is not defined');
    }

    this.rpcConnection = new Connection(solanaEndpoint, 'confirmed');
  }

  async withdraw(userId: string, tokenAmount: Decimal): Promise<any> {
    const solPrice = await this.getSolPrice();

    return 'withdraw';
  }

  private async getSolPrice(): Promise<number> {
    return 100;
  }

  private async createWithdrawal(payeePubKey: PublicKey): Promise<string> {
    if (!this._houseWalletSecret) {
      throw new InternalServerErrorException('House wallet secret is not defined, withdrawals can not be created');
    }

    const decoded = base58.decode(this._houseWalletSecret);
    const houseKeyPair = Keypair.fromSecretKey(decoded);
    const { blockhash } = await this.rpcConnection.getLatestBlockhash();

    const withdrawal = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: houseKeyPair.publicKey,
        toPubkey: new PublicKey(payeePubKey),
        lamports: 100,
      }),
    );

    withdrawal.recentBlockhash = blockhash;
    withdrawal.feePayer = houseKeyPair.publicKey;
    withdrawal.sign(houseKeyPair);

    const serializedWithdrawal = withdrawal.serialize();

    const signature = await this.rpcConnection.sendRawTransaction(serializedWithdrawal, {
      skipPreflight: true,
    });

    return signature;
  }
}
