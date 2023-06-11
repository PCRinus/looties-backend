import { ConfigModule, ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    console.log(configService.get<string>('NODE_ENV'));
    expect(service).toBeDefined();
  });
});
