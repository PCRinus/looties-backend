import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async selectItems(): Promise<any> {
    return await this.prisma.item.findMany();
  }
}
