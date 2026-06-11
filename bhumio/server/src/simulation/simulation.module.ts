import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService],
  exports: [SimulationService], // Export the service so it can be used in other modules
})
export class SimulationModule {}
