import { SimulationService } from './simulation.service';
import { SimulationInputDto } from '../dto/simulation-input.dto';
import { SimulationResultDto } from '../dto/simulation-result.dto';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// Load tier test data
const testDataTierPath = path.join(__dirname, 'test-data-tier.json');
const tierInput = JSON.parse(
  readFileSync(testDataTierPath, 'utf8'),
) as SimulationInputDto;

// ─────────────────────────────────────────────────────────────────────────────
describe('SimulationService — Commission Calculation Tests', () => {
  // ── Baseline ────────────────────────────────────────────────────────────
  it('should return empty array when sales_data is empty', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [],
    };
    const results = service.runSimulation(input);
    expect(results.length).toBe(0);
  });

  // ── Validation guards (FR-S-13/14/15) ───────────────────────────────────
  it('should throw if split_ratio is missing for split type', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split' }], // no split_ratio
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 56000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    expect(() => service.runSimulation(input)).toThrow(
      'split_ratio is required for split commission type',
    );
  });

  it('should throw if tiers are missing for tiered type', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'tiered' }], // no tiers
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 56000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    expect(() => service.runSimulation(input)).toThrow(
      'tiers are required for graduated_tiers commission type',
    );
  });

  it('should throw if value is missing for flat_fee type', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'flat_fee' }], // no value
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 59000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    expect(() => service.runSimulation(input)).toThrow(
      'value is required for flat_fee commission type',
    );
  });

  it('should throw if value is missing for percentage_based type', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'percentage_based' }], // no value
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 56000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    expect(() => service.runSimulation(input)).toThrow(
      'value is required for percentage_based commission type',
    );
  });

  // ── Split commission ─────────────────────────────────────────────────────
  it('should calculate correct split commission — 80/20 on $500,000 at 6%', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 500000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    const results = service.runSimulation(input);
    // 6% of 500,000 = 30,000; agent 80% = 24,000
    expect(results[0].totalAgentCommission).toBeCloseTo(24000);
    expect(results[0].totalBrokerageCommission).toBeCloseTo(6000);
    expect(results[0].netAgentCommission).toBeCloseTo(24000);
  });

  // ── Tiered commission ────────────────────────────────────────────────────
  it('should apply correct tier based on cumulative sales', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [
        {
          type: 'tiered',
          tiers: [
            {
              minSalesVolume: 0,
              maxSalesVolume: 600000,
              agentSplitPercent: 80,
              brokerageSplitPercent: 20,
            },
            {
              minSalesVolume: 600001,
              maxSalesVolume: null,
              agentSplitPercent: 90,
              brokerageSplitPercent: 10,
            },
          ],
        },
      ],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-12',
          salesValue: 500000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
        {
          date: '2024-02-01',
          salesValue: 200000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    const results = service.runSimulation(input);
    // Sale 1: cumulative=500000 → tier 1 (80%). 6% of 500k = 30,000; agent = 24,000
    expect(results[0].totalAgentCommission).toBeCloseTo(24000);
    expect(results[0].tier).toBe(1);
    // Sale 2: cumulative=700000 → tier 2 (90%). 6% of 200k = 12,000; agent = 10,800
    // BUG FIX: original test expected 90,000 (wrong by 10x). Correct value is 10,800.
    expect(results[1].totalAgentCommission).toBeCloseTo(10800);
    expect(results[1].tier).toBe(2);
  });

  // ── CT-01: Annual cap tracking ───────────────────────────────────────────
  it('CT-01: should switch to post-cap split once annual brokerage cap is reached', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [
        {
          type: 'cap_based',
          split_ratio: [80, 20],
          annualCap: 5000, // Cap: brokerage receives at most $5,000/year
          postCapSplit: [100, 0], // After cap: agent keeps 100%
        },
      ],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        // Sale 1: 6% of 200,000 = 12,000; brokerage 20% = 2,400 (cumulative fees: 2,400)
        {
          date: '2024-01-01',
          salesValue: 200000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
        // Sale 2: 6% of 200,000 = 12,000; brokerage 20% = 2,400 (cumulative fees: 4,800)
        {
          date: '2024-02-01',
          salesValue: 200000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
        // Sale 3: cap crossed (4,800 > 5,000? No — but next would cross). Check on sale 4.
        {
          date: '2024-03-01',
          salesValue: 200000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
        // Sale 4: cumulativeBrokerageFees = 7,200 > 5,000 → cap reached, agent gets 100%
        {
          date: '2024-04-01',
          salesValue: 200000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    const results = service.runSimulation(input);
    // Sale 1 & 2 & 3: normal 80/20 split
    expect(results[0].agentSplitPercent).toBe(80);
    expect(results[0].capReached).toBe(false);
    // Sale 4: cap exceeded → post-cap 100/0
    expect(results[3].capReached).toBe(true);
    expect(results[3].agentSplitPercent).toBe(100);
    expect(results[3].brokerageSplitPercent).toBe(0);
  });

  // ── CC-02: Performance bonus ─────────────────────────────────────────────
  it('CC-02: should apply deal-count bonus to agent after 2nd deal', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [
        {
          name: 'Deal Milestone Bonus',
          type: 'fixed',
          value: 500,
          recipient: 'agent',
          triggerType: 'deal_count',
          threshold: 2, // fires from deal #2 onwards
        },
      ],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 100000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 3,
        },
        {
          date: '2024-02-01',
          salesValue: 100000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 3,
        },
      ],
    };
    const results = service.runSimulation(input);
    expect(results[0].performanceBonusApplied).toBe(0); // deal #1: bonus not yet triggered
    expect(results[1].performanceBonusApplied).toBe(500); // deal #2: bonus triggered
    expect(results[1].bonusRecipient).toBe('agent');
  });

  // ── COM-02: NAR Buyer Agency Agreement ──────────────────────────────────
  it('COM-02: should flag Buy Side deal with no buyerAgreementSigned as violation', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-09-01',
          salesValue: 400000,
          cumulativeSales: 0,
          dealType: 'Buy Side',
          commissionPercent: 3,
          // buyerAgreementSigned intentionally absent
        },
      ],
    };
    const results = service.runSimulation(input);
    expect(results[0].complianceStatus).toBe('Violation');
    expect(results[0].complianceViolations[0].code).toBe(
      'NAR_NO_BUYER_AGREEMENT',
    );
  });

  it('COM-02: should mark Buy Side deal compliant when buyerAgreementSigned is true', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-09-01',
          salesValue: 400000,
          cumulativeSales: 0,
          dealType: 'Buy Side',
          commissionPercent: 3,
          buyerAgreementSigned: true,
          buyerAgreementDate: '2024-08-20',
          compensationChannel: 'direct',
        },
      ],
    };
    const results = service.runSimulation(input);
    expect(results[0].complianceStatus).toBe('Compliant');
    expect(results[0].complianceViolations.length).toBe(0);
  });

  // ── COM-05: MLS compensation ban ────────────────────────────────────────
  it('COM-05: should flag MLS compensation channel as violation', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-09-01',
          salesValue: 400000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
          compensationChannel: 'MLS', // violation
        },
      ],
    };
    const results = service.runSimulation(input);
    expect(
      results[0].complianceViolations.some(
        (v) => v.code === 'NAR_MLS_COMPENSATION_BANNED',
      ),
    ).toBe(true);
  });

  // ── CC-03: Team deals ────────────────────────────────────────────────────
  it('CC-03: should split agent-side commission among team members', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 500000,
          cumulativeSales: 0,
          dealType: 'Buy Side',
          commissionPercent: 6,
          buyerAgreementSigned: true,
          teamMembers: [
            {
              agentId: 'A1',
              name: 'Lead Agent',
              role: 'lead',
              splitPercent: 60,
            },
            {
              agentId: 'A2',
              name: 'Buyers Agent',
              role: 'buyers_agent',
              splitPercent: 40,
            },
          ],
        },
      ],
    };
    const results = service.runSimulation(input);
    // Agent share: 80% of 30,000 = 24,000
    // Lead (60%): 14,400 | Buyers agent (40%): 9,600
    expect(results[0].teamMemberResults).toBeDefined();
    expect(results[0].teamMemberResults!.length).toBe(2);
    expect(results[0].teamMemberResults![0].grossShare).toBeCloseTo(14400);
    expect(results[0].teamMemberResults![1].grossShare).toBeCloseTo(9600);
  });

  // ── CC-07: What-if scenario comparison ──────────────────────────────────
  it('CC-07: compareScenarios should return results for each scenario', () => {
    const service = new SimulationService();
    const baseSale = {
      date: '2024-01-01',
      salesValue: 500000,
      cumulativeSales: 0,
      dealType: 'Listing' as const,
      commissionPercent: 6,
    };
    const scenarios = [
      {
        label: '80/20 Split',
        input: {
          pre_split_deductions: [],
          post_split_deductions: [],
          commission_structure_types: [
            {
              type: 'split' as const,
              split_ratio: [80, 20] as [number, number],
            },
          ],
          brokerage_misc_expenses: [],
          performance_bonuses: [],
          sales_data: [baseSale],
        },
      },
      {
        label: '75/25 Split',
        input: {
          pre_split_deductions: [],
          post_split_deductions: [],
          commission_structure_types: [
            {
              type: 'split' as const,
              split_ratio: [75, 25] as [number, number],
            },
          ],
          brokerage_misc_expenses: [],
          performance_bonuses: [],
          sales_data: [baseSale],
        },
      },
    ];
    const comparison = service.compareScenarios(scenarios);
    expect(comparison.length).toBe(2);
    expect(comparison[0].label).toBe('80/20 Split');
    expect(comparison[0].totalNetAgent).toBeCloseTo(24000);
    expect(comparison[1].totalNetAgent).toBeCloseTo(22500);
    // 80/20 is better for agent
    expect(comparison[0].totalNetAgent).toBeGreaterThan(
      comparison[1].totalNetAgent,
    );
  });

  // ── CC-08: Rental commission ─────────────────────────────────────────────
  it('CC-08: should calculate rental commission as 1 month rent for annual lease', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [100, 0] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 0, // not used for rental
          cumulativeSales: 0,
          dealType: 'Rental',
          commissionPercent: 0, // not used for rental
          monthlyRent: 3000,
          rentalTerm: 'annual',
        },
      ],
    };
    const results = service.runSimulation(input);
    // Annual lease: commission = 1 × monthly rent = 3,000; agent 100% = 3,000
    expect(results[0].totalAgentCommission).toBeCloseTo(3000);
  });

  it('CC-08: should calculate rental commission as 0.5 month rent for month-to-month lease', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [100, 0] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 0,
          cumulativeSales: 0,
          dealType: 'Rental',
          commissionPercent: 0,
          monthlyRent: 3000,
          rentalTerm: 'month_to_month',
        },
      ],
    };
    const results = service.runSimulation(input);
    // MTM: commission = 0.5 × 3,000 = 1,500
    expect(results[0].totalAgentCommission).toBeCloseTo(1500);
  });

  // ── CT-02: Agent summary ─────────────────────────────────────────────────
  it('CT-02: getAgentSummary should return correct YTD metrics', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [],
      post_split_deductions: [],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 500000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
        {
          date: '2024-02-01',
          salesValue: 300000,
          cumulativeSales: 0,
          dealType: 'Buy Side',
          commissionPercent: 3,
          buyerAgreementSigned: true,
        },
      ],
    };
    const results = service.runSimulation(input);
    const summary = service.getAgentSummary(results, 16000);

    expect(summary.dealCount).toBe(2);
    expect(summary.totalSalesVolume).toBe(800000);
    // 6% of 500k = 30k, agent 80% = 24k; 3% of 300k = 9k, agent 80% = 7,200
    expect(summary.ytdGrossCommission).toBeCloseTo(31200);
    expect(typeof summary.capProgress).toBe('string');
  });

  // ── COM-03: Audit trail ──────────────────────────────────────────────────
  it('COM-03: should include a non-empty audit trail in each result', () => {
    const service = new SimulationService();
    const input: SimulationInputDto = {
      pre_split_deductions: [
        { name: 'Referral Fee', type: 'percentage', value: 0.02 },
      ],
      post_split_deductions: [
        { name: 'E&O Insurance', type: 'percentage', value: 0.01 },
      ],
      commission_structure_types: [{ type: 'split', split_ratio: [80, 20] }],
      brokerage_misc_expenses: [],
      performance_bonuses: [],
      sales_data: [
        {
          date: '2024-01-01',
          salesValue: 400000,
          cumulativeSales: 0,
          dealType: 'Listing',
          commissionPercent: 6,
        },
      ],
    };
    const results = service.runSimulation(input);
    expect(results[0].auditTrail).toBeDefined();
    expect(results[0].auditTrail.length).toBeGreaterThan(3);
    expect(results[0].calculatedAt).toBeDefined();
    // Verify audit steps are labelled
    const stepNames = results[0].auditTrail.map((s) => s.step);
    expect(stepNames).toContain('1-cumulative-sales');
    expect(stepNames).toContain('2-gross-commission');
    expect(stepNames).toContain('5-split');
  });

  // ── Full tier test with CSV output ───────────────────────────────────────
  it('should handle multiple sales in different tiers and write CSV', () => {
    const service = new SimulationService();
    const results = service.runSimulation(tierInput);

    const csv = generateTestCSV(results);
    writeFileSync('tier_split_results.csv', csv);

    // Sale 1: cumulative = 500,000 → tier 1 (80%). 6% of 500k = 30,000; agent = 24,000
    expect(results[0].totalAgentCommission).toBeCloseTo(24000);
    // Sale 2: cumulative = 700,000 → tier 2 (75%). 6% of 200k = 12,000; agent = 9,000
    // BUG FIX: original test said 90,000 (off by 10x). Correct = 9,000.
    expect(results[1].totalAgentCommission).toBeCloseTo(9000);
  });
});

// ── Test CSV helper (local to spec file) ─────────────────────────────────────
function generateTestCSV(results: SimulationResultDto[]): string {
  const header =
    'Date,Sale Price,Cumulative Sales,Deal Type,Tier,Commission %,Agent Split %,Brokerage Split %,Net Agent Commission,Net Brokerage Commission,Compliance Status';
  const rows = results.map(
    (r) =>
      `${r.date},${r.salePrice},${r.cumulativeSales},${r.dealType},${r.tier},${r.commissionPercent},${r.agentSplitPercent},${r.brokerageSplitPercent},${r.netAgentCommission},${r.netBrokerageCommission},${r.complianceStatus}`,
  );
  return [header, ...rows].join('\n');
}
