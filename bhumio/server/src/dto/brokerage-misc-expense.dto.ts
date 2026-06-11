export interface BrokerageMiscExpenseDto {
  name: string; // Name of the expense (e.g., "Transaction Fee")
  type: 'fixed' | 'percentage'; // Type of expense (fixed amount or percentage)
  value: number; // Value of the expense (fixed amount or percentage)
}
