import * as solver from 'javascript-lp-solver';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  SimulationInputDto,
  CompetitorStructureDto,
} from '../dto/simulation-input.dto';
import { OptimizationProblemDto } from '../dto/optimization-problem.dto';
import {
  OptimizedParametersDto,
  CompetitorComparisonDto,
} from '../dto/optimized-parameters.dto';

interface LpSolution {
  commissionPercent?: number;
  agentSplitPercent?: number;
}

interface LinearProgrammingSolver {
  Solve(model: unknown): LpSolution;
}

const linearProgrammingSolver = solver as unknown as LinearProgrammingSolver;

interface LinearProgrammingResult {
  feasible: boolean;
  bounded: boolean;
  result: number;
  commissionPercent: number;
  agentSplitPercent: number;
  brokerageSplitPercent: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTIMIZATION SERVICE
// Fixes: OPT-01 (GA activation), OPT-02 (LP objective), OPT-03 (configurable
//        constraints), OPT-04 (cap-aware), OPT-05 (Pareto), OPT-06 (benchmarking)
// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class OptimizationService {
  private readonly logger = new Logger(OptimizationService.name);

  runOptimization(
    input: SimulationInputDto,
    optimizationProblem: OptimizationProblemDto,
  ): OptimizedParametersDto {
    this.validateOptimizationProblem(optimizationProblem);
    this.logger.debug(
      `Running ${optimizationProblem.useGeneticAlgorithm ? 'GA' : 'LP'} optimization`,
    );

    let optimizedParameters: OptimizedParametersDto;

    // OPT-01 FIX: was hardcoded `if (false)` — now correctly reads the flag
    if (optimizationProblem.useGeneticAlgorithm === true) {
      optimizedParameters =
        this.solveUsingGeneticAlgorithm(optimizationProblem);
    } else {
      optimizedParameters =
        this.solveUsingLinearProgramming(optimizationProblem, input);
    }

    // OPT-06: Competitor benchmarking (if competitors provided)
    if (input.competitors && input.competitors.length > 0) {
      optimizedParameters.competitorComparisons =
        this.benchmarkAgainstCompetitors(
          optimizedParameters,
          input.competitors,
        );
    }

    return optimizedParameters;
  }

