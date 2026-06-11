import { Module } from '@nestjs/common';
import { SimulationModule } from './simulation/simulation.module';
import { OptimizationModule } from './optimization/optimization.module';

@Module({
  imports: [SimulationModule, OptimizationModule],
})
export class AppModule {}
