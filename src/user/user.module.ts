import { Module } from '@nestjs/common';

import { NftModule } from '@@nft/nft.module';
import { TokensModule } from '@@tokens/tokens.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [NftModule, TokensModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
