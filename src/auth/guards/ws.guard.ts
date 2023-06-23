import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    try {
      await this.jwtService.verifyAsync(token, { secret: jwtSecret });
    } catch (error) {
      throw new InternalServerErrorException(`Could not validate JWT token`, error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Socket): string | undefined {
    const [type, token] = request.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
