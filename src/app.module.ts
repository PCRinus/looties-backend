import { Module } from '@nestjs/common';
import { ItemModule } from '@item/item.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ItemModule, PrismaModule],
})
export class AppModule {}
