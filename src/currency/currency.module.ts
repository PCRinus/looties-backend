import { HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpService],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
