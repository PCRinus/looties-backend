import { Controller, Get } from '@nestjs/common';
import { ItemService } from '@item/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('item')
  async selectOne(): Promise<any> {
    return 'item';
  }

  @Get('items')
  async selectAll(): Promise<any> {
    return this.itemService.selectItems();
  }
}
