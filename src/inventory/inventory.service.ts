import { Injectable, NotFoundException } from '@nestjs/common';
import type { Inventory } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getInventory(userId: string): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { userId },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory for user with ID ${userId} not found`);
    }

    return inventory;
  }
}