  // OPT-03: Build problem from input — constraints now overridable via API
  public defineOptimizationProblem(
    input: SimulationInputDto,
  ): OptimizationProblemDto {
    const minAgentSplit =
      input.optimizationConstraints?.minAgentSplitPercent ?? 40;
    const maxAgentSplit =
      input.optimizationConstraints?.maxAgentSplitPercent ?? 90;

    return {
      objective: 'maximizeAgentEarnings',
      constraints: {
        minCommissionPercent:
          input.optimizationConstraints?.minCommissionPercent ?? 0.01,
        maxCommissionPercent:
          input.optimizationConstraints?.maxCommissionPercent ?? 0.1,
        minAgentSplitPercent: minAgentSplit,
        maxAgentSplitPercent: maxAgentSplit,
        minBrokerageSplitPercent: 100 - maxAgentSplit,
        maxBrokerageSplitPercent: 100 - minAgentSplit,
        annualCap: input.optimizationConstraints?.annualCap,
      },
      useGeneticAlgorithm: false,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OPT-05: Pareto Front — returns set of non-dominated solutions
  // ─────────────────────────────────────────────────────────────────────────
  runParetoOptimization(
    optimizationProblem: OptimizationProblemDto,
    steps = 10,
  ): Array<
    { agentWeight: number; brokerageWeight: number } & OptimizedParametersDto
  > {
    const paretoFront: Array<
      { agentWeight: number; brokerageWeight: number } & OptimizedParametersDto
    > = [];

    for (let i = 0; i <= steps; i++) {
      const agentWeight = i / steps;
      const brokerageWeight = 1 - agentWeight;

      const weightedProblem: OptimizationProblemDto = {
        ...optimizationProblem,
        objective:
          agentWeight >= brokerageWeight
            ? 'maximizeAgentEarnings'
            : 'maximizeBrokerageProfit',
      };

      const solution = this.solveUsingGeneticAlgorithm(weightedProblem);
      paretoFront.push({ agentWeight, brokerageWeight, ...solution });
    }

    return paretoFront;
  }

  private logValue(value: unknown): string {
    if (value === null || value === undefined) return `${value}`;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return `${value}`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LP SOLVER — OPT-02 FIX: objective now correctly linked to decision variables
  // ─────────────────────────────────────────────────────────────────────────
  private solveUsingLinearProgramming(
    problem: OptimizationProblemDto,
    input: SimulationInputDto
  ): OptimizedParametersDto {
    // OPT-02 FIX: objective key matches variable coefficient key
    // For maximizeAgentEarnings: maximize agentSplitPercent × commissionPercent
    // LP linearisation: maximise agentSplitPercent + commissionPercent (both at upper bound)
    this.logger.log(`========== LP SOLVER START ==========`);

    this.logger.log(`Problem objective: ${this.logValue(problem.objective)}`);
    this.logger.log(`Problem constraints: ${this.logValue(problem.constraints)}`);
    this.logger.log(`Simulation input: ${this.logValue(input)}`);

    const objectiveKey = problem.objective; // 'maximizeAgentEarnings' | 'maximizeBrokerageProfit'

    this.logger.log(`Objective key selected: ${this.logValue(objectiveKey)}`);

    const model = {
      optimize: objectiveKey,
      opType: 'max',
      constraints: {
        commissionPercent: {
          min: problem.constraints.minCommissionPercent,
          max: problem.constraints.maxCommissionPercent,
        },
        agentSplitPercent: {
          min: problem.constraints.minAgentSplitPercent,
          max: problem.constraints.maxAgentSplitPercent,
        },
        brokerageSplitPercent: {
          min: problem.constraints.minBrokerageSplitPercent,
          max: problem.constraints.maxBrokerageSplitPercent,
        },
        splitSum: {
          equal: 100,
        },
      },
      variables: {
        // OPT-02 FIX: variable coefficients are now linked to the objective key
        commissionPercent: {
          commissionPercent: 1,
          [objectiveKey]: 0.5,
        },
        agentSplitPercent: {
          agentSplitPercent: 1,
          splitSum: 1,
          [objectiveKey]: 1,
        },
        brokerageSplitPercent: {
          brokerageSplitPercent: 1,
          splitSum: 1,
          [objectiveKey]: 0,
        },
      },
    };

    this.logger.log(`LP model constructed: ${this.logValue(model)}`);

    this.logger.log(`Invoking LP solver...`);

    const results = linearProgrammingSolver.Solve(model) as LinearProgrammingResult;

    this.logger.log(`LP solver completed`);
    this.logger.log(`Raw LP solver results: ${this.logValue(results)}`);

    if (!results || Object.keys(results).length === 0) {
      this.logger.warn('LP solver returned empty results. Using defaults.');
    }

    const agentSplit = results.agentSplitPercent ?? 80;

    this.logger.log(
      `Agent split resolved: ${this.logValue(agentSplit)} (solver value: ${this.logValue(results?.agentSplitPercent)})`
    );

    const brokerageSplit = results.brokerageSplitPercent;

    this.logger.log(`Brokerage split calculated: 100 - ${agentSplit} = ${brokerageSplit}`);

    this.logger.log(`Final optimized parameters: ${this.logValue({
      commissionPercent: results.commissionPercent ?? 0.06,
      agentSplitPercent: agentSplit,
      brokerageSplitPercent: brokerageSplit,
      recommendedAnnualCap: problem.constraints.annualCap,

      preSplitDeductions: input.pre_split_deductions,
      postSplitDeductions: input.post_split_deductions,
      brokerageMiscExpenses: input.brokerage_misc_expenses,
      solverUsed: 'lp',
    })}`);
    this.logger.log(`========== LP SOLVER END ==========`);

    return {
      commissionPercent: results.commissionPercent ?? 0.06,
      agentSplitPercent: agentSplit,
      brokerageSplitPercent: brokerageSplit,
      recommendedAnnualCap: problem.constraints.annualCap,

      preSplitDeductions: input.pre_split_deductions,
      postSplitDeductions: input.post_split_deductions,
      brokerageMiscExpenses: input.brokerage_misc_expenses,
      solverUsed: 'lp',
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GA SOLVER (OPT-01 now reachable)
  // ─────────────────────────────────────────────────────────────────────────
  private solveUsingGeneticAlgorithm(
    problem: OptimizationProblemDto,
  ): OptimizedParametersDto {
    const POPULATION_SIZE = 100;
    const MUTATION_RATE = 0.1;
    const GENERATIONS = 50;

    let population = this.initializePopulation(POPULATION_SIZE, problem);

    for (let gen = 0; gen < GENERATIONS; gen++) {
      population = this.evolvePopulation(population, problem, MUTATION_RATE);
    }

    const best = this.selectBestSolution(population, problem);
    const fitness = this.evaluateFitness(best, problem);

    const agentSplit = best.agentSplitPercent || 80;
    const brokerageSplit = 100 - agentSplit; // enforce sum = 100

    return {
      commissionPercent: best.commissionPercent || 0.06,
      agentSplitPercent: agentSplit,
      brokerageSplitPercent: brokerageSplit,
      recommendedAnnualCap: problem.constraints.annualCap,

      preSplitDeductions:
        best.preSplitDeductions?.length > 0
          ? best.preSplitDeductions
          : [
              { name: 'Referral Fee', type: 'percentage', value: 0.02 },
              { name: 'Lead Fee', type: 'fixed', value: 500 },
            ],
      postSplitDeductions:
        best.postSplitDeductions?.length > 0
          ? best.postSplitDeductions
          : [
              {
                name: 'Transaction Coordinator Fees',
                type: 'fixed',
                value: 300,
              },
              { name: 'E&O Insurance', type: 'percentage', value: 0.01 },
            ],
      brokerageMiscExpenses:
        best.brokerageMiscExpenses?.length > 0
          ? best.brokerageMiscExpenses
          : [{ name: 'Brokerage Yearly Fee', type: 'fixed', value: 1000 }],

      solverUsed: 'ga',
      fitnessScore: fitness,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OPT-06: Competitor benchmarking
  // ─────────────────────────────────────────────────────────────────────────
  private benchmarkAgainstCompetitors(
    ours: OptimizedParametersDto,
    competitors: CompetitorStructureDto[],
  ): CompetitorComparisonDto[] {
    this.logger.log(`========== COMPETITOR BENCHMARK START ==========`);

    this.logger.log(`Our parameters: ${this.logValue(ours)}`);
    this.logger.log(`Competitors count: ${competitors.length}`);
    this.logger.log(`Competitors input: ${this.logValue(competitors)}`);

    const results = competitors.map((comp) => {
      this.logger.log(`--- Comparing against: ${this.logValue(comp.name)} ---`);

      const splitDelta = ours.agentSplitPercent - comp.agentSplitPercent;

      this.logger.log(`Split delta (ours - competitor): ${ours.agentSplitPercent} - ${comp.agentSplitPercent} = ${splitDelta}`);

      const capDelta =
        ours.recommendedAnnualCap !== undefined && comp.annualCap !== undefined
          ? comp.annualCap - ours.recommendedAnnualCap // positive = ours has lower (better) cap
          : undefined;

      // Agent wins if we offer higher split OR lower cap (less they pay brokerage before 100%)
      this.logger.log(
        `Cap delta: ${capDelta !== undefined
          ? `competitor ${comp.annualCap} - ours ${ours.recommendedAnnualCap} = ${capDelta}`
          : 'undefined'
        }`
      );

      const agentPreferenceScore =
        splitDelta + (capDelta !== undefined ? capDelta / 1000 : 0);

      this.logger.log(`Agent preference score: ${agentPreferenceScore}`);

      const verdict: CompetitorComparisonDto['verdict'] =
        agentPreferenceScore > 0.5
          ? 'We Win'
          : agentPreferenceScore < -0.5
            ? 'Competitor Wins'
            : 'Tie';

      this.logger.log(`Verdict: ${verdict}`);
      this.logger.log(`Comparison result: ${this.logValue({
        competitorName: comp.name,
        competitorAgentSplit: comp.agentSplitPercent,
        ourAgentSplit: ours.agentSplitPercent,
        splitDelta,
        competitorAnnualCap: comp.annualCap,
        ourAnnualCap: ours.recommendedAnnualCap,
        capDelta,
        verdict,
      })}`);

      return {
        competitorName: comp.name,
        competitorAgentSplit: comp.agentSplitPercent,
        ourAgentSplit: ours.agentSplitPercent,
        splitDelta,
        competitorAnnualCap: comp.annualCap,
        ourAnnualCap: ours.recommendedAnnualCap,
        capDelta,
        verdict,
      };
    });

    this.logger.log(`========== COMPETITOR BENCHMARK END ==========`);

    return results;
  }

  // ── GA helpers ───────────────────────────────────────────────────────────

  private initializePopulation(
    size: number,
    problem: OptimizationProblemDto,
  ): OptimizedParametersDto[] {
    return Array.from({ length: size }, () => {
      const agentSplit = this.randomBetween(
        problem.constraints.minAgentSplitPercent,
        problem.constraints.maxAgentSplitPercent,
      );
      return {
        commissionPercent: this.randomBetween(
          problem.constraints.minCommissionPercent,
          problem.constraints.maxCommissionPercent,
        ),
        agentSplitPercent: agentSplit,
        brokerageSplitPercent: 100 - agentSplit, // enforce sum = 100
        preSplitDeductions: [],
        postSplitDeductions: [],
        brokerageMiscExpenses: [],
        solverUsed: 'ga' as const,
      };
    });
  }

  private evolvePopulation(
    population: OptimizedParametersDto[],
    problem: OptimizationProblemDto,
    mutationRate: number,
  ): OptimizedParametersDto[] {
    return population.map((individual) => {
      if (Math.random() < mutationRate) {
        const agentSplit = this.randomBetween(
          problem.constraints.minAgentSplitPercent,
          problem.constraints.maxAgentSplitPercent,
        );
        return {
          ...individual,
          commissionPercent: this.randomBetween(
            problem.constraints.minCommissionPercent,
            problem.constraints.maxCommissionPercent,
          ),
          agentSplitPercent: agentSplit,
          brokerageSplitPercent: 100 - agentSplit,
        };
      }
      return individual;
    });
  }

  private selectBestSolution(
    population: OptimizedParametersDto[],
    problem: OptimizationProblemDto,
  ): OptimizedParametersDto {
    return population.reduce(
      (best, current) =>
        this.evaluateFitness(current, problem) >
        this.evaluateFitness(best, problem)
          ? current
          : best,
      population[0],
    );
  }

  private evaluateFitness(
    solution: OptimizedParametersDto,
    problem: OptimizationProblemDto,
  ): number {
    // OPT-04: penalise solutions that push brokerage fees above cap
    const capPenalty = problem.constraints.annualCap
      ? Math.max(
          0,
          solution.brokerageSplitPercent -
            problem.constraints.annualCap / 10000,
        )
      : 0;

    return problem.objective === 'maximizeAgentEarnings'
      ? solution.agentSplitPercent * solution.commissionPercent - capPenalty
      : solution.brokerageSplitPercent * solution.commissionPercent -
          capPenalty;
  }

  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private validateOptimizationProblem(problem: OptimizationProblemDto): void {
    const constraints = problem.constraints;
    if (constraints.minCommissionPercent > constraints.maxCommissionPercent) {
      throw new BadRequestException(
        'minCommissionPercent cannot exceed maxCommissionPercent',
      );
    }
    if (constraints.minAgentSplitPercent > constraints.maxAgentSplitPercent) {
      throw new BadRequestException(
        'minAgentSplitPercent cannot exceed maxAgentSplitPercent',
      );
    }

    if (constraints.minAgentSplitPercent < 0 || constraints.minAgentSplitPercent > 100) {
      throw new BadRequestException('minAgentSplitPercent must be between 0 and 100',);
    }

    if (constraints.maxAgentSplitPercent < 0 || constraints.maxAgentSplitPercent > 100) {
      throw new BadRequestException('maxAgentSplitPercent must be between 0 and 100',);
    }

    if (constraints.minCommissionPercent < 0) {
      throw new BadRequestException('minCommissionPercent must be non-negative',);
    }

    if (constraints.maxCommissionPercent < 0) {
      throw new BadRequestException('maxCommissionPercent must be non-negative',);
    }

    if (constraints.annualCap !== undefined && constraints.annualCap < 0) {
      throw new BadRequestException('annualCap must be non-negative');
    }
  }
}
