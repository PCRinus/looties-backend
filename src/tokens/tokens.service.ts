import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(private readonly prisma: PrismaService) {}

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
}
