import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftService } from '@@nft/nft.service';
import { SharedModule } from '@@shared/shared.module';

describe('NftService', () => {
  let service: NftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [NftService],
    }).compile();

    service = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
