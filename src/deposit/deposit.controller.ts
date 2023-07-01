import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { DepositService } from '@@deposit/deposit.service';
import { CreateDepositDto } from '@@deposit/dtos/create-deposit.dto';

@ApiTags('Deposit')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post(':userId/sol')
  async depositSol(@Param('userId') userId: string, @Body() body: CreateDepositDto): Promise<Decimal> {
    const { txHash, lamports } = body;

    return await this.depositService.depositSol(userId, txHash, lamports);
  }

  /**
   * In case of migrating to Shyft, we will need to parse the deposit with their callback
   */
  // @Post('shyft/parse-deposit')
  // async parseDeposit(): Promise<any> {
  //   return '';
  // }
}
