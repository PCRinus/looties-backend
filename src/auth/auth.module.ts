import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AffiliatesModule } from '@@affiliates/affiliates.module';
import { UserModule } from '@@user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      //TODO: change this secret
      secret: 'placeholder_secret',
      //TODO: adjust this expiry time at a later date
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    AffiliatesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
