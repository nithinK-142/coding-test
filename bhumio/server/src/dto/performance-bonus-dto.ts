export type BonusTriggerType =
  | 'volume_milestone' // e.g. after Nth deal or after $X cumulative volume
  | 'date_triggered' // e.g. quarterly bonus
  | 'deal_count'; // e.g. $500 bonus after 10th deal in the year

export interface PerformanceBonusDto {
  name: string; // e.g. "Top Performer Bonus", "Q1 Volume Bonus"
  type: 'fixed' | 'percentage'; // fixed $ amount or % of commission
  value: number; // Amount (dollar if fixed, decimal if percentage e.g. 0.05)
  recipient: 'agent' | 'brokerage'; // Who receives the bonus

  // CC-02: Trigger conditions
  triggerType?: BonusTriggerType;
  threshold?: number; // Volume milestone ($) or deal count (#) to trigger bonus
  triggerDate?: string; // ISO date for date-triggered bonuses
}
