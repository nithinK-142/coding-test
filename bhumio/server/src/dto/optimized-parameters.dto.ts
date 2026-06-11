import { PreSplitDeductionDto } from './pre-split-deduction.dto';
import { PostSplitDeductionDto } from './post-split-deduction.dto';
import { BrokerageMiscExpenseDto } from './brokerage-misc-expense.dto';

export interface CompetitorComparisonDto {
  competitorName: string;
  competitorAgentSplit: number;
  ourAgentSplit: number;
  splitDelta: number; // positive = we are better for agent
  competitorAnnualCap?: number;
  ourAnnualCap?: number;
  capDelta?: number; // positive = our cap is lower (better for agent)
  verdict: 'We Win' | 'Competitor Wins' | 'Tie';
}

export interface OptimizedParametersDto {
  commissionPercent: number;
  agentSplitPercent: number;
  brokerageSplitPercent: number;
  preSplitDeductions: PreSplitDeductionDto[];
  postSplitDeductions: PostSplitDeductionDto[];
  brokerageMiscExpenses: BrokerageMiscExpenseDto[];

  // OPT-04: Cap-aware optimization output
  recommendedAnnualCap?: number;

  // OPT-06: Competitor benchmarking results
  competitorComparisons?: CompetitorComparisonDto[];

  // Solver metadata
  solverUsed: 'lp' | 'ga';
  fitnessScore?: number;
}
