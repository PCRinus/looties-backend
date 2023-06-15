import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '@@auth/auth.service';
import { ConnectWalletDto } from '@@auth/dtos/connect-wallet.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connect-wallet')
  async connectWallet(@Body() payload: ConnectWalletDto): Promise<string> {
    return this.authService.connectWallet(payload);
  }
}
