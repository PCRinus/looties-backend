import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import type { Lootbox } from '@prisma/client';
import Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { Public } from '@@auth/public.decorator';
import { CreateLootboxDto } from '@@lootbox/dtos/create-lootbox.dto';
import type { AvailableLootboxItems } from '@@lootbox/lootbox.service';
import { LootboxService } from '@@lootbox/lootbox.service';

@ApiTags('Lootbox')
@UseGuards(AuthGuard)
@Controller('lootbox')
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService) {}

  @Public()
  @Get('')
  async getAllLootboxes(@Query('page') page: number): Promise<Lootbox[]> {
    return await this.lootboxService.getAllLootboxes(page);
  }

  @ApiBearerAuth()
  @Get(':userId')
  async getLootboxesForUser(@Param('userId') userId: string, @Query('page') page: number): Promise<Lootbox[]> {
    return await this.lootboxService.getLootboxesForUser(userId, page);
  }

  @ApiBearerAuth()
  @Get(':userId/available-lootbox-items')
  async getAvailableLootboxItems(@Param('userId') userId: string): Promise<AvailableLootboxItems> {
    return await this.lootboxService.getAvailableLootboxItems(userId);
  }

  @ApiBearerAuth()
  @Post(':userId/create-lootbox')
  async createLootbox(@Param('userId') userId: string, @Body() body: CreateLootboxDto): Promise<void> {
    const { name, price, nft, tokens } = body;
    const lootboxPrice = new Decimal(price);
    const lootboxTokens = {
      id: tokens.id,
      amount: new Decimal(tokens.amount),
      dropChance: new Decimal(tokens.dropChance),
    };
    const lootboxNft = {
      id: nft.id,
      dropChance: nft.dropChance,
    };

    await this.lootboxService.createLootbox(userId, name, lootboxPrice, lootboxTokens, lootboxNft);
  }
}
