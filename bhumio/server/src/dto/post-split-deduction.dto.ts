export interface PostSplitDeductionDto {
  name: string; // Name of the deduction (e.g., "Transaction Coordinator Fees")
  type: 'fixed' | 'percentage'; // Type of deduction (fixed amount or percentage)
  value: number; // Value of the deduction (fixed amount or percentage)
}
