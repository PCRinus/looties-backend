import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { AvailableItems } from '@@user/user.service';
import { UserService } from '@@user/user.service';

type User = {
  id: string;
  walletAddress: string;
  excludedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  affiliateId: string | null;
  redeemedCode: string | null;
};

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':walletPublicKey')
  async getUserByWalletPublicKey(@Param('walletPublicKey') walletPublicKey: string): Promise<User> {
    return this.userService.getUserByWalletPublicKey(walletPublicKey);
  }

  @Get(':userId/available-items')
  async getUserItems(@Param('userId') userId: string): Promise<AvailableItems> {
    return this.userService.getAvailableItems(userId);
  }
}
