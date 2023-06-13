import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SharedModule } from '@@shared/shared.module';
import { TransactionsService } from '@@transactions/transactions.service';

import { TransactionsController } from './transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
