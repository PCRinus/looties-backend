import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async connectWallet(walletPublicKey: string, signature: string): Promise<string> {
    return 'jwt';
  }

  private async generateJwt(walletPublicKey: string): Promise<string> {
    return 'jwt';
  }
}
