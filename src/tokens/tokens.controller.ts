import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { TokensService } from '@@tokens/tokens.service';

@ApiTags('Tokens')
@Controller('tokens')
export class TokensController {
  private readonly logger = new Logger(TokensController.name);

  constructor(private readonly tokensService: TokensService) {}

  @Get(':userId/balance')
  async getUserTokensBalance(@Param('userId') userId: string): Promise<Decimal> {
    this.logger.log(`Fetching tokens balance for user ${userId}...`);
    return this.tokensService.getBalance(userId);
  }
}
