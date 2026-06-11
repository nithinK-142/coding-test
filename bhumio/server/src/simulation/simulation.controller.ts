import { Controller, Post, Body } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationInputDto } from '../dto/simulation-input.dto';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  // POST /simulation — run full simulation
  @Post()
  runSimulation(@Body() input: SimulationInputDto) {
    return this.simulationService.runSimulation(input);
  }

  // POST /simulation/compare — CC-07: what-if scenario comparison
  @Post('compare')
  compareScenarios(
    @Body() body: Array<{ label: string; input: SimulationInputDto }>,
  ) {
    return this.simulationService.compareScenarios(body);
  }

  // POST /simulation/agent-summary — CT-02: agent self-service dashboard
  @Post('agent-summary')
  getAgentSummary(
    @Body() body: { input: SimulationInputDto; annualCap?: number },
  ) {
    const results = this.simulationService.runSimulation(body.input);
    return this.simulationService.getAgentSummary(results, body.annualCap);
  }
}
