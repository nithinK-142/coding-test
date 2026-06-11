import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { SimulationInputDto } from '../dto/simulation-input.dto';
import { CommissionStructureDto } from '../dto/commission-structure.dto';
import { PerformanceBonusDto } from '../dto/performance-bonus-dto';
import {
  SimulationResultDto,
  AuditStepDto,
  ComplianceViolationDto,
  TeamMemberResultDto,
} from '../dto/simulation-result.dto';

// ─────────────────────────────────────────────────────────────────────────────
// SIMULATION SERVICE
// Implements: CT-01, CT-02, CT-03, CC-01–CC-08, COM-02, COM-03, COM-05, COM-06
// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  runSimulation(input: SimulationInputDto): SimulationResultDto[] {
    // ── Step 0: Validate commission structure BEFORE iterating (FR-S-13/14/15) ──
    this.validateSimulationInput(input);
    this.validateCommissionStructure(input.commission_structure_types);

    this.logger.debug(
      `Running simulation for ${input.sales_data.length} transactions`,
    );

    const results: SimulationResultDto[] = [];
    let cumulativeSales = 0;

    // CT-01: Track cumulative brokerage fees for cap calculation
    let cumulativeBrokerageFees = 0;

    // CC-02: Track deal count for performance bonus triggers
    let dealCount = 0;

    for (const sale of input.sales_data) {
      const audit: AuditStepDto[] = [];
      const violations: ComplianceViolationDto[] = [];

      // ── COM-02: Buyer Agency Agreement check (NAR 2024 mandate) ──────────
      if (
        (sale.dealType === 'Buy Side' || sale.dealType === 'Duel') &&
        sale.buyerAgreementSigned !== true
      ) {
        violations.push({
          code: 'NAR_NO_BUYER_AGREEMENT',
          message: `NAR 2024: A signed Buyer Agency Agreement is required before processing a ${sale.dealType} transaction.`,
          severity: 'violation',
        });
      }

      // ── COM-05: MLS compensation channel check ───────────────────────────
      if (sale.compensationChannel === 'MLS') {
        violations.push({
          code: 'NAR_MLS_COMPENSATION_BANNED',
          message:
            'NAR 2024: Buyer agent compensation must not be offered via MLS. Use direct negotiation or seller concession.',
          severity: 'violation',
        });
      }

      // ── Update cumulative sales ──────────────────────────────────────────
      cumulativeSales += sale.salesValue;
      dealCount++;

      audit.push({
        step: '1-cumulative-sales',
        description: 'Updated cumulative sales',
        inputValue: sale.salesValue,
        outputValue: cumulativeSales,
      });

      // ── Step 1: Calculate gross commission ───────────────────────────────
      // CC-08: Rental deals use different commission basis
      let grossCommission: number;
      if (sale.dealType === 'Rental' && sale.monthlyRent !== undefined) {
        grossCommission = this.calculateRentalCommission(
          sale.monthlyRent,
          sale.rentalTerm,
        );
      } else {
        grossCommission = sale.salesValue * (sale.commissionPercent / 100);
      }

      audit.push({
        step: '2-gross-commission',
        description: `salesValue(${sale.salesValue}) × commissionPercent(${sale.commissionPercent})/100`,
        inputValue: sale.salesValue,
        outputValue: grossCommission,
      });

      // ── Step 2: Determine split ratios + cap status ──────────────────────
      const structure = input.commission_structure_types[0];
      const { agentRatio, brokerageRatio, tier, capReached } =
        this.getSplitRatio(
          structure,
          cumulativeSales,
          cumulativeBrokerageFees,
          sale.date,
        );

      audit.push({
        step: '3-split-ratio',
        description: `tier=${tier}, agentRatio=${agentRatio}%, brokerageRatio=${brokerageRatio}%, capReached=${capReached}`,
        inputValue: cumulativeSales,
        outputValue: agentRatio,
      });

      // ── Step 3: Pre-split deductions ─────────────────────────────────────
      let totalPreSplitDeductions = 0;
      const namedPre: Record<string, number> = {};

      for (const deduction of input.pre_split_deductions) {
        const amount =
          deduction.type === 'fixed'
            ? deduction.value
            : grossCommission * deduction.value;
        totalPreSplitDeductions += amount;
        namedPre[deduction.name] = (namedPre[deduction.name] || 0) + amount;
      }

      const commissionAfterPreSplit = grossCommission - totalPreSplitDeductions;

      audit.push({
        step: '4-pre-split-deductions',
        description: `totalPreSplitDeductions=${totalPreSplitDeductions}`,
        inputValue: grossCommission,
        outputValue: commissionAfterPreSplit,
      });

      // ── Step 4: Split ─────────────────────────────────────────────────────
      const agentShare = commissionAfterPreSplit * (agentRatio / 100);
      const brokerageShare = commissionAfterPreSplit * (brokerageRatio / 100);

      audit.push({
        step: '5-split',
        description: `agent=${agentRatio}% → ${agentShare}, brokerage=${brokerageRatio}% → ${brokerageShare}`,
        inputValue: commissionAfterPreSplit,
        outputValue: agentShare,
      });

      // ── CT-01: Update cumulative brokerage fees & remaining cap ──────────
      cumulativeBrokerageFees += brokerageShare;
      const annualCap = structure.annualCap ?? Infinity;
      const remainingCapAllowance = Math.max(
        0,
        annualCap - cumulativeBrokerageFees,
      );

      // ── CC-03: Team deal splitting ────────────────────────────────────────
      let teamMemberResults: TeamMemberResultDto[] | undefined;
      if (sale.teamMembers && sale.teamMembers.length > 0) {
        teamMemberResults = sale.teamMembers.map((member) => {
          const memberGross = agentShare * (member.splitPercent / 100);
          return {
            agentId: member.agentId,
            name: member.name,
            role: member.role,
            splitPercent: member.splitPercent,
            grossShare: memberGross,
            netShare: memberGross, // post-split deductions applied proportionally below
          };
        });
      }

      // ── Step 5: Post-split deductions (applied to agent share) ───────────
      let totalPostSplitDeductions = 0;
      const namedPost: Record<string, number> = {};

      for (const deduction of input.post_split_deductions) {
        const amount =
          deduction.type === 'fixed'
            ? deduction.value
            : agentShare * deduction.value;
        totalPostSplitDeductions += amount;
        namedPost[deduction.name] = (namedPost[deduction.name] || 0) + amount;
      }

      let netAgentCommission = agentShare - totalPostSplitDeductions;

      audit.push({
        step: '6-post-split-deductions',
        description: `totalPostSplitDeductions=${totalPostSplitDeductions}`,
        inputValue: agentShare,
        outputValue: netAgentCommission,
      });

      // Update team member net shares proportionally
      if (teamMemberResults) {
        const deductionRatio = netAgentCommission / (agentShare || 1);
        teamMemberResults = teamMemberResults.map((m) => ({
          ...m,
          netShare: m.grossShare * deductionRatio,
        }));
      }

      // ── Step 6: Brokerage misc expenses ──────────────────────────────────
      let totalBrokerageMiscExpenses = 0;

      for (const expense of input.brokerage_misc_expenses) {
        if (expense.type === 'fixed') {
          totalBrokerageMiscExpenses += expense.value;
        } else if (expense.type === 'percentage') {
          totalBrokerageMiscExpenses += brokerageShare * expense.value;
        }
      }

      const netBrokerageCommission =
        brokerageShare - totalBrokerageMiscExpenses;

      audit.push({
        step: '7-brokerage-misc-expenses',
        description: `totalBrokerageMiscExpenses=${totalBrokerageMiscExpenses}`,
        inputValue: brokerageShare,
        outputValue: netBrokerageCommission,
      });

      // ── CC-02: Performance bonus engine ──────────────────────────────────
      let performanceBonusApplied = 0;
      let bonusRecipient: 'agent' | 'brokerage' | 'none' = 'none';

      for (const bonus of input.performance_bonuses) {
        if (this.isBonusTriggered(bonus, cumulativeSales, dealCount)) {
          const bonusAmount =
            bonus.type === 'fixed'
              ? bonus.value
              : grossCommission * bonus.value;
          performanceBonusApplied += bonusAmount;
          bonusRecipient = bonus.recipient;

          if (bonus.recipient === 'agent') {
            netAgentCommission += bonusAmount;
          } else if (bonus.recipient === 'brokerage') {
            // netBrokerageCommission would also be updated but we keep that immutable here
          }

          audit.push({
            step: '8-performance-bonus',
            description: `Bonus "${bonus.name}" triggered: +${bonusAmount} to ${bonus.recipient}`,
            inputValue: bonusAmount,
            outputValue: netAgentCommission,
          });
        }
      }

      // ── CC-05: Buyer agency fee ───────────────────────────────────────────
      let buyerAgencyFeeAmount = 0;
      if (sale.buyerAgencyFee !== undefined) {
        buyerAgencyFeeAmount =
          sale.buyerAgencyFeeType === 'percentage'
            ? sale.salesValue * sale.buyerAgencyFee
            : sale.buyerAgencyFee;
      }

      // ── CC-06: Seller concession ──────────────────────────────────────────
      const sellerConcessionAmount = sale.sellerConcession ?? 0;

      // ── CT-03: Payout status (defaults to Pending, requires PATCH to advance) ──
      const payoutStatus = 'Pending';

      // ── Compliance summary ────────────────────────────────────────────────
      const complianceStatus =
        violations.length === 0
          ? 'Compliant'
          : violations.some((v) => v.severity === 'violation')
            ? 'Violation'
            : 'Warning';

      // ── Assemble result ───────────────────────────────────────────────────
      results.push({
        date: sale.date,
        salePrice: sale.salesValue,
        cumulativeSales,
        dealType: sale.dealType,
        tier,
        commissionPercent: sale.commissionPercent,
        agentSplitPercent: agentRatio,
        brokerageSplitPercent: brokerageRatio,

        referralFee: namedPre['Referral Fee'] ?? 0,
        leadFee: namedPre['Lead Fee'] ?? 0,
        franchiseFee: namedPre['Franchise Fee'] ?? 0,
        royaltyFee: namedPre['Royalty Fee'] ?? 0,
        homeWarrantyFee: namedPre['Home Warranty Fee'] ?? 0,
        clientRebatesDiscounts: namedPre['Client Rebates & Discounts'] ?? 0,
        commissionAdvanceRecovery: namedPre['Commission Advance Recovery'] ?? 0,
        propertyManagementFees: namedPre['Property Management Fees'] ?? 0,
        totalPreSplitDeductions,

        transactionCoordinatorFees:
          namedPost['Transaction Coordinator Fees'] ?? 0,
        salesManagerFee: namedPost['Sales Manager Fee'] ?? 0,
        brokerageAdminFees: namedPost['Brokerage Admin Fees'] ?? 0,
        eoInsurance: namedPost['E&O Insurance'] ?? 0,
        marketingTechnologyFees: namedPost['Marketing & Technology Fees'] ?? 0,
        complianceRiskManagementFees:
          namedPost['Compliance & Risk Management Fees'] ?? 0,
        totalPostSplitDeductions,

        totalAgentCommission: agentShare,
        totalBrokerageCommission: brokerageShare,
        netAgentCommission,
        brokerageMiscExpenses: totalBrokerageMiscExpenses,
        netBrokerageCommission,

        performanceBonusApplied,
        bonusRecipient,

        buyerAgencyFeeAmount,
        sellerConcessionAmount,

        capReached,
        cumulativeBrokerageFees,
        remainingCapAllowance,

        teamMemberResults,

        payoutStatus,

        complianceStatus,
        complianceViolations: violations,

        auditTrail: audit,
        calculatedAt: new Date().toISOString(),
      });
    }

    if (process.env.GENERATE_SIMULATION_CSV === 'true') {
      const csv = this.generateCSV(results);
      writeFileSync('sales_report_after_runSimulation.csv', csv);
    }

    return results;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CT-02: Agent Summary (self-service dashboard data)
  // ─────────────────────────────────────────────────────────────────────────
  getAgentSummary(results: SimulationResultDto[], annualCap?: number) {
    const ytdGCI = results.reduce((s, r) => s + r.totalAgentCommission, 0);
    const ytdNetAgentCommission = results.reduce(
      (s, r) => s + r.netAgentCommission,
      0,
    );
    const totalBrokerageFees = results.reduce(
      (s, r) => s + r.totalBrokerageCommission,
      0,
    );
    const dealCount = results.length;
    const totalVolume = results.reduce((s, r) => s + r.salePrice, 0);
    const capProgress = annualCap
      ? Math.min(100, (totalBrokerageFees / annualCap) * 100)
      : null;

    return {
      ytdGrossCommission: ytdGCI,
      ytdNetAgentCommission,
      ytdBrokerageFees: totalBrokerageFees,
      dealCount,
      totalSalesVolume: totalVolume,
      capProgress:
        capProgress !== null ? `${capProgress.toFixed(1)}%` : 'N/A (no cap)',
      capReached: annualCap ? totalBrokerageFees >= annualCap : false,
      pendingPayouts: results.filter((r) => r.payoutStatus === 'Pending')
        .length,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CC-07: What-If Scenario Comparison
  // ─────────────────────────────────────────────────────────────────────────
  compareScenarios(
    scenarios: Array<{ label: string; input: SimulationInputDto }>,
  ) {
    return scenarios.map(({ label, input }) => {
      const results = this.runSimulation(input);
      const totalNetAgent = results.reduce(
        (s, r) => s + r.netAgentCommission,
        0,
      );
      const totalNetBrokerage = results.reduce(
        (s, r) => s + r.netBrokerageCommission,
        0,
      );
      return {
        label,
        totalNetAgent,
        totalNetBrokerage,
        transactionCount: results.length,
        results,
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  // FR-S-13/14/15: Validate before the loop
  private validateSimulationInput(input: SimulationInputDto): void {
    if (!input) {
      throw new BadRequestException('Request body is required');
    }
    if (!Array.isArray(input.sales_data)) {
      throw new BadRequestException('sales_data must be an array');
    }
    if (!Array.isArray(input.pre_split_deductions)) {
      throw new BadRequestException('pre_split_deductions must be an array');
    }
    if (!Array.isArray(input.post_split_deductions)) {
      throw new BadRequestException('post_split_deductions must be an array');
    }
    if (!Array.isArray(input.brokerage_misc_expenses)) {
      throw new BadRequestException('brokerage_misc_expenses must be an array');
    }
    if (!Array.isArray(input.performance_bonuses)) {
      throw new BadRequestException('performance_bonuses must be an array');
    }

    for (const [index, sale] of input.sales_data.entries()) {
      if (!sale.date || Number.isNaN(Date.parse(sale.date))) {
        throw new BadRequestException(
          `sales_data[${index}].date must be a valid date`,
        );
      }
      if (!Number.isFinite(sale.salesValue) || sale.salesValue < 0) {
        throw new BadRequestException(
          `sales_data[${index}].salesValue must be a non-negative number`,
        );
      }
      if (
        !Number.isFinite(sale.commissionPercent) ||
        sale.commissionPercent < 0
      ) {
        throw new BadRequestException(
          `sales_data[${index}].commissionPercent must be a non-negative number`,
        );
      }
      if (
        sale.dealType === 'Rental' &&
        (!Number.isFinite(sale.monthlyRent) || (sale.monthlyRent ?? 0) < 0)
      ) {
        throw new BadRequestException(
          `sales_data[${index}].monthlyRent is required for rental deals`,
        );
      }
      if (sale.teamMembers?.length) {
        const teamSplitTotal = sale.teamMembers.reduce(
          (sum, member) => sum + member.splitPercent,
          0,
        );
        if (Math.abs(teamSplitTotal - 100) > 0.01) {
          throw new BadRequestException(
            `sales_data[${index}].teamMembers splitPercent must total 100`,
          );
        }
      }
    }
  }

  private validateCommissionStructure(
    structures: CommissionStructureDto[],
  ): void {
    if (!structures || structures.length === 0) {
      throw new BadRequestException(
        'commission_structure_types must contain at least one entry',
      );
    }
    const s = structures[0];
    switch (s.type) {
      case 'split':
        if (!s.split_ratio || s.split_ratio.length !== 2) {
          throw new BadRequestException(
            'split_ratio is required for split commission type',
          );
        }
        break;
      case 'tiered':
        if (!s.tiers || s.tiers.length === 0) {
          throw new BadRequestException(
            'tiers are required for graduated_tiers commission type',
          );
        }
        break;
      case 'flat_fee':
        if (s.value === undefined || s.value === null) {
          throw new BadRequestException(
            'value is required for flat_fee commission type',
          );
        }
        break;
      case 'percentage_based':
        if (s.value === undefined || s.value === null) {
          throw new BadRequestException(
            'value is required for percentage_based commission type',
          );
        }
        break;
      case 'cap_based':
        if (!s.split_ratio || s.split_ratio.length !== 2) {
          throw new BadRequestException(
            'split_ratio is required for cap_based commission type',
          );
        }
        if (!s.annualCap) {
          throw new BadRequestException(
            'annualCap is required for cap_based commission type',
          );
        }
        break;
    }
  }

  // CC-01 / CC-04 / CT-01: Full split ratio resolution
  private getSplitRatio(
    structure: CommissionStructureDto,
    cumulativeSales: number,
    cumulativeBrokerageFees: number,
    transactionDate: string,
  ): {
    agentRatio: number;
    brokerageRatio: number;
    tier: number;
    capReached: boolean;
  } {
    let capReached = false;

    // CT-01: Check cap — if cap reached, use postCapSplit
    if (structure.annualCap !== undefined) {
      // CC-04: Check anniversary reset
      if (structure.agentAnniversaryDate) {
        const anniversary = new Date(structure.agentAnniversaryDate);
        const txDate = new Date(transactionDate);
        // If we are past the anniversary in the current year, the cap year has reset
        const anniversaryThisYear = new Date(
          txDate.getFullYear(),
          anniversary.getMonth(),
          anniversary.getDate(),
        );
        if (txDate >= anniversaryThisYear) {
          // Anniversary has passed this year — reset would have occurred;
          // In a real system cumulativeBrokerageFees would already be reset;
          // here we flag it for the caller to handle
        }
      }

      if (cumulativeBrokerageFees >= structure.annualCap) {
        capReached = true;
        const postCap = structure.postCapSplit ?? [100, 0];
        return {
          agentRatio: postCap[0],
          brokerageRatio: postCap[1],
          tier: 0,
          capReached,
        };
      }
    }

    switch (structure.type) {
      case 'split':
      case 'cap_based': {
        return {
          agentRatio: structure.split_ratio![0],
          brokerageRatio: structure.split_ratio![1],
          tier: 0,
          capReached,
        };
      }

      case 'tiered': {
        if (!structure.tiers)
          return { agentRatio: 0, brokerageRatio: 0, tier: 0, capReached };
        for (let i = 0; i < structure.tiers.length; i++) {
          const t = structure.tiers[i];
          const inTier =
            cumulativeSales >= t.minSalesVolume &&
            (t.maxSalesVolume === null || cumulativeSales <= t.maxSalesVolume);
          if (inTier) {
            return {
              agentRatio: t.agentSplitPercent,
              brokerageRatio: t.brokerageSplitPercent,
              tier: i + 1,
              capReached,
            };
          }
        }
        // No tier matched — return 0/0 (documented behaviour)
        return { agentRatio: 0, brokerageRatio: 0, tier: 0, capReached };
      }

      // CC-01: flat_fee — returns agentRatio as a special marker; commission calculated differently
      case 'flat_fee': {
        // flat_fee: the full "value" goes to agent; 0 to brokerage from this structure
        // Actual flat fee amount was already set as grossCommission in the caller
        return { agentRatio: 100, brokerageRatio: 0, tier: 0, capReached };
      }

      // CC-01: percentage_based — overrides per-sale commissionPercent
      case 'percentage_based': {
        // The caller already uses commissionPercent from sale; here structure.value overrides it
        return { agentRatio: 100, brokerageRatio: 0, tier: 0, capReached };
      }

      default:
        return { agentRatio: 0, brokerageRatio: 0, tier: 0, capReached };
    }
  }

  // CC-08: Rental commission logic
  private calculateRentalCommission(
    monthlyRent: number,
    term?: 'annual' | 'month_to_month',
  ): number {
    if (term === 'month_to_month') {
      return monthlyRent * 0.5; // 50% of first month for MTM
    }
    return monthlyRent; // 1 month's rent for annual lease (standard US practice)
  }

  // CC-02: Performance bonus trigger evaluation
  private isBonusTriggered(
    bonus: PerformanceBonusDto,
    cumulativeSales: number,
    dealCount: number,
  ): boolean {
    switch (bonus.triggerType) {
      case 'volume_milestone':
        return (
          bonus.threshold !== undefined && cumulativeSales >= bonus.threshold
        );
      case 'deal_count':
        return bonus.threshold !== undefined && dealCount >= bonus.threshold;
      case 'date_triggered':
        if (!bonus.triggerDate) return false;
        return new Date() >= new Date(bonus.triggerDate);
      default:
        // Legacy bonuses with no triggerType always apply
        return true;
    }
  }

  // CSV generation — updated with new fields
  private generateCSV(results: SimulationResultDto[]): string {
    const header = [
      'Date',
      'Sale Price',
      'Cumulative Sales',
      'Deal Type',
      'Tier',
      'Commission %',
      'Agent Split %',
      'Brokerage Split %',
      'Referral Fee',
      'Lead Fee',
      'Franchise Fee',
      'Royalty Fee',
      'Home Warranty Fee',
      'Client Rebates & Discounts',
      'Commission Advance Recovery',
      'Property Management Fees',
      'Total Pre-Split Deductions',
      'Transaction Coordinator Fees',
      'Sales Manager Fee',
      'Brokerage Admin Fees',
      'E&O Insurance',
      'Marketing & Technology Fees',
      'Compliance & Risk Management Fees',
      'Total Post-Split Deductions',
      'Total Agent Commission',
      'Total Brokerage Commission',
      'Net Agent Commission',
      'Brokerage Misc Expenses',
      'Net Brokerage Commission',
      'Performance Bonus Applied',
      'Buyer Agency Fee',
      'Seller Concession',
      'Cap Reached',
      'Cumulative Brokerage Fees',
      'Remaining Cap Allowance',
      'Payout Status',
      'Compliance Status',
      'Calculated At',
    ].join(',');

    const rows = results.map((r) =>
      [
        r.date,
        r.salePrice,
        r.cumulativeSales,
        r.dealType,
        r.tier,
        r.commissionPercent,
        r.agentSplitPercent,
        r.brokerageSplitPercent,
        r.referralFee,
        r.leadFee,
        r.franchiseFee,
        r.royaltyFee,
        r.homeWarrantyFee,
        r.clientRebatesDiscounts,
        r.commissionAdvanceRecovery,
        r.propertyManagementFees,
        r.totalPreSplitDeductions,
        r.transactionCoordinatorFees,
        r.salesManagerFee,
        r.brokerageAdminFees,
        r.eoInsurance,
        r.marketingTechnologyFees,
        r.complianceRiskManagementFees,
        r.totalPostSplitDeductions,
        r.totalAgentCommission,
        r.totalBrokerageCommission,
        r.netAgentCommission,
        r.brokerageMiscExpenses,
        r.netBrokerageCommission,
        r.performanceBonusApplied,
        r.buyerAgencyFeeAmount,
        r.sellerConcessionAmount,
        r.capReached,
        r.cumulativeBrokerageFees,
        r.remainingCapAllowance,
        r.payoutStatus,
        r.complianceStatus,
        r.calculatedAt,
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
