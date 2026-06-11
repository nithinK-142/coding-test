export interface TeamMemberDto {
  agentId: string; // Unique agent identifier
  name: string; // Agent name
  splitPercent: number; // This team member's share of the agent-side commission (must sum to 100)
  role: 'lead' | 'buyers_agent' | 'showing_agent';
}

export interface SalesDataDto {
  date: string; // Date of the sale (e.g., "2024-01-12")
  salesValue: number; // Value of the sale
  cumulativeSales: number; // Cumulative sales value (overridden internally)
  dealType: 'Buy Side' | 'Listing' | 'Duel' | 'Rental'; // Deal type
  commissionPercent: number; // Commission percentage (e.g., 6 means 6%)

  // CC-05 / COM-02: Post-NAR 2024 settlement fields
  buyerAgencyFee?: number; // Buyer agent fee agreed in Buyer Agency Agreement (fixed $)
  buyerAgencyFeeType?: 'fixed' | 'percentage'; // How buyer agency fee is expressed
  buyerAgreementSigned?: boolean; // COM-02: must be true for Buy Side / Duel deals
  buyerAgreementDate?: string; // Date the Buyer Agency Agreement was signed

  // CC-06: Seller concession (may fund buyer agent compensation)
  sellerConcession?: number; // Dollar amount of seller concession

  // COM-05: Compensation channel validation (must NOT be 'MLS' post-NAR settlement)
  compensationChannel?: 'direct' | 'concession' | 'MLS';

  // CC-03: Team deal splitting
  teamMembers?: TeamMemberDto[]; // If set, agent-side commission is split among team

  // CT-01: Per-sale rental term (for CC-08 rental commission logic)
  rentalTerm?: 'annual' | 'month_to_month'; // Rental-specific: affects commission calculation
  monthlyRent?: number; // For rental deals: monthly rent amount
}
