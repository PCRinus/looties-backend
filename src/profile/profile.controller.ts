import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@profile/profile.service';

export const transactionType = ['DEPOSIT', 'WITHDRAWAL'] as const;
export type TransactionType = (typeof transactionType)[number];

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('userId') userId: string): Promise<any> {
    return await this.profileService.getProfileByUserId(userId);
  }

  @Get(':id/transactions')
  async getTransactionsByUserId(
    @Param('userId') userId: string,
    @Query() transactionType: TransactionType,
  ): Promise<any> {
    return await this.profileService.getTransactionsByUserIdAndType(userId, transactionType);
  }
}
