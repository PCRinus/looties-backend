import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { Transactions, TransactionStatus, TransactionType } from '@prisma/client';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';
import type { TransactionTypes } from '@@transactions/transactions.controller';

type NewTransaction = {
  transactionType: TransactionType;
  coinsAmount?: Decimal;
  nftName?: string;
};

type UpdateTransaction = {
  status: TransactionStatus;
  transactionHash?: string;
  coinsAmount?: Decimal;
};

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNewTransaction(userId: string, payload: NewTransaction): Promise<number> {
    const { transactionType, coinsAmount, nftName } = payload;
    try {
      const { id } = await this.prismaService.transactions.create({
        data: {
          type: transactionType,
          userId,
          coinsAmount,
          nftName,
        },
        select: {
          id: true,
        },
      });

      return id;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async updateTransactionStatus(transactionId: number, status: TransactionStatus): Promise<void> {
    try {
      await this.prismaService.transactions.update({
        where: {
          id: transactionId,
        },
        data: {
          status,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update the status of transaction with id ${transactionId}`);
    }
  }

  async updateTransaction(transactionId: number, updatedTransaction: UpdateTransaction): Promise<void> {
    const { status, transactionHash, coinsAmount } = updatedTransaction;
    try {
      await this.prismaService.transactions.update({
        where: {
          id: transactionId,
        },
        data: {
          status,
          hash: transactionHash,
          coinsAmount,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update transaction with id ${transactionId}`);
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
