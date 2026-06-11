import React, { useState, useCallback, useEffect } from 'react';
import {
  ThemeProvider, CssBaseline, Box, Tabs, Tab,
  Button, Typography, Card, CardContent, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as VolumeIcon,
  Percent as PercentIcon,
  Compare as ScenarioIcon,
  PlayArrow as SimulateIcon,
  CheckCircleOutlined as ApprovedIcon
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer
} from 'recharts';

// Theme and Components
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import Grid from './components/LegacyGrid';
import SummaryCard from './components/SummaryCard';
import RadialCapProgress from './components/RadialCapProgress';
import NARComplianceWidget from './components/NARComplianceWidget';
import TransactionTable from './components/TransactionTable';
import type { SaleTransaction, TeamMember } from './components/TransactionTable';
import CommissionSelector from './components/CommissionSelector';
import type { CommissionStructure } from './components/CommissionSelector';
import DeductionSelector from './components/DeductionSelector';
import type { Deduction, Expense } from './components/DeductionSelector';
import TeamSplitDialog from './components/TeamSplitDialog';
import OptimizationPanel from './components/OptimizationPanel';
import type { OptimizedParameters } from './components/OptimizationPanel';

// ── TYPES ──────────────────────────────────────────────────────────────────
interface SimulationResult {
  date: string;
  salePrice: number;
  dealType: string;
  commissionPercent: number;
  agentSplitPercent: number;
  brokerageSplitPercent: number;
  totalPreSplitDeductions: number;
  totalPostSplitDeductions: number;
  netAgentCommission: number;
  netBrokerageCommission: number;
  complianceStatus: 'Compliant' | 'Warning' | 'Violation';
  complianceViolations?: ComplianceViolation[];
  payoutStatus?: 'Pending' | 'Approved' | 'Disbursed' | 'Disputed';
  auditTrail?: { step: string; description: string; inputValue: number; outputValue: number }[];
}

interface ComplianceViolation {
  code: string;
  message: string;
  severity: 'warning' | 'violation';
}

interface AgentSummary {
  ytdGrossCommission: number;
  ytdNetAgentCommission: number;
  ytdBrokerageFees: number;
  dealCount: number;
  totalSalesVolume: number;
  capProgress: string;
  capReached: boolean;
}

interface OptimizationConstraints {
  minCommissionPercent: number;
  maxCommissionPercent: number;
  minAgentSplitPercent: number;
  maxAgentSplitPercent: number;
  annualCap: number;
}

type ParetoPoint = OptimizedParameters & {
  agentWeight: number;
  brokerageWeight: number;
};

interface ScenarioComparison {
  label: string;
  totalNetAgent: number;
  totalNetBrokerage: number;
  transactionCount: number;
  results: SimulationResult[];
}

// FIXED: Use VITE_API_URL env variable with localhost:3000 as fallback
// In dev: set VITE_API_URL in .env.local
// In prod: set VITE_API_URL to your deployed NestJS URL
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected error';

const DEFAULT_AGENT_SUMMARY: AgentSummary = {
  ytdGrossCommission: 0,
  ytdNetAgentCommission: 0,
  ytdBrokerageFees: 0,
  dealCount: 0,
  totalSalesVolume: 0,
  capProgress: '0%',
  capReached: false
};

