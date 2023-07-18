import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { FileStorageService } from '@@file-storage/file-storage.service';

describe('FileStorageService', () => {
  let service: FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStorageService, { provide: ConfigService, useValue: createMock() }],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
