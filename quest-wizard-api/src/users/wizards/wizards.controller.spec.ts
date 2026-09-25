import { Test, TestingModule } from '@nestjs/testing';
import { WizardsController } from './wizards.controller.js';

describe('WizardsController', () => {
  let controller: WizardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WizardsController],
    }).compile();

    controller = module.get<WizardsController>(WizardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