const App: React.FC = () => {
  // ── STATE DEFINITIONS ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);

  // Input States (Preloaded with rich mock data matching backend)
  const [transactions, setTransactions] = useState<SaleTransaction[]>([
    {
      date: '2024-01-01',
      salesValue: 150000,
      dealType: 'Buy Side',
      commissionPercent: 6,
      buyerAgreementSigned: true,
      buyerAgreementDate: '2024-01-01',
      compensationChannel: 'direct',
      sellerConcession: 0
    },
    {
      date: '2024-02-15',
      salesValue: 350000,
      dealType: 'Listing',
      commissionPercent: 6
    },
    {
      date: '2024-03-10',
      salesValue: 200000,
      dealType: 'Duel',
      commissionPercent: 5.5,
      buyerAgreementSigned: false, // NAR Warning trigger
      compensationChannel: 'MLS'  // NAR Violation trigger
    }
  ]);

  const [structure, setStructure] = useState<CommissionStructure>({
    type: 'cap_based',
    split_ratio: [80, 20],
    annualCap: 16000,
    postCapSplit: [100, 0],
    agentAnniversaryDate: '2024-01-01'
  });

  const [preDeductions, setPreDeductions] = useState<Deduction[]>([
    { name: 'Referral Fee', type: 'percentage', value: 0.02 },
    { name: 'Lead Fee', type: 'fixed', value: 500 }
  ]);

  const [postDeductions, setPostDeductions] = useState<Deduction[]>([
    { name: 'Transaction Coordinator Fees', type: 'fixed', value: 300 },
    { name: 'E&O Insurance', type: 'percentage', value: 0.005 }
  ]);

  const [miscExpenses, setMiscExpenses] = useState<Expense[]>([
    { name: 'Brokerage Yearly Fee', type: 'fixed', value: 1000 }
  ]);

  // Output/Results States
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [agentSummary, setAgentSummary] = useState<AgentSummary>(DEFAULT_AGENT_SUMMARY);

  // Solver & Scenario Comparison States
  const [loading, setLoading] = useState(false);
  const [optimizedData, setOptimizedData] = useState<OptimizedParameters | null>(null);
  const [paretoData, setParetoData] = useState<ParetoPoint[] | null>(null);
  const [scenarioCompareData, setScenarioCompareData] = useState<ScenarioComparison[]>([]);

  // Modals / Dialogs
  const [teamSplitIndex, setTeamSplitIndex] = useState<number | null>(null);

  // ── BACKEND API CONNECTIONS ────────────────────────────────────────────────
  // FIXED: useCallback so runSimulation can safely be in useEffect deps array
  const runSimulation = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const payload = {
        pre_split_deductions: preDeductions,
        post_split_deductions: postDeductions,
        commission_structure_types: [structure],
        brokerage_misc_expenses: miscExpenses,
        performance_bonuses: [],
        sales_data: transactions
      };

      // 1. Run full simulation
      const simRes = await fetch(`${API_BASE}/simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const results = await simRes.json();
      if (!simRes.ok) throw new Error(results.message || 'Simulation failed');
      setSimulationResults(results);

      // 2. Fetch Agent dashboard YTD summary
      const summaryRes = await fetch(`${API_BASE}/simulation/agent-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: payload,
          annualCap: structure.annualCap
        })
      });
      const summary = await summaryRes.json();
      if (!summaryRes.ok) throw new Error(summary.message || 'Agent summary failed');
      setAgentSummary(summary);
    } catch (err: unknown) {
      console.error('[Simulation Error]', err);
      // FIXED: show inline error banner instead of alert() — doesn't block UI
      setApiError(`Simulation error: ${getErrorMessage(err)}. Ensure NestJS backend is running on ${API_BASE}.`);
    } finally {
      setLoading(false);
    }
  }, [preDeductions, postDeductions, structure, miscExpenses, transactions]);

  const runOptimization = async (useGA: boolean, customConstraints: OptimizationConstraints) => {
    setLoading(true);
    setParetoData(null);
    setApiError(null);
    try {
      const payload = {
        pre_split_deductions: preDeductions,
        post_split_deductions: postDeductions,
        commission_structure_types: [structure],
        brokerage_misc_expenses: miscExpenses,
        performance_bonuses: [],
        sales_data: transactions,
        optimizationConstraints: customConstraints,
        competitors: [
          { name: 'eXp Realty (Traditional)', agentSplitPercent: 80, brokerageSplitPercent: 20, annualCap: 16000 },
          // { name: 'RE/MAX (Premium Split)', agentSplitPercent: 95, brokerageSplitPercent: 5, annualCap: 24000 },
          // { name: 'Keller Williams (Standard)', agentSplitPercent: 70, brokerageSplitPercent: 30, annualCap: 3000 },
          { name: 'Agent First Realty', agentSplitPercent: 90, brokerageSplitPercent: 10, annualCap: 3000 },
          { name: 'Balanced Realty', agentSplitPercent: 95, brokerageSplitPercent: 5, annualCap: 16000 },
        ]
      };

      const res = await fetch(`${API_BASE}/optimization/run?useGA=${useGA}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Optimization failed');
      setOptimizedData(data);
    } catch (err: unknown) {
      console.error('[Optimization Error]', err);
      setApiError(`Optimization solver error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const runParetoFront = async (stepsVal: number) => {
    setLoading(true);
    setOptimizedData(null);
    setApiError(null);
    try {
      const payload = {
        pre_split_deductions: preDeductions,
        post_split_deductions: postDeductions,
        commission_structure_types: [structure],
        brokerage_misc_expenses: miscExpenses,
        performance_bonuses: [],
        sales_data: transactions
      };

      const res = await fetch(`${API_BASE}/optimization/pareto?steps=${stepsVal}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Pareto front failed');
      setParetoData(data);
    } catch (err: unknown) {
      console.error('[Pareto Error]', err);
      setApiError(`Pareto front error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const runCompareScenarios = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const basePayload = {
        pre_split_deductions: preDeductions,
        post_split_deductions: postDeductions,
        brokerage_misc_expenses: miscExpenses,
        performance_bonuses: [],
        sales_data: transactions
      };

      const payload = [
        {
          label: 'Traditional 70/30 Split',
          input: {
            ...basePayload,
            commission_structure_types: [{ type: 'split', split_ratio: [70, 30] }]
          }
        },
        {
          label: 'Anniversary Cap Model ($16k Cap)',
          input: {
            ...basePayload,
            commission_structure_types: [{ type: 'cap_based', split_ratio: [80, 20], annualCap: 16000, postCapSplit: [100, 0] }]
          }
        },
        {
          label: 'Tiered Split Model (Graduated)',
          input: {
            ...basePayload,
            commission_structure_types: [{
              type: 'tiered',
              tiers: [
                { minSalesVolume: 0, maxSalesVolume: 400000, agentSplitPercent: 70, brokerageSplitPercent: 30 },
                // BR-07 FIX: maxSalesVolume: null means unlimited — backend must treat null as no upper bound
                { minSalesVolume: 400000.01, maxSalesVolume: null, agentSplitPercent: 90, brokerageSplitPercent: 10 }
              ]
            }]
          }
        }
      ];

      const res = await fetch(`${API_BASE}/simulation/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Compare scenarios failed');
      setScenarioCompareData(data);
    } catch (err: unknown) {
      console.error('[Compare Error]', err);
      setApiError(`Compare scenarios error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: runSimulation is now stable via useCallback, safe to include in deps
  useEffect(() => {
    queueMicrotask(() => {
      void runSimulation();
    });
  }, [runSimulation]);

  // ── EVENT HANDLERS ────────────────────────────────────────────────────────
  const handleSaveTeamSplit = (members: TeamMember[]) => {
    if (teamSplitIndex === null) return;
    const updated = transactions.map((t, idx) =>
      idx === teamSplitIndex ? { ...t, teamMembers: members } : t
    );
    setTransactions(updated);
  };

  const handleExportCsv = () => {
    if (simulationResults.length === 0) return;
    const headers = [
      'Date', 'Sale Price', 'Type', 'Comm %', 'Agent Split %', 'Broker Split %',
      'Pre-Split Deductions', 'Post-Split Deductions', 'Net Agent Payout', 'Net Broker Payout',
      'Compliance Status'
    ];
    const rows = simulationResults.map((r) => [
      r.date, r.salePrice, r.dealType, r.commissionPercent,
      r.agentSplitPercent, r.brokerageSplitPercent,
      r.totalPreSplitDeductions, r.totalPostSplitDeductions,
      r.netAgentCommission, r.netBrokerageCommission,
      r.complianceStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `RE_Commission_AuditReport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FIXED: safe guards on simulationResults before deriving compliance aggregates
  const hasViolations = simulationResults.some((r) => r.complianceStatus === 'Violation');
  const hasWarnings = simulationResults.some((r) => r.complianceStatus === 'Warning');
  const overallComplianceStatus = hasViolations ? 'Violation' : hasWarnings ? 'Warning' : 'Compliant';

  const allViolations = simulationResults.reduce<ComplianceViolation[]>((acc, r) => {
    if (r.complianceViolations && r.complianceViolations.length > 0) {
      return [...acc, ...r.complianceViolations];
    }
    return acc;
  }, []);

  // FIXED: safe numeric formatting — fallback to 0 if field is undefined/NaN
  const fmtUSD = (val: number | undefined) =>
    `$${(val ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>

        {/* TOP NAVBAR */}
        {/* <Navbar /> */}

        {/* PROPERTY BREADCRUMB HEADER */}
        {/* <Breadcrumbs onExportCsv={handleExportCsv} />  */}

        {/* FIXED: Inline API error banner — replaces alert() popup */}
        {apiError && (
          <Box sx={{ px: 4, pt: 2 }}>
            <Alert
              severity="error"
              onClose={() => setApiError(null)}
              sx={{ borderRadius: '12px' }}
            >
              {apiError}
            </Alert>
          </Box>
        )}

        {/* CORE BODY CONTAINER */}
        <Box sx={{ flexGrow: 1, py: 4, px: 4 }}>
          <Grid container spacing={3}>

            {/* ROW 1: Summary widgets */}
            {/*<Grid item xs={12} sm={6} md={2.5}>
              <SummaryCard
                label="Gross Commission (YTD)"
                value={fmtUSD(agentSummary.ytdGrossCommission)}
                icon={<MoneyIcon sx={{ color: '#00BFA5' }} />}
                iconBgColor="#EEFBF7"
                borderColor="rgba(0,191,165,0.15)"
              />
            </Grid> */}

            {/*<Grid item xs={12} sm={6} md={2.5}>
              <SummaryCard
                label="Net Agent Take-Home"
                value={fmtUSD(agentSummary.ytdNetAgentCommission)}
                icon={<VolumeIcon sx={{ color: '#00B0FF' }} />}
                iconBgColor="#E3F2FD"
                borderColor="rgba(0,176,255,0.15)"
              />
            </Grid> */}

            {/*<Grid item xs={12} sm={6} md={2}>
              <SummaryCard
                label="Brokerage Split Fees"
                value={fmtUSD(agentSummary.ytdBrokerageFees)}
                icon={<PercentIcon sx={{ color: '#7B1FA2' }} />}
                iconBgColor="#F3E5F5"
                borderColor="rgba(123,31,162,0.1)"
              />
            </Grid> */}

            {/* Circular Progress cap tracker */}
            {/*<Grid item xs={12} sm={6} md={2.5}>
              <RadialCapProgress 
                currentFees={agentSummary.ytdBrokerageFees ?? 0} 
                annualCap={structure.annualCap}
              />
            </Grid> */}

            {/* NAR compliance audit widget */}
            {/* <Grid item xs={12} sm={12} md={2.5}>
              <NARComplianceWidget 
                status={overallComplianceStatus} 
                violations={allViolations}
              />
            </Grid> */}

            {/* ROW 2: Main tab panel */}
            <Grid item xs={12}>
              <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                {/* <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ borderBottom: '1px solid #E8ECEB', bgcolor: '#ffffff', px: 2 }}
                >
                  <Tab label="Simulation & Split Builder" />
                  <Tab label="AI Optimization Hub" />
                  <Tab label="What-If Comparison Dashboard" />
                  <Tab label="Audit Trail & Disbursement" />
                </Tabs> */}

                <Box sx={{ p: 4, bgcolor: '#ffffff' }}>

                  {/* TAB 1: SIMULATOR & DEDUCTIONS */}
                  {activeTab === 0 && (
                    <Grid container spacing={4}>
                      <Grid item xs={12} lg={8}>
                        <TransactionTable
                          transactions={transactions}
                          onChange={(txs) => setTransactions(txs)}
                          onOpenTeamSplit={(idx) => setTeamSplitIndex(idx)}
                        />
                      </Grid>

                      <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ p: 3, border: '1px solid #E8ECEB', borderRadius: '16px', bgcolor: '#F8FAFC' }}>
                          <CommissionSelector
                            structure={structure}
                            onChange={(s) => setStructure(s)}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <DeductionSelector
                          preDeductions={preDeductions}
                          postDeductions={postDeductions}
                          miscExpenses={miscExpenses}
                          onPreChange={(d) => setPreDeductions(d)}
                          onPostChange={(d) => setPostDeductions(d)}
                          onExpensesChange={(e) => setMiscExpenses(e)}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={runSimulation}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <SimulateIcon />}
                          sx={{
                            bgcolor: '#00BFA5',
                            backgroundImage: 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
                            color: '#ffffff',
                            fontWeight: 850,
                            borderRadius: '30px',
                            px: 5,
                            py: 1.5,
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                              backgroundImage: 'linear-gradient(135deg, #059669 0%, #00A892 100%)',
                              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                            }
                          }}
                        >
                          Run Simulation Analysis
                        </Button>
                      </Grid>
                    </Grid>
                  )}

                  {/* TAB 2: AI OPTIMIZATION SOLVER */}
                  {activeTab === 1 && (
                    <Box>
                      {/* <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                        Analyze agent split optimization models. The Linear Programming (LP) solver maximizes standard splits using bounding parameters, while the Genetic Algorithm (GA) performs non-linear evolutionary iterations that incorporate annual cap rules.
                      </Typography> */}

                      <OptimizationPanel
                        onSolve={runOptimization}
                        onSolvePareto={runParetoFront}
                        loading={loading}
                        optimizedData={optimizedData}
                        paretoData={paretoData}
                      />
                    </Box>
                  )}

                  {/* TAB 3: WHAT-IF COMPARISONS */}
                  {activeTab === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontFamily: '"Outfit", sans-serif' }}>
                            Compare Commission Scenarios
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            Evaluate payouts under multiple configurations using the active transaction logs.
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          onClick={runCompareScenarios}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ScenarioIcon />}
                          sx={{
                            bgcolor: '#00B0FF',
                            backgroundImage: 'linear-gradient(135deg, #00B0FF 0%, #00BFA5 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            borderRadius: '24px',
                            px: 3,
                          }}
                        >
                          Calculate Comparison
                        </Button>
                      </Box>

                      {scenarioCompareData.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, color: '#64748B', border: '1px dashed #CBD5E1', borderRadius: '16px' }}>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            Click "Calculate Comparison" above to evaluate models side-by-side.
                          </Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={3}>
                          <Grid item xs={12} lg={7}>
                            <Paper sx={{ p: 3, border: '1px solid #E8ECEB', borderRadius: '12px' }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                                Agent Net Take-Home vs. Brokerage Profit
                              </Typography>
                              <Box sx={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsBarChart data={scenarioCompareData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Legend />
                                    <Bar dataKey="totalNetAgent" name="Agent Share" fill="#00BFA5" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="totalNetBrokerage" name="Broker Profit" fill="#7B1FA2" radius={[4, 4, 0, 0]} />
                                  </RechartsBarChart>
                                </ResponsiveContainer>
                              </Box>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} lg={5}>
                            <TableContainer component={Paper} sx={{ border: '1px solid #E8ECEB', borderRadius: '12px' }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Scenario Model</TableCell>
                                    <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Agent ($)</TableCell>
                                    <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Broker ($)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {scenarioCompareData.map((scen, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell sx={{ fontWeight: 700 }}>{scen.label}</TableCell>
                                      {/* FIXED: null-safe toLocaleString calls */}
                                      <TableCell sx={{ color: '#00BFA5', fontWeight: 800 }}>
                                        ${(scen.totalNetAgent ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      </TableCell>
                                      <TableCell sx={{ color: '#7B1FA2', fontWeight: 800 }}>
                                        ${(scen.totalNetBrokerage ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  )}

                  {/* TAB 4: AUDIT TRAIL & DISBURSEMENT */}
                  {activeTab === 3 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                      {/* Disbursement Payout Board */}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                          Simulated Disbursement Status Board
                        </Typography>

                        <Grid container spacing={2}>
                          {(['Pending', 'Approved', 'Disbursed', 'Disputed'] as const).map((status) => {
                            const matchingDeals = simulationResults.filter(
                              (r) => r.payoutStatus === status || (status === 'Pending' && !r.payoutStatus)
                            );
                            return (
                              <Grid item xs={12} sm={6} md={3} key={status}>
                                <Card sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', minHeight: 120 }}>
                                  <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B' }}>{status}</Typography>
                                      <Typography variant="caption" sx={{ px: 1, py: 0.2, bgcolor: '#ffffff', borderRadius: '10px', fontWeight: 800, border: '1px solid #E2E8F0' }}>
                                        {matchingDeals.length} deals
                                      </Typography>
                                    </Box>

                                    {matchingDeals.length === 0 ? (
                                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                                        No active deals
                                      </Typography>
                                    ) : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {matchingDeals.map((deal, idx) => (
                                          <Paper key={idx} sx={{ p: 1.2, border: '1px solid #E8ECEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{deal.dealType}</Typography>
                                              {/* FIXED: null-safe salePrice */}
                                              <Typography variant="caption" sx={{ color: '#64748B' }}>${(deal.salePrice ?? 0).toLocaleString()}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#00BFA5', fontWeight: 800 }}>
                                              ${(deal.netAgentCommission ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </Typography>
                                          </Paper>
                                        ))}
                                      </Box>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Audit Step Trail Logs */}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                          Step-by-Step Ledger Audit Logs
                        </Typography>

                        {simulationResults.length === 0 ? (
                          <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                            Run simulation to view mathematical ledgers.
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                            {simulationResults.map((res, dealIdx) => (
                              <Paper key={dealIdx} sx={{ p: 3, border: '1px solid #E8ECEB', borderRadius: '16px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                                    Deal #{dealIdx + 1}: {res.dealType} (${(res.salePrice ?? 0).toLocaleString()}) — Completed Audit
                                  </Typography>
                                  <ApprovedIcon sx={{ color: '#10B981' }} />
                                </Box>

                                {/* FIXED: guard against missing auditTrail */}
                                {!res.auditTrail || res.auditTrail.length === 0 ? (
                                  <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                    No audit trail returned for this deal.
                                  </Typography>
                                ) : (
                                  <TableContainer>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Step Node</TableCell>
                                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Description</TableCell>
                                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', bgcolor: '#F8FAFC' }}>Input ($ / Ratio)</TableCell>
                                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', bgcolor: '#F8FAFC' }} align="right">Accumulated Out ($)</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {res.auditTrail.map((step, sIdx) => (
                                          <TableRow key={sIdx}>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B' }}>
                                              {step.step}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem' }}>{step.description}</TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                              {/* FIXED: null-safe toLocaleString on audit values */}
                                              {(step.inputValue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 850, color: '#00BFA5' }} align="right">
                                              ${(step.outputValue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        )}
                      </Box>

                    </Box>
                  )}

                </Box>
              </Paper>
            </Grid>

          </Grid>
        </Box>

        {/* TEAM MEMBER SPLITS DIALOG */}
        <TeamSplitDialog
          open={teamSplitIndex !== null}
          onClose={() => setTeamSplitIndex(null)}
          teamMembers={
            teamSplitIndex !== null && transactions[teamSplitIndex]
              ? (transactions[teamSplitIndex].teamMembers || [])
              : []
          }
          onSave={handleSaveTeamSplit}
        />

      </Box>
    </ThemeProvider>
  );
};

export default App;
