import { SimulationInputDto } from './simulation-input.dto';
import { PreSplitDeductionDto } from './pre-split-deduction.dto';
import { PostSplitDeductionDto } from './post-split-deduction.dto';
import { BrokerageMiscExpenseDto } from './brokerage-misc-expense.dto';

export interface OptimizedSimulationInputDto extends SimulationInputDto {
  optimizationResults: {
    optimizedCommissionPercent: number; // Optimized commission percentage
    optimizedAgentSplitPercent: number; // Optimized agent split percentage
    optimizedBrokerageSplitPercent: number; // Optimized brokerage split percentage
    optimizedPreSplitDeductions: PreSplitDeductionDto[]; // Optimized pre-split deductions
    optimizedPostSplitDeductions: PostSplitDeductionDto[]; // Optimized post-split deductions
    optimizedBrokerageMiscExpenses: BrokerageMiscExpenseDto[]; // Optimized brokerage miscellaneous expenses
  };
}
