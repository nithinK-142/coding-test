import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  iconBgColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon,
  bgColor = '#ffffff',
  borderColor = '#E8ECEB',
  iconBgColor = '#F1F5F9'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(value).replace(/[^0-9.-]/g, '')); // Copy raw numeric text
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card 
      sx={{ 
        bgcolor: bgColor, 
        borderColor: borderColor,
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <CardContent sx={{ width: '100%', py: '20px !important', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Label and Value */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {/* Soft Icon Wrapper */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 32, 
                  height: 32, 
                  borderRadius: '8px', 
                  bgcolor: iconBgColor,
                  color: '#1E293B'
                }}
              >
                {icon}
              </Box>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
                {label}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#0F172A', 
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '1.6rem'
                }}
              >
                {value}
              </Typography>
              
              <Tooltip title={copied ? "Copied!" : "Copy value"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopy} 
                  sx={{ 
                    color: copied ? '#10B981' : '#94A3B8',
                    padding: '2px',
                    ml: 0.5,
                    '&:hover': { color: '#1E293B', bgcolor: 'rgba(0,0,0,0.03)' }
                  }}
                >
                  {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
