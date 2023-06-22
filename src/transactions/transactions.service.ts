import { Injectable, NotFoundException } from '@nestjs/common';
import type { Transactions } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';
import type { TransactionTypes } from '@@transactions/transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

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
