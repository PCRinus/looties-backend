import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [PrismaModule],
})
export class ItemModule {}
