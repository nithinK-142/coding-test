import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Grid from './LegacyGrid';

export interface Deduction {
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
}

export interface Expense {
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
}

interface DeductionSelectorProps {
  preDeductions: Deduction[];
  postDeductions: Deduction[];
  miscExpenses: Expense[];
  onPreChange: (deds: Deduction[]) => void;
  onPostChange: (deds: Deduction[]) => void;
  onExpensesChange: (exps: Expense[]) => void;
}

const DeductionSelector: React.FC<DeductionSelectorProps> = ({
  preDeductions,
  postDeductions,
  miscExpenses,
  onPreChange,
  onPostChange,
  onExpensesChange
}) => {
  
  // Hardcoded standard deductions from backend test-data.json
  const defaultPre: Deduction[] = [
    { name: "Referral Fee", type: "percentage", value: 0.02 },
    { name: "Lead Fee", type: "fixed", value: 500 },
    { name: "Franchise Fee", type: "fixed", value: 200 },
    { name: "Royalty Fee", type: "fixed", value: 100 },
    { name: "Home Warranty Fee", type: "fixed", value: 300 },
    { name: "Client Rebates & Discounts", type: "fixed", value: 150 },
    { name: "Commission Advance Recovery", type: "fixed", value: 250 },
    { name: "Property Management Fees", type: "fixed", value: 100 }
  ];

  const defaultPost: Deduction[] = [
    { name: "Transaction Coordinator Fees", type: "fixed", value: 300 },
    { name: "Sales Manager Fee", type: "percentage", value: 0.01 },
    { name: "Brokerage Admin Fees", type: "fixed", value: 200 },
    { name: "E&O Insurance", type: "percentage", value: 0.005 },
    { name: "Marketing & Technology Fees", type: "fixed", value: 150 },
    { name: "Compliance & Risk Management Fees", type: "fixed", value: 100 }
  ];

  const defaultExpenses: Expense[] = [
    { name: "Brokerage Yearly Fee", type: "fixed", value: 1000 },
    { name: "Transaction Fee", type: "fixed", value: 100 }
  ];

  const handlePreToggle = (ded: Deduction, checked: boolean) => {
    if (checked) {
      onPreChange([...preDeductions, ded]);
    } else {
      onPreChange(preDeductions.filter((d) => d.name !== ded.name));
    }
  };

  const handlePostToggle = (ded: Deduction, checked: boolean) => {
    if (checked) {
      onPostChange([...postDeductions, ded]);
    } else {
      onPostChange(postDeductions.filter((d) => d.name !== ded.name));
    }
  };

  const handleExpenseToggle = (exp: Expense, checked: boolean) => {
    if (checked) {
      onExpensesChange([...miscExpenses, exp]);
    } else {
      onExpensesChange(miscExpenses.filter((e) => e.name !== exp.name));
    }
  };

  const isPreActive = (name: string) => preDeductions.some((d) => d.name === name);
  const isPostActive = (name: string) => postDeductions.some((d) => d.name === name);
  const isExpenseActive = (name: string) => miscExpenses.some((e) => e.name === name);

  const formatVal = (item: Deduction | Expense) => {
    if (item.type === 'percentage') {
      return `${(item.value * 100).toFixed(1)}%`;
    }
    return `$${item.value}`;
  };

  return (
    <Grid container spacing={3}>
      {/* Pre-split Deductions Column */}
      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E8ECEB', height: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1E293B', mb: 1.5, fontFamily: '"Outfit", sans-serif' }}>
            Pre-Split Deductions
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
            Applied to gross commission before split calculation
          </Typography>
          <FormGroup>
            {defaultPre.map((d, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox 
                    checked={isPreActive(d.name)} 
                    onChange={(e) => handlePreToggle(d, e.target.checked)}
                    sx={{ color: '#00BFA5', '&.Mui-checked': { color: '#00BFA5' } }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.85rem' }}>{d.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#00BFA5', fontSize: '0.85rem' }}>{formatVal(d)}</Typography>
                  </Box>
                }
                sx={{ mb: 0.5, mr: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            ))}
          </FormGroup>
        </Box>
      </Grid>

      {/* Post-split Deductions Column */}
      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E8ECEB', height: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1E293B', mb: 1.5, fontFamily: '"Outfit", sans-serif' }}>
            Post-Split Deductions
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
            Subtracted from agent's share after split is resolved
          </Typography>
          <FormGroup>
            {defaultPost.map((d, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox 
                    checked={isPostActive(d.name)} 
                    onChange={(e) => handlePostToggle(d, e.target.checked)}
                    sx={{ color: '#00BFA5', '&.Mui-checked': { color: '#00BFA5' } }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.85rem' }}>{d.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#00BFA5', fontSize: '0.85rem' }}>{formatVal(d)}</Typography>
                  </Box>
                }
                sx={{ mb: 0.5, mr: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            ))}
          </FormGroup>
        </Box>
      </Grid>

      {/* Miscellaneous Expenses Column */}
      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E8ECEB', height: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1E293B', mb: 1.5, fontFamily: '"Outfit", sans-serif' }}>
            Brokerage Misc Expenses
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
            Operational fees paid by brokerage from their split share
          </Typography>
          <FormGroup>
            {defaultExpenses.map((exp, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox 
                    checked={isExpenseActive(exp.name)} 
                    onChange={(e) => handleExpenseToggle(exp, e.target.checked)}
                    sx={{ color: '#00BFA5', '&.Mui-checked': { color: '#00BFA5' } }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.85rem' }}>{exp.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#00BFA5', fontSize: '0.85rem' }}>{formatVal(exp)}</Typography>
                  </Box>
                }
                sx={{ mb: 0.5, mr: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
              />
            ))}
          </FormGroup>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DeductionSelector;
