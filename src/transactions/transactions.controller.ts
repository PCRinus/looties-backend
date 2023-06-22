import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Transactions } from '@prisma/client';

import { TransactionsService } from '@@transactions/transactions.service';

export const TRANSACTION_TYPES = ['DEPOSIT', 'WITHDRAWAL'] as const;
export type TransactionTypes = (typeof TRANSACTION_TYPES)[number];

type Transaction = Transactions;

@ApiBearerAuth()
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':userId')
  @ApiQuery({ name: 'transactionType', enum: TRANSACTION_TYPES })
  async getTransactionsByUserId(
    @Param('userId') userId: string,
    @Query('transactionType') transactionType: TransactionTypes,
  ): Promise<Transaction[]> {
    console.log('query', transactionType);
    return await this.transactionsService.getTransactionsByUserIdAndType(userId, transactionType);
  }
}
