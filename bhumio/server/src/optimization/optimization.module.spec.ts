import { Test } from '@nestjs/testing';
import { OptimizationModule } from './optimization.module';
import { OptimizationService } from './optimization.service';
import { SimulationService } from '../simulation/simulation.service';
import { OptimizationController } from './optimization.controller';

describe('OptimizationModule', () => {
  let module: OptimizationModule;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [OptimizationModule],
    }).compile();

    module = testingModule.get<OptimizationModule>(OptimizationModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide OptimizationService', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [OptimizationModule],
    }).compile();

    const service = testingModule.get<OptimizationService>(OptimizationService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(OptimizationService);
  });

  it('should provide SimulationService', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [OptimizationModule],
    }).compile();

    const service = testingModule.get<SimulationService>(SimulationService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SimulationService);
  });

  it('should provide OptimizationController', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [OptimizationModule],
    }).compile();

    const controller = testingModule.get<OptimizationController>(
      OptimizationController,
    );
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(OptimizationController);
  });

  it('should compile the module without errors', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [OptimizationModule],
    }).compile();

    expect(testingModule).toBeDefined();
  });
});
