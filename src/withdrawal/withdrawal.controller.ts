import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { WithdrawDto } from '@@withdrawal/dtos/withdraw.dto';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@ApiBearerAuth()
@ApiTags('Withdrawal')
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getWithdrawalData(@Param('userId') userId: string): Promise<any> {
    return 'withdrawal';
  }

  @UseGuards(AuthGuard)
  @Post(':userId')
  async withdraw(@Param('userId') userId: string, @Body() body: WithdrawDto): Promise<any> {
    return 'withdrawal';
  }
}
