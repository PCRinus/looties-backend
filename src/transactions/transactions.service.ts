import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { TransactionTypes } from '@transactions/transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTransactionsByUserIdAndType(userId: string, type: TransactionTypes) {
    console.log('type', type);
    return await this.prismaService.transactions.findMany({
      where: {
        userId,
        type,
      },
    });
  }
}
