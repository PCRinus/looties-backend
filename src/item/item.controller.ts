import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Item } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { ItemService } from '@@item/item.service';

@ApiTags('Items')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get(':userId')
  async getAllUserItems(@Param('userId') userId: string): Promise<Item[]> {
    return this.itemService.selectItems(userId);
  }

  @Get(':id')
  async selectOne(): Promise<string> {
    return 'item';
  }
}
