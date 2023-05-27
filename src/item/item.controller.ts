import { Controller, Get } from '@nestjs/common';
import { ItemService } from '@item/item.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async selectAll(): Promise<any> {
    return this.itemService.selectItems();
  }

  @Get(':id')
  async selectOne(): Promise<any> {
    return 'item';
  }
}
