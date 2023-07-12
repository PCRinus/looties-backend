import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Lootbox } from '@prisma/client';
import Decimal from 'decimal.js';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { Public } from '@@auth/public.decorator';
import { CreateLootboxDto } from '@@lootbox/dtos/create-lootbox.dto';
import type { AvailableLootboxItems, LootboxContents } from '@@lootbox/lootbox.service';
import { LootboxService } from '@@lootbox/lootbox.service';
import { TokensService } from '@@tokens/tokens.service';

@ApiTags('Lootbox')
@UseGuards(AuthGuard)
@Controller('lootbox')
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService, private readonly tokensService: TokensService) {}

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
  @Get(':lootboxId/contents')
  async getLootboxContents(@Param('lootboxId') lootboxId: string): Promise<LootboxContents> {
    return await this.lootboxService.getLootboxContents(lootboxId);
  }

  @ApiBearerAuth()
  @Post(':userId/create-lootbox')
  async createLootbox(@Param('userId') userId: string, @Body() body: CreateLootboxDto): Promise<void> {
    const { name, price, nft, tokens, emptyBoxChance } = body;
    const lootboxPrice = new Decimal(price);
    const lootboxTokens = {
      id: tokens.id,
      amount: new Decimal(tokens.amount),
      dropChance: new Decimal(tokens.dropChance),
    };
    const lootboxNft = {
      id: nft.id,
      imageUrl: nft.imageUrl,
      dropChance: nft.dropChance,
    };
    const lootboxEmptyBoxChance = new Decimal(emptyBoxChance);

    const availableBalance = await this.tokensService.getBalance(userId);
    if (lootboxTokens.amount.greaterThan(availableBalance)) {
      throw new BadRequestException(`User's balance is less than entered token amount: ${lootboxTokens.amount}`);
    }

    await this.lootboxService.createLootbox(
      userId,
      name,
      lootboxPrice,
      lootboxTokens,
      lootboxNft,
      lootboxEmptyBoxChance,
    );
  }

  @Post(':lootboxId/try-lootbox')
  async tryLootbox(@Param('lootboxId') lootboxId: string): Promise<any> {
    return await this.lootboxService.tryLootbox(lootboxId);
  }
}
