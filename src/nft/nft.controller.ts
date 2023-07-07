import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Nfts } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { NftService } from '@@nft/nft.service';

@ApiTags('Nft')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':userId')
  async getNftsForUser(@Param('userId') userId: string): Promise<Nfts[]> {
    return await this.nftService.getNfts(userId);
  }
}
