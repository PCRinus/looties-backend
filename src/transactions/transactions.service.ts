import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { Transactions } from '@prisma/client';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';
import type { TransactionTypes } from '@@transactions/transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNewTransaction(
    userId: string,
    transactionType: TransactionTypes,
    coinsAmount?: Decimal,
    nftName?: string,
  ): Promise<void> {
    try {
      await this.prismaService.transactions.create({
        data: {
          type: transactionType,
          userId,
          coinsAmount,
          nftName,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async getTransactionsByUserIdAndType(userId: string, type: TransactionTypes): Promise<Transactions[]> {
    const transactions = await this.prismaService.transactions.findMany({
      where: {
        userId,
        type,
      },
    });

    if (!transactions) {
      throw new NotFoundException(`No transactions found for user with Id ${userId}`);
    }

    return transactions;
  }
}
