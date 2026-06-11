import { BrokerageMiscExpenseDto } from './brokerage-misc-expense.dto';
import { CommissionStructureDto } from './commission-structure.dto';
import { PerformanceBonusDto } from './performance-bonus-dto';
import { PostSplitDeductionDto } from './post-split-deduction.dto';
import { PreSplitDeductionDto } from './pre-split-deduction.dto';
import { SalesDataDto } from './sales-data.dto';

export interface OptimizationConstraintsOverrideDto {
  minCommissionPercent?: number;
  maxCommissionPercent?: number;
  minAgentSplitPercent?: number;
  maxAgentSplitPercent?: number;
  annualCap?: number;
}

export interface CompetitorStructureDto {
  name: string; // e.g. "eXp Realty"
  agentSplitPercent: number; // e.g. 80
  brokerageSplitPercent: number; // e.g. 20
  annualCap?: number; // e.g. 16000
  deskFeeMonthly?: number; // RE/MAX style monthly desk fee
}

export interface SimulationInputDto {
  pre_split_deductions: PreSplitDeductionDto[];
  post_split_deductions: PostSplitDeductionDto[];
  commission_structure_types: CommissionStructureDto[];
  brokerage_misc_expenses: BrokerageMiscExpenseDto[];
  performance_bonuses: PerformanceBonusDto[];
  sales_data: SalesDataDto[];

  // OPT-03: Optional override for optimization constraints
  optimizationConstraints?: OptimizationConstraintsOverrideDto;

  // OPT-06: Competitor structures for benchmarking
  competitors?: CompetitorStructureDto[];

  // CT-04: Multi-office / Market Center identifier
  officeId?: string;
}
