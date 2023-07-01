import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Decimal from 'decimal.js';

import { CurrencyService } from '@@currency/currency.service';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/transaction-rates')
  async getTokenData(): Promise<{ tokenPerSolExchangeRate: Decimal; solanaTransactionFee: Decimal }> {
    const tokenPerSolExchangeRate = await this.currencyService.getTokenPerSolRate();
    const solanaTransactionFee = new Decimal(0.000005);

    return { tokenPerSolExchangeRate, solanaTransactionFee };
  }
}
