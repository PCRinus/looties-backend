import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Transactions, TransactionStatus, TransactionType } from '@prisma/client';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';
import type { TransactionTypes } from '@@transactions/transactions.controller';

type NewTransaction = {
  transactionType: TransactionType;
  transactionHash?: string;
  coinsAmount?: Decimal;
  mintAddress?: string;
  nftName?: string;
};

type UpdateTransaction = {
  transactionHash?: string;
  status: TransactionStatus;
  coinsAmount?: Decimal;
  nftName?: string;
};

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  private readonly pageSize = 20;

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
          status: 'PENDING',
        },
        select: {
          id: true,
        },
      });

      this.logger.log(`Pending transaction created with id ${id}`);

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

  async getTransactionsByUserIdAndType(userId: string, type: TransactionTypes, page: number): Promise<Transactions[]> {
    const skip = (page - 1) * this.pageSize;

    const transactions = await this.prismaService.transactions.findMany({
      where: {
        userId,
        type,
      },
      skip: skip,
      take: this.pageSize,
    });

    if (!transactions) {
      throw new NotFoundException(`No transactions found for user with Id ${userId}`);
    }

    return transactions;
  }
}
