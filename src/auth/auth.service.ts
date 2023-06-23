import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
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

  async connectWallet(walletPublicKey: string): Promise<string> {
    const user = await this.getOrCreateUser(walletPublicKey);
    const jwt = await this.generateJwt(user.walletAddress, user.id);

    return jwt;
  }

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

  private async getOrCreateUser(walletPublicKey: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: walletPublicKey,
      },
    });

    if (!existingUser) {
      try {
        const newUser = await this.prisma.user.create({
          data: {
            walletAddress: walletPublicKey,
            profile: {
              create: {
                userName: `${walletPublicKey.slice(0, 5)}...${walletPublicKey.slice(-5)}`,
              },
            },
          },
        });

        return newUser;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }

    return existingUser;
  }

  private async generateJwt(walletPublicKey: string, userId: string): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');

    return await this.jwtService.signAsync(
      { id: userId, walletAddress: walletPublicKey },
      { algorithm: 'HS512', secret },
    );
  }
}
