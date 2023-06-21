import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import base58 from 'bs58';
import nacl from 'tweetnacl';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async connectWallet(walletPublicKey: string, signature: string): Promise<string> {
    const isValidated = this.validateCredentials(walletPublicKey, signature);

    if (!isValidated) {
      // TODO: better message
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.getOrCreateUser(walletPublicKey);
    const jwt = await this.generateJwt(user.walletAddress);

    return jwt;
  }

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
                userName: 'Dummy name',
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

  private async generateJwt(walletPublicKey: string): Promise<string> {
    return await this.jwtService.signAsync({ walletAddress: walletPublicKey });
  }
}
