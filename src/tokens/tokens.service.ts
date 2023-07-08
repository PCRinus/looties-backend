import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { decode } from 'bs58';
import Decimal from 'decimal.js';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(private readonly prisma: PrismaService, private readonly rpcConnectionService: RpcConnectionService) {}

  async getBalance(userId: string): Promise<Decimal> {
    const tokens = await this.prisma.tokens.findUnique({
      where: {
        userId,
      },
    });

    if (!tokens) {
      throw new InternalServerErrorException(`Tokens for user id ${userId} could not be retrieved`);
    }

    return tokens.amount ?? new Decimal(0);
  }

  async deposit(userId: string, amount: Decimal) {
    this.logger.log(`Depositing ${amount} tokens for user ${userId}...`);

    try {
      await this.prisma.tokens.upsert({
        where: {
          userId,
        },
        create: {
          amount,
          userId,
        },
        update: {
          amount: {
            increment: amount,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to deposit tokens for user id ${userId}: ${error}`);
    }
  }

  async withdraw(userId: string, amount: Decimal) {
    this.logger.log(`Withdrawing ${amount} tokens for user ${userId}...`);

    try {
      await this.prisma.tokens.update({
        where: {
          userId,
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to withdraw tokens for user id ${userId}: ${error}`);
    }
  }

  async signTransfer(tokens: Decimal, houseSecret: string, userWallet: string, blockhash: string): Promise<string> {
    const decodedHouseSecret = decode(houseSecret);
    const houseKeyPair = Keypair.fromSecretKey(decodedHouseSecret);
    const lamports = Math.ceil(tokens.toNumber() * LAMPORTS_PER_SOL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: houseKeyPair.publicKey,
        toPubkey: new PublicKey(userWallet),
        lamports,
      }),
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = houseKeyPair.publicKey;
    transaction.sign(houseKeyPair);

    const serializedTx = transaction.serialize();

    const signature = await this.rpcConnectionService.sendRawTransaction(serializedTx);

    return signature;
  }
}
