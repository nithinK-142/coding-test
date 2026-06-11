export interface CommissionTierDto {
  minSalesVolume: number; // Minimum cumulative sales volume for this tier (inclusive)
  maxSalesVolume: number | null; // Maximum cumulative sales volume (null = no upper limit, inclusive)
  agentSplitPercent: number; // Agent's share percentage in this tier
  brokerageSplitPercent: number; // Brokerage's share percentage in this tier
}

export interface CommissionStructureDto {
  type: 'split' | 'flat_fee' | 'percentage_based' | 'tiered' | 'cap_based'; // CC-01 / CT-01

  // 'split': fixed percentages regardless of volume
  split_ratio?: [number, number]; // [agentPct, brokeragePct] — must sum to 100

  // 'flat_fee': CC-01 — fixed dollar commission per transaction
  value?: number;

  // 'tiered': cumulative-volume brackets
  tiers?: CommissionTierDto[];

  // CT-01: Annual cap model (eXp / KW style)
  annualCap?: number; // Max brokerage fees per anniversary year (e.g. 16000)
  postCapSplit?: [number, number]; // Split after cap is reached (e.g. [100, 0] = agent keeps all)
  agentAnniversaryDate?: string; // ISO date for anniversary reset (e.g. "2024-03-15")
}
