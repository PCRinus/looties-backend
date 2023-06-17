import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import base58 from 'bs58';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async connectWallet(walletPublicKey: string, signature: string): Promise<string> {
    await this.validateCredentials(walletPublicKey, signature);

    return 'authenticated';
  }

  private async validateCredentials(walletPublicKey: string, signature: string): Promise<void> {
    this.logger.log(`Validating credentials for wallet ${walletPublicKey}`);

    const signatureUint8 = base58.decode(signature);
    const messageUint8 = new TextEncoder().encode(walletPublicKey);
    const walletPublicKeyUint8 = base58.decode(walletPublicKey);
  }

  private async generateJwt(walletPublicKey: string): Promise<string> {
    return 'jwt';
  }
}
