import React, { useState } from 'react';
import { 
  Box, Typography, Slider, Switch, FormControlLabel, 
  Button, Card, CardContent, CircularProgress, Alert, TextField
} from '@mui/material';
import { 
  PlayArrow as SolveIcon,
  CompareArrows as BenchmarkIcon,
  Leaderboard as ParetoIcon,
  CheckCircle as WinIcon,
  Cancel as LoseIcon,
  Balance as TieIcon
} from '@mui/icons-material';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip as ChartTooltip, ResponsiveContainer 
} from 'recharts';
import Grid from './LegacyGrid';

export interface CompetitorComparison {
  competitorName: string;
  competitorAgentSplit: number;
  ourAgentSplit: number;
  splitDelta: number;
  competitorAnnualCap?: number;
  ourAnnualCap?: number;
  capDelta?: number;
  verdict: 'We Win' | 'Competitor Wins' | 'Tie';
}

export interface OptimizedParameters {
  commissionPercent: number;
  agentSplitPercent: number;
  brokerageSplitPercent: number;
  recommendedAnnualCap?: number;
  competitorComparisons?: CompetitorComparison[];
  solverUsed: 'lp' | 'ga';
  fitnessScore?: number;
}

export interface OptimizationConstraints {
  minCommissionPercent: number;
  maxCommissionPercent: number;
  minAgentSplitPercent: number;
  maxAgentSplitPercent: number;
  annualCap: number;
}

export type ParetoPoint = OptimizedParameters & {
  agentWeight: number;
  brokerageWeight: number;
};

