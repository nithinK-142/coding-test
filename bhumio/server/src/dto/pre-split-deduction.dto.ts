export interface PreSplitDeductionDto {
  name: string; // Name of the deduction (e.g., "Referral Fee")
  type: 'fixed' | 'percentage'; // Type of deduction (fixed amount or percentage)
  value: number; // Value of the deduction (fixed amount or percentage)
}
