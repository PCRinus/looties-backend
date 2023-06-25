import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Inventory } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { InventoryService } from '@@inventory/inventory.service';

//TODO: proprietary type definition here
type InventoryDo = Inventory;

@ApiTags('Inventory')
@UseGuards(AuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiBearerAuth()
  @ApiParam({ name: 'userId', type: String, description: 'Id of the user whose inventory is being retrieved' })
  @Get(':userId')
  async getInventory(@Param('userId') userId: string): Promise<InventoryDo> {
    return this.inventoryService.getInventory(userId);
  }
}
