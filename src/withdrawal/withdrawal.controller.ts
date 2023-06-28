import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { InventoryService } from '@@inventory/inventory.service';
import { UserService } from '@@user/user.service';
import { WithdrawDto } from '@@withdrawal/dtos/withdraw.dto';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@ApiBearerAuth()
@ApiTags('Withdrawal')
@Controller('withdrawal')
export class WithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly userService: UserService,
    private readonly inventoryService: InventoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getWithdrawalData(@Param('userId') userId: string): Promise<any> {
    return 'withdrawal';
  }

  @UseGuards(AuthGuard)
  @Post(':userId')
  async withdraw(@Param('userId') userId: string, @Body() body: WithdrawDto): Promise<string> {
    const { tokenAmount } = body;
    const user = await this.userService.getUserById(userId);

    return this.withdrawalService.withdraw(userId, tokenAmount);
  }
}
