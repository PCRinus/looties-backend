import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { UserService } from '@@user/user.service';
import { WithdrawDto } from '@@withdrawal/dtos/withdraw.dto';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@ApiBearerAuth()
@ApiTags('Withdrawal')
@UseGuards(AuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService, private readonly userService: UserService) {}

  @Post(':userId/sol')
  async withdraw(@Param('userId') userId: string, @Body() body: WithdrawDto): Promise<string> {
    const { amount } = body;
    const tokenAmount = new Decimal(amount);

    const user = await this.userService.getUserById(userId);
    const walletPublicKey = user.walletAddress;

    return this.withdrawalService.withdraw(userId, walletPublicKey, tokenAmount);
  }
}
