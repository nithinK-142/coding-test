export interface OptimizationProblemDto {
  objective: 'maximizeAgentEarnings' | 'maximizeBrokerageProfit';

  constraints: {
    minCommissionPercent: number;
    maxCommissionPercent: number;
    minAgentSplitPercent: number;
    maxAgentSplitPercent: number;
    minBrokerageSplitPercent: number;
    maxBrokerageSplitPercent: number;
    annualCap?: number; // CT-01 / OPT-04: cap constraint
  };

  useGeneticAlgorithm?: boolean; // OPT-01: false = LP, true = GA (now actually respected)
}
