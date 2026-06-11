import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { SimulationService } from '../simulation/simulation.service';
import { OptimizationController } from './optimization.controller';

@Module({
  providers: [OptimizationService, SimulationService],
  controllers: [OptimizationController],
})
export class OptimizationModule {}
