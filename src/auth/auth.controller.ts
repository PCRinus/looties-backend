import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@@auth/auth.service';
import { ConnectWalletDto } from '@@auth/dtos/connect-wallet.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connect-wallet')
  async connectWallet(@Body() payload: ConnectWalletDto): Promise<string> {
    const { walletPublicKey } = payload;
    return this.authService.connectWallet(walletPublicKey);
  }
}
