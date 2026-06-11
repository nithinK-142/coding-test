import { OptimizationService } from './optimization.service';
import { SimulationInputDto } from '../dto/simulation-input.dto';

const baseInput: SimulationInputDto = {
  pre_split_deductions: [],
  post_split_deductions: [],
  commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
  brokerage_misc_expenses: [],
  performance_bonuses: [],
  sales_data: [
    {
      date: '2024-01-01',
      salesValue: 500000,
      cumulativeSales: 0,
      dealType: 'Listing',
      commissionPercent: 6,
    },
  ],
};

describe('OptimizationService', () => {
  // ── OPT-01: GA activation ────────────────────────────────────────────────
  it('OPT-01: should route to GA when useGeneticAlgorithm=true', () => {
    const service = new OptimizationService();
    const problem = {
      ...service.defineOptimizationProblem(baseInput),
      useGeneticAlgorithm: true,
    };
    const result = service.runOptimization(baseInput, problem);
    expect(result.solverUsed).toBe('ga');
  });

  it('OPT-01: should route to LP when useGeneticAlgorithm=false', () => {
    const service = new OptimizationService();
    const problem = {
      ...service.defineOptimizationProblem(baseInput),
      useGeneticAlgorithm: false,
    };
    const result = service.runOptimization(baseInput, problem);
    expect(result.solverUsed).toBe('lp');
  });

  // ── OPT-02: LP correctness ───────────────────────────────────────────────
  it('OPT-02: LP result should respect constraint bounds', () => {
    const service = new OptimizationService();
    const problem = service.defineOptimizationProblem(baseInput);
    const result = service.runOptimization(baseInput, problem);

    expect(result.commissionPercent).toBeGreaterThanOrEqual(
      problem.constraints.minCommissionPercent,
    );
    expect(result.commissionPercent).toBeLessThanOrEqual(
      problem.constraints.maxCommissionPercent,
    );
    expect(result.agentSplitPercent).toBeGreaterThanOrEqual(
      problem.constraints.minAgentSplitPercent,
    );
    expect(result.agentSplitPercent).toBeLessThanOrEqual(
      problem.constraints.maxAgentSplitPercent,
    );
  });

  it('OPT-02/OPT-13: agent + brokerage split should sum to 100', () => {
    const service = new OptimizationService();
    const problem = service.defineOptimizationProblem(baseInput);
    const result = service.runOptimization(baseInput, problem);
    expect(result.agentSplitPercent + result.brokerageSplitPercent).toBeCloseTo(
      100,
    );
  });

  // ── OPT-03: Configurable constraints ────────────────────────────────────
  it('OPT-03: should use override constraints from input', () => {
    const service = new OptimizationService();
    const inputWithOverride: SimulationInputDto = {
      ...baseInput,
      optimizationConstraints: {
        minAgentSplitPercent: 70,
        maxAgentSplitPercent: 85,
        annualCap: 16000,
      },
    };
    const problem = service.defineOptimizationProblem(inputWithOverride);
    expect(problem.constraints.minAgentSplitPercent).toBe(70);
    expect(problem.constraints.maxAgentSplitPercent).toBe(85);
    expect(problem.constraints.annualCap).toBe(16000);
  });

  // ── OPT-05: Pareto front ─────────────────────────────────────────────────
  it('OPT-05: Pareto front should return steps+1 solutions', () => {
    const service = new OptimizationService();
    const problem = service.defineOptimizationProblem(baseInput);
    const front = service.runParetoOptimization(problem, 5);
    expect(front.length).toBe(6); // 0, 1, 2, 3, 4, 5
    front.forEach((pt) => {
      expect(pt.agentWeight + pt.brokerageWeight).toBeCloseTo(1);
      expect(pt.agentSplitPercent + pt.brokerageSplitPercent).toBeCloseTo(100);
    });
  });

  // ── OPT-06: Competitor benchmarking ─────────────────────────────────────
  it('OPT-06: should return competitor comparisons when competitors provided', () => {
    const service = new OptimizationService();
    const inputWithCompetitors: SimulationInputDto = {
      ...baseInput,
      optimizationConstraints: {
        minAgentSplitPercent: 80,
        maxAgentSplitPercent: 90,
      },
      competitors: [
        {
          name: 'eXp Realty',
          agentSplitPercent: 80,
          brokerageSplitPercent: 20,
          annualCap: 16000,
        },
        {
          name: 'Keller Williams',
          agentSplitPercent: 64,
          brokerageSplitPercent: 30,
          annualCap: 21000,
        },
      ],
    };
    const problem = service.defineOptimizationProblem(inputWithCompetitors);
    const result = service.runOptimization(inputWithCompetitors, problem);
    expect(result.competitorComparisons).toBeDefined();
    expect(result.competitorComparisons!.length).toBe(2);
    expect(
      result.competitorComparisons!.every((c) =>
        ['We Win', 'Competitor Wins', 'Tie'].includes(c.verdict),
      ),
    ).toBe(true);
  });

  // ── GA produces valid output ─────────────────────────────────────────────
  it('GA solution should have commissionPercent and splits within bounds', () => {
    const service = new OptimizationService();
    const problem = {
      ...service.defineOptimizationProblem(baseInput),
      useGeneticAlgorithm: true,
    };
    const result = service.runOptimization(baseInput, problem);
    expect(result.commissionPercent).toBeGreaterThan(0);
    expect(result.agentSplitPercent).toBeGreaterThanOrEqual(40);
    expect(result.agentSplitPercent).toBeLessThanOrEqual(90);
    expect(result.fitnessScore).toBeGreaterThan(0);
  });
});
