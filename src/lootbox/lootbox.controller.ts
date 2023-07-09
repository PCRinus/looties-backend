import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Lootbox } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { Public } from '@@auth/public.decorator';
import { CreateLootboxDto } from '@@lootbox/dtos/create-lootbox.dto';
import type { AvailableLootboxItems } from '@@lootbox/lootbox.service';
import { LootboxService } from '@@lootbox/lootbox.service';

@ApiTags('Lootbox')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('lootbox')
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService) {}

  @Public()
  @Get('')
  async getAllLootboxes(@Query('page') page: number): Promise<Lootbox[]> {
    return await this.lootboxService.getAllLootboxes(page);
  }

  @Get(':userId')
  async getLootboxesForUser(@Param('userId') userId: string, @Query('page') page: number): Promise<Lootbox[]> {
    return await this.lootboxService.getLootboxesForUser(userId, page);
  }

  @Get(':userId/available-lootbox-items')
  async getAvailableLootboxItems(@Param('userId') userId: string): Promise<AvailableLootboxItems> {
    return await this.lootboxService.getAvailableLootboxItems(userId);
  }

  @Post(':userId/create-lootbox')
  async createLootbox(@Param('userId') userId: string, @Body() body: CreateLootboxDto): Promise<string> {
    return 'lootbox';
  }
}
