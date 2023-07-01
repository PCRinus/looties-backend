import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpModule],
  providers: [CurrencyService],
  exports: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
