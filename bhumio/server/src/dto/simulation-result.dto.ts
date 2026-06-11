export interface TeamMemberResultDto {
  agentId: string;
  name: string;
  role: string;
  splitPercent: number;
  grossShare: number; // Share before post-split deductions
  netShare: number; // Share after post-split deductions applied proportionally
}

export interface AuditStepDto {
  step: string;
  description: string;
  inputValue: number;
  outputValue: number;
}

export type PayoutStatus = 'Pending' | 'Approved' | 'Disbursed' | 'Disputed';
export type ComplianceStatus = 'Compliant' | 'Warning' | 'Violation';

export interface ComplianceViolationDto {
  code: string; // e.g. "NAR_NO_BUYER_AGREEMENT"
  message: string;
  severity: 'warning' | 'violation';
}

export interface SimulationResultDto {
  // ── Identity ─────────────────────────────────────────────────────────────
  date: string;
  salePrice: number;
  cumulativeSales: number;
  dealType: string;
  tier: number;
  commissionPercent: number;
  agentSplitPercent: number;
  brokerageSplitPercent: number;

  // ── Pre-split deductions (individual named fields) ────────────────────
  referralFee: number;
  leadFee: number;
  franchiseFee: number;
  royaltyFee: number;
  homeWarrantyFee: number;
  clientRebatesDiscounts: number;
  commissionAdvanceRecovery: number;
  propertyManagementFees: number;
  totalPreSplitDeductions: number;

  // ── Post-split deductions (individual named fields) ───────────────────
  transactionCoordinatorFees: number;
  salesManagerFee: number;
  brokerageAdminFees: number;
  eoInsurance: number;
  marketingTechnologyFees: number;
  complianceRiskManagementFees: number;
  totalPostSplitDeductions: number;

  // ── Commission totals ─────────────────────────────────────────────────
  totalAgentCommission: number; // Agent share before post-split deductions
  totalBrokerageCommission: number; // Brokerage share before misc expenses
  netAgentCommission: number; // Agent take-home after all deductions
  brokerageMiscExpenses: number;
  netBrokerageCommission: number;

  // ── CC-02: Performance bonus applied this transaction ─────────────────
  performanceBonusApplied: number; // Total bonus amount applied
  bonusRecipient: 'agent' | 'brokerage' | 'none';

  // ── CC-05/06: Post-NAR settlement fields ──────────────────────────────
  buyerAgencyFeeAmount: number; // Calculated buyer agency fee for this deal
  sellerConcessionAmount: number; // Seller concession applied

  // ── CT-01: Cap tracking ───────────────────────────────────────────────
  capReached: boolean; // True if annual brokerage cap was hit on this transaction
  cumulativeBrokerageFees: number; // Running total of brokerage fees this anniversary year
  remainingCapAllowance: number; // How much cap headroom remains (0 if cap reached)

  // ── CC-03: Team deal results ──────────────────────────────────────────
  teamMemberResults?: TeamMemberResultDto[];

  // ── CT-03: Disbursement workflow ──────────────────────────────────────
  payoutStatus: PayoutStatus;
  approvedAt?: string;

  // ── COM-02/03: Compliance ─────────────────────────────────────────────
  complianceStatus: ComplianceStatus;
  complianceViolations: ComplianceViolationDto[];

  // ── COM-03: Audit trail ───────────────────────────────────────────────
  auditTrail: AuditStepDto[];
  calculatedAt: string; // ISO timestamp of calculation
}
