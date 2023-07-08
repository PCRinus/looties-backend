import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { UserService } from '@@user/user.service';
import type { WithdrawNftDto } from '@@withdrawal/dtos/withdraw-nft.dto';
import { WithdrawSolDto } from '@@withdrawal/dtos/withdraw-sol.dto';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@ApiBearerAuth()
@ApiTags('Withdrawal')
@UseGuards(AuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService, private readonly userService: UserService) {}

  @Post(':userId/sol')
  async withdraw(@Param('userId') userId: string, @Body() body: WithdrawSolDto): Promise<string> {
    const { amount } = body;
    const tokenAmount = new Decimal(amount);

    const user = await this.userService.getUserById(userId);
    const walletPublicKey = user.walletAddress;

    return this.withdrawalService.withdrawTokens(userId, walletPublicKey, tokenAmount);
  }

  @Post(':userId/nft')
  async withdrawNft(@Param('userId') userId: string, @Body() body: WithdrawNftDto[]): Promise<string[]> {
    const user = await this.userService.getUserById(userId);
    const walletPublicKey = user.walletAddress;

    return await this.withdrawalService.withdrawNfts(userId, walletPublicKey, body);
  }
}
