import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ItemService } from '@@item/item.service';
import { SharedModule } from '@@shared/shared.module';

import { ItemController } from './item.controller';

describe('ItemController', () => {
  let controller: ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [ItemController],
      providers: [ItemService],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
