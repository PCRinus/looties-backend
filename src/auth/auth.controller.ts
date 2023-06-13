import { Body, Controller, Post } from '@nestjs/common';

import { ConnectWalletDto } from '@@auth/dtos/connect-wallet.dto';

@Controller('auth')
export class AuthController {
  @Post('connect-wallet')
  async connectWallet(@Body() payload: ConnectWalletDto): Promise<string> {
    return 'connect-wallet';
  }
}
