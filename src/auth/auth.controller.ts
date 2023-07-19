import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@@auth/auth.service';
import { ConnectWalletDto } from '@@auth/dtos/connect-wallet.dto';
import { UserService } from '@@user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('connect-wallet')
  async connectWallet(@Body() payload: ConnectWalletDto): Promise<string> {
    const { walletPublicKey } = payload;
    const user = await this.userService.getOrCreateUserByWalletPublicKey(walletPublicKey);

    return this.authService.generateJwt(user.walletAddress, user.id, user.role);
  }
}
