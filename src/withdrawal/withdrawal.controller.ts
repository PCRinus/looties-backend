import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { InventoryService } from '@@inventory/inventory.service';
import { UserService } from '@@user/user.service';
import { WithdrawDto } from '@@withdrawal/dtos/withdraw.dto';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@ApiBearerAuth()
@ApiTags('Withdrawal')
@UseGuards(AuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly userService: UserService,
    private readonly inventoryService: InventoryService,
  ) {}

  //TODO: better endpoint name
  @Get('/data')
  async getWithdrawalData(): Promise<{ tokenToSolExchangeRate: Decimal; solanaWithdrawalFee: Decimal }> {
    return this.withdrawalService.getWithdrawalData();
  }

  @Post(':userId')
  async withdraw(@Param('userId') userId: string, @Body() body: WithdrawDto): Promise<string> {
    const { tokenAmount } = body;

    return this.withdrawalService.withdraw(userId, tokenAmount);
  }
}
