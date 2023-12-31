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

  // NOTE: This guard cannot apply to the `connection` event, but it applies to all other events.
  // To guard the `connection` event, see https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new UnauthorizedException('Invalid or missing JWT token');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    try {
      await this.jwtService.verifyAsync(token, { secret: jwtSecret, algorithms: ['HS512'] });
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
