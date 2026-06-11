import { Controller, Post, Body, Query } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { SimulationInputDto } from '../dto/simulation-input.dto';
import { OptimizationProblemDto } from '../dto/optimization-problem.dto';

@Controller('optimization')
export class OptimizationController {
  constructor(private readonly optimizationService: OptimizationService) {}

  // POST /optimization/run — standard LP or GA optimization
  // OPT-01: useGA query param now actually routes to GA
  @Post('run')
  runOptimization(
    @Body() input: SimulationInputDto,
    @Query('useGA') useGA: string,
  ) {
    const optimizationProblem: OptimizationProblemDto = {
      ...this.optimizationService.defineOptimizationProblem(input),
      useGeneticAlgorithm: useGA === 'true', // OPT-01: string → boolean
    };
    return this.optimizationService.runOptimization(input, optimizationProblem);
  }

  // POST /optimization/pareto — OPT-05: Pareto multi-objective front
  @Post('pareto')
  runParetoOptimization(
    @Body() input: SimulationInputDto,
    @Query('steps') steps: string,
  ) {
    const problem = this.optimizationService.defineOptimizationProblem(input);
    const numSteps = steps ? parseInt(steps, 10) : 10;
    return this.optimizationService.runParetoOptimization(problem, numSteps);
  }
}