interface OptimizationPanelProps {
  onSolve: (useGA: boolean, constraints: OptimizationConstraints) => Promise<void>;
  onSolvePareto: (steps: number) => Promise<void>;
  loading: boolean;
  optimizedData: OptimizedParameters | null;
  paretoData: ParetoPoint[] | null;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  onSolve,
  onSolvePareto,
  loading,
  optimizedData,
  paretoData
}) => {
  const [useGA, setUseGA] = useState(false);
  const [steps, setSteps] = useState(10);
  const [constraints, setConstraints] = useState({
    minCommissionPercent: 1.5,
    maxCommissionPercent: 6,
    minAgentSplitPercent: 60,
    maxAgentSplitPercent: 95,
    annualCap: 16000
  });

  const handleRun = () => {
    const prepared = {
      ...constraints,
      minCommissionPercent: constraints.minCommissionPercent / 100,
      maxCommissionPercent: constraints.maxCommissionPercent / 100,
    };
    onSolve(useGA, prepared);
  };

  const handleRunPareto = () => {
    onSolvePareto(steps);
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'We Win':
        return { color: '#10B981', bgcolor: '#EEFBF7', icon: <WinIcon fontSize="small" /> };
      case 'Competitor Wins':
        return { color: '#EF4444', bgcolor: '#FEE2E2', icon: <LoseIcon fontSize="small" /> };
      case 'Tie':
      default:
        return { color: '#3B82F6', bgcolor: '#EFF6FF', icon: <TieIcon fontSize="small" /> };
    }
  };

  return (
    <Grid container spacing={3}>
      {/* 1. Constraint Settings Panel — FIXED: was using MUI v6 Grid size={{}} API, now uses MUI v9 item xs= */}
      <Grid item xs={12} md={5}>
        <Box sx={{ p: 3, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E8ECEB', height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontFamily: '"Outfit", sans-serif' }}>
            Solver Constraints
          </Typography>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', mb: 1 }}>
              Commission Fee Limits: {constraints.minCommissionPercent}% - {constraints.maxCommissionPercent}%
            </Typography>
            <Slider
              value={[constraints.minCommissionPercent, constraints.maxCommissionPercent]}
              onChange={(_, val) => {
                const arr = val as number[];
                setConstraints({ ...constraints, minCommissionPercent: arr[0], maxCommissionPercent: arr[1] });
              }}
              min={1}
              max={8}
              step={0.5}
              valueLabelDisplay="auto"
              sx={{ color: '#00BFA5' }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', mb: 1 }}>
              Agent Split Range: {constraints.minAgentSplitPercent}% - {constraints.maxAgentSplitPercent}%
            </Typography>
            <Slider
              value={[constraints.minAgentSplitPercent, constraints.maxAgentSplitPercent]}
              onChange={(_, val) => {
                const arr = val as number[];
                setConstraints({ ...constraints, minAgentSplitPercent: arr[0], maxAgentSplitPercent: arr[1] });
              }}
              min={40}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              sx={{ color: '#00BFA5' }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Annual Cap Override ($)"
                value={constraints.annualCap}
                onChange={(e) => setConstraints({ ...constraints, annualCap: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            {/* <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Pareto Steps"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value) || 5)}
              />
            </Grid> */}
          </Grid>

          {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={useGA} 
                  onChange={(e) => setUseGA(e.target.checked)} 
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#00BFA5' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00BFA5' } 
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Use Genetic Algorithm (GA) Solver
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Slower, allows multi-criteria cap-aware logic
                  </Typography>
                </Box>
              }
            />
          </Box> */}

          <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={loading ? <CircularProgress size={18} sx={{ color: '#ffffff' }} /> : <SolveIcon />}
              onClick={handleRun}
              disabled={loading}
              sx={{
                bgcolor: '#00BFA5',
                backgroundImage: 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '24px',
                py: 1,
                '&:hover': {
                  backgroundImage: 'linear-gradient(135deg, #059669 0%, #00A892 100%)'
                }
              }}
            >
              Run Optimizer
            </Button>

            {/* <Button
              variant="outlined"
              startIcon={<ParetoIcon />}
              onClick={handleRunPareto}
              disabled={loading}
              sx={{
                borderRadius: '24px',
                borderColor: '#00B0FF',
                color: '#00B0FF',
                '&:hover': { borderColor: '#0084c2', bgcolor: 'rgba(0,176,255,0.05)' }
              }}
            >
              Pareto Curve
            </Button> */}
          </Box>
        </Box>
      </Grid>

      {/* 2. Results / Comparisons Panel */}
      <Grid item xs={12} md={7}>
        <Box sx={{ p: 3, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E8ECEB', height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {!optimizedData && !paretoData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, py: 6, color: '#64748B', gap: 1.5 }}>
              <BenchmarkIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>No active optimization run.</Typography>
              <Typography variant="caption">Adjust constraints and click "Run Optimizer" to evaluate.</Typography>
            </Box>
          )}

          {/* Optimized Output Card */}
          {optimizedData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Alert severity="success" sx={{ borderRadius: '12px', border: '1px solid #10B981', bgcolor: '#EEFBF7', color: '#064E3B' }}>
                Solver completed successfully using <strong>{optimizedData.solverUsed.toUpperCase()}</strong>.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Optimized Split</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#00BFA5', fontFamily: '"Outfit", sans-serif', mt: 0.5 }}>
                        {optimizedData.agentSplitPercent}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Agent Share</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Commission Rate</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#00B0FF', fontFamily: '"Outfit", sans-serif', mt: 0.5 }}>
                        {(optimizedData.commissionPercent * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Gross Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Broker Cap</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', fontFamily: '"Outfit", sans-serif', mt: 0.5 }}>
                        ${optimizedData.recommendedAnnualCap ? optimizedData.recommendedAnnualCap.toLocaleString() : 'N/A'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Annual Limit</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Benchmarking Section */}
              {optimizedData.competitorComparisons && optimizedData.competitorComparisons.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mb: 1.5, fontFamily: '"Outfit", sans-serif' }}>
                    Benchmarking Verdicts
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {optimizedData.competitorComparisons.map((comp, idx) => {
                      const style = getVerdictStyle(comp.verdict);
                      return (
                        <Box 
                          key={idx}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            p: 1.5, 
                            bgcolor: '#F8FAFC',
                            borderRadius: '12px', 
                            border: '1px solid #E8ECEB' 
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>{comp.competitorName}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Split: {comp.competitorAgentSplit}% | Cap: ${comp.competitorAnnualCap ? comp.competitorAnnualCap.toLocaleString() : 'None'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: '8px', bgcolor: style.bgcolor, color: style.color }}>
                            {style.icon}
                            <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                              {comp.verdict}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Pareto front plot */}
          {paretoData && !optimizedData && (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mb: 2, fontFamily: '"Outfit", sans-serif' }}>
                Multi-Objective Pareto Front Curve
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                Scatter plot mapping Agent Weight vs Solver Fitness. Higher agent weight favors agent earnings; lower weight maximizes brokerage profit.
              </Typography>

              <Box sx={{ width: '100%', height: 200, flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="agentWeight" name="Agent Weight" label={{ value: 'Agent Weight', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="fitnessScore" name="Fitness" />
                    <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Pareto Front" data={paretoData} fill="#00BFA5" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}

        </Box>
      </Grid>
    </Grid>
  );
};

export default OptimizationPanel;
