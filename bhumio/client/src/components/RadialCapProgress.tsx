import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { MilitaryTech as CapIcon } from '@mui/icons-material';

interface RadialCapProgressProps {
  currentFees: number;
  annualCap?: number;
}

const RadialCapProgress: React.FC<RadialCapProgressProps> = ({
  currentFees,
  annualCap = 16000
}) => {
  const percentage = Math.min(100, (currentFees / annualCap) * 100);
  const isCapped = currentFees >= annualCap;

  return (
    <Card 
      sx={{ 
        bgcolor: '#ffffff', 
        borderColor: '#E8ECEB',
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: '20px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              bgcolor: isCapped ? '#EEFBF7' : '#F1F5F9',
              color: isCapped ? '#10B981' : '#64748B'
            }}
          >
            <CapIcon fontSize="small" />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
            Anniversary Cap Progress
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, my: 1 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {/* Background Circular Track */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={110}
              thickness={6}
              sx={{ color: '#E2E8F0' }}
            />
            {/* Active Circular Progress */}
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={110}
              thickness={6}
              sx={{
                color: isCapped ? '#10B981' : '#00BFA5',
                position: 'absolute',
                left: 0,
                backgroundImage: isCapped 
                  ? 'none' 
                  : 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            {/* Center Label */}
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 800, 
                  color: isCapped ? '#10B981' : '#0F172A',
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '1.25rem'
                }}
              >
                {percentage.toFixed(0)}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 700 }}>
                {isCapped ? 'CAPPED' : 'REMAINING'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
            ${currentFees.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Paid
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            of ${annualCap.toLocaleString()} annual cap
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RadialCapProgress;
