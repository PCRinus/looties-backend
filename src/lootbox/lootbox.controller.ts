import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lootbox')
@Controller('lootbox')
export class LootboxController {
  @Get()
  async getAll(): Promise<any> {
    return 'lootbox';
  }
}
