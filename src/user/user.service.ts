import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { Nfts, User } from '@prisma/client';
import type Decimal from 'decimal.js';
import { generate } from 'referral-codes';
import { v4 as uuidv4 } from 'uuid';

import { NftService } from '@@nft/nft.service';
import { PrismaService } from '@@shared/prisma.service';
import { TokensService } from '@@tokens/tokens.service';

export type AvailableItems = {
  availableTokens: Decimal;
  availableNfts: Pick<Nfts, 'id' | 'name' | 'price' | 'url'>[];
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
    private readonly nftService: NftService,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getRedeemedReferralCode(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        redeemedCode: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.redeemedCode;
  }

  async getUserByWalletPublicKey(walletPublicKey: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      //TODO: rename walletAddress to walletPublicKey in a migration script
      where: { walletAddress: walletPublicKey },
    });

    if (!user) {
      throw new NotFoundException(`User with wallet public key ${walletPublicKey} not found`);
    }

    return user;
  }

  async getOrCreateUserByWalletPublicKey(walletPublicKey: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: walletPublicKey,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const userId = uuidv4();
    const formattedWalletPublicKey = `${walletPublicKey.slice(0, 5)}...${walletPublicKey.slice(-5)}`;
    try {
      const newUser = await this.prisma.user.create({
        data: {
          id: userId,
          walletAddress: walletPublicKey,
          profile: {
            create: {
              userName: formattedWalletPublicKey,
            },
          },
          tokens: {
            create: {
              amount: '0',
            },
          },
          referrer: {
            create: {
              referralCode: generate({
                length: 8,
                count: 1,
                prefix: 'looties-',
              })[0],
            },
          },
          userSettings: {
            create: {},
          },
        },
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAvailableItems(userId: string): Promise<AvailableItems> {
    const availableNfts = (await this.nftService.getNfts(userId)).map((nft) => ({
      id: nft.id,
      name: nft.name,
      price: nft.price,
      url: nft.url,
    }));
    const availableTokens = await this.tokenService.getBalance(userId);

    return {
      availableTokens,
      availableNfts,
    };
  }
}
