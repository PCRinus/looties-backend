import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import base58 from 'bs58';
import nacl from 'tweetnacl';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * deprecated
   * not used, maybe find a use case for this at a later date
   */
  private validateCredentials(walletPublicKey: string, signature: string): boolean {
    this.logger.log(`Validating credentials for wallet ${walletPublicKey}`);
    this.logger.log(`Decoding signature ${signature}`);

    const signatureUint8 = base58.decode(signature);
    const messageUint8 = new TextEncoder().encode(walletPublicKey);
    const walletPublicKeyUint8 = base58.decode(walletPublicKey);

    const result = nacl.sign.detached.verify(messageUint8, signatureUint8, walletPublicKeyUint8);

    return result;
  }

  async generateJwt(walletPublicKey: string, userId: string): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');

    return await this.jwtService.signAsync(
      { id: userId, walletAddress: walletPublicKey },
      { algorithm: 'HS512', secret },
    );
  }
}
