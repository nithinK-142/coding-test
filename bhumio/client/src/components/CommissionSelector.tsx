import React from 'react';
import { 
  Box, Typography, TextField, MenuItem, Slider, Button, 
  Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, TableContainer
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Grid from './LegacyGrid';

export interface CommissionTier {
  minSalesVolume: number;
  maxSalesVolume: number | null;
  agentSplitPercent: number;
  brokerageSplitPercent: number;
}

export interface CommissionStructure {
  type: 'split' | 'flat_fee' | 'percentage_based' | 'tiered' | 'cap_based';
  split_ratio?: [number, number];
  value?: number;
  tiers?: CommissionTier[];
  annualCap?: number;
  postCapSplit?: [number, number];
  agentAnniversaryDate?: string;
}

interface CommissionSelectorProps {
  structure: CommissionStructure;
  onChange: (structure: CommissionStructure) => void;
}

const CommissionSelector: React.FC<CommissionSelectorProps> = ({
  structure,
  onChange
}) => {
  const handleTypeChange = (type: CommissionStructure['type']) => {
    const updated: CommissionStructure = { type };
    if (type === 'split' || type === 'cap_based') {
      updated.split_ratio = [80, 20];
    }
    if (type === 'flat_fee') {
      updated.value = 2000;
    }
    if (type === 'percentage_based') {
      updated.value = 6;
    }
    if (type === 'cap_based') {
      updated.annualCap = 16000;
      updated.postCapSplit = [100, 0];
      updated.agentAnniversaryDate = new Date().toISOString().split('T')[0];
    }
    if (type === 'tiered') {
      updated.tiers = [
        { minSalesVolume: 0, maxSalesVolume: 500000, agentSplitPercent: 70, brokerageSplitPercent: 30 },
        { minSalesVolume: 500000.01, maxSalesVolume: null, agentSplitPercent: 90, brokerageSplitPercent: 10 }
      ];
    }
    onChange(updated);
  };

  const handleRatioSliderChange = (val: number) => {
    onChange({
      ...structure,
      split_ratio: [val, 100 - val]
    });
  };

  const handlePostRatioSliderChange = (val: number) => {
    onChange({
      ...structure,
      postCapSplit: [val, 100 - val]
    });
  };

  const handleTierChange = (index: number, key: keyof CommissionTier, val: number | null) => {
    if (!structure.tiers) return;
    const updatedTiers = structure.tiers.map((t, i) => {
      if (i === index) {
        const updatedTier = { ...t, [key]: val };
        if (key === 'agentSplitPercent' && typeof val === 'number') {
          updatedTier.brokerageSplitPercent = 100 - val;
        }
        return updatedTier;
      }
      return t;
    });
    onChange({ ...structure, tiers: updatedTiers });
  };

  const handleAddTier = () => {
    const currentTiers = structure.tiers || [];
    const lastTier = currentTiers[currentTiers.length - 1];
    const minVol = lastTier ? (lastTier.maxSalesVolume || 1000000) + 0.01 : 0;
    const newTier: CommissionTier = {
      minSalesVolume: minVol,
      maxSalesVolume: null,
      agentSplitPercent: 80,
      brokerageSplitPercent: 20
    };
    onChange({
      ...structure,
      tiers: [...currentTiers, newTier]
    });
  };

  const handleRemoveTier = (index: number) => {
    if (!structure.tiers) return;
    const updated = structure.tiers.filter((_, i) => i !== index);
    onChange({ ...structure, tiers: updated });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2, fontFamily: '"Outfit", sans-serif' }}>
        Commission Structure Model
      </Typography>

      <TextField
        select
        fullWidth
        size="small"
        label="Structure Type"
        value={structure.type}
        onChange={(e) => handleTypeChange(e.target.value as CommissionStructure['type'])}
        sx={{ mb: 3 }}
      >
        <MenuItem value="split">Fixed Split Ratio (Traditional)</MenuItem>
        <MenuItem value="cap_based">Cap-Based Split (eXp / Keller Williams)</MenuItem>
        <MenuItem value="tiered">Graduated / Volume-Tiered Split</MenuItem>
        <MenuItem value="flat_fee">Flat Transaction Fee Basis</MenuItem>
        <MenuItem value="percentage_based">Pure Gross Percentage Fee Basis</MenuItem>
      </TextField>

      {/* 1. FIXED SPLIT CONTROLS */}
      {structure.type === 'split' && structure.split_ratio && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E8ECEB' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', mb: 2 }}>
            Adjust Split Ratio: {structure.split_ratio[0]}% Agent / {structure.split_ratio[1]}% Brokerage
          </Typography>
          <Slider
            value={structure.split_ratio[0]}
            onChange={(_, val) => handleRatioSliderChange(val as number)}
            min={40}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            sx={{ color: '#00BFA5' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>40% Agent</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>100% Agent</Typography>
          </Box>
        </Box>
      )}

      {/* 2. FLAT FEE CONTROLS */}
      {structure.type === 'flat_fee' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Flat Fee per Transaction ($)"
              value={structure.value || 0}
              onChange={(e) => onChange({ ...structure, value: parseFloat(e.target.value) || 0 })}
            />
          </Grid>
        </Grid>
      )}

      {/* 3. PERCENTAGE BASED CONTROLS */}
      {structure.type === 'percentage_based' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Overall Brokerage Percentage Fee (%)"
              value={structure.value || 0}
              onChange={(e) => onChange({ ...structure, value: parseFloat(e.target.value) || 0 })}
            />
          </Grid>
        </Grid>
      )}

      {/* 4. CAP-BASED CONTROLS */}
      {structure.type === 'cap_based' && structure.split_ratio && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E8ECEB', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', mb: 1 }}>
              Base Split Ratio: {structure.split_ratio[0]}% Agent / {structure.split_ratio[1]}% Brokerage
            </Typography>
            <Slider
              value={structure.split_ratio[0]}
              onChange={(_, val) => handleRatioSliderChange(val as number)}
              min={40}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              sx={{ color: '#00BFA5' }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Annual Cap Limit ($)"
                value={structure.annualCap || 0}
                onChange={(e) => onChange({ ...structure, annualCap: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Anniversary Reset Date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={structure.agentAnniversaryDate || ''}
                onChange={(e) => onChange({ ...structure, agentAnniversaryDate: e.target.value })}
              />
            </Grid>
          </Grid>

          {structure.postCapSplit && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', mb: 1 }}>
                Post-Cap Split Ratio: {structure.postCapSplit[0]}% Agent / {structure.postCapSplit[1]}% Brokerage
              </Typography>
              <Slider
                value={structure.postCapSplit[0]}
                onChange={(_, val) => handlePostRatioSliderChange(val as number)}
                min={80}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                sx={{ color: '#10B981' }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* 5. GRADUATED TIERS CONTROLS */}
      {structure.type === 'tiered' && structure.tiers && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B' }}>
              Volume Tiers
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddTier}
              sx={{
                borderRadius: '16px',
                borderColor: 'rgba(0,191,165,0.4)',
                color: '#00BFA5',
                fontSize: '0.75rem',
                '&:hover': { borderColor: '#00BFA5' }
              }}
            >
              Add Tier
            </Button>
          </Box>

          {/* BR-07 FIX: note displayed to user about fallback behaviour */}
          <Box sx={{ mb: 1.5, px: 1.5, py: 1, bgcolor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px' }}>
            <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 600 }}>
              BR-07: If no tier matches the current cumulative volume, the commission defaults to the agent flat split — not 0%/0%.
            </Typography>
          </Box>

          {/* FIXED: added missing Paper import and used it correctly */}
          <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#F1F5F9' }}>Min Vol ($)</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#F1F5F9' }}>Max Vol ($)</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#F1F5F9' }}>Agent %</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#F1F5F9' }} align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {structure.tiers.map((tier, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={tier.minSalesVolume}
                        onChange={(e) => handleTierChange(i, 'minSalesVolume', parseFloat(e.target.value) || 0)}
                        sx={{ width: 100, '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        placeholder="No Limit"
                        type="number"
                        size="small"
                        value={tier.maxSalesVolume === null ? '' : tier.maxSalesVolume}
                        onChange={(e) => handleTierChange(i, 'maxSalesVolume', e.target.value === '' ? null : parseFloat(e.target.value))}
                        sx={{ width: 100, '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={tier.agentSplitPercent}
                        onChange={(e) => handleTierChange(i, 'agentSplitPercent', parseInt(e.target.value) || 0)}
                        sx={{ width: 65, '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }} align="center">
                      <IconButton 
                        onClick={() => handleRemoveTier(i)} 
                        disabled={structure.tiers!.length <= 1}
                        sx={{ color: '#EF4444' }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default CommissionSelector;
