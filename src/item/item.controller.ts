import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Item } from '@prisma/client';

import { ItemService } from '@@item/item.service';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async selectAll(): Promise<Item[]> {
    return this.itemService.selectItems();
  }

  @Get(':id')
  async selectOne(): Promise<string> {
    return 'item';
  }
}
