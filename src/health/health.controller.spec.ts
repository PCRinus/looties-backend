import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { HealthController } from '@@health/health.controller';
import { SharedModule } from '@@shared/shared.module';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            get: jest.fn().mockResolvedValue('some result'),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
