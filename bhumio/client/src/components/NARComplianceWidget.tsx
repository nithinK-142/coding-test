import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Gavel as GavelIcon, 
  CheckCircle as ValidIcon, 
  Warning as WarningIcon, 
  Error as ViolationIcon 
} from '@mui/icons-material';

interface Violation {
  code: string;
  message: string;
  severity: 'warning' | 'violation';
}

interface NARComplianceWidgetProps {
  status: 'Compliant' | 'Warning' | 'Violation';
  violations: Violation[];
}

const NARComplianceWidget: React.FC<NARComplianceWidgetProps> = ({
  status,
  violations
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'Compliant':
        return {
          color: '#10B981',
          bgColor: '#EEFBF7',
          icon: <ValidIcon sx={{ color: '#10B981' }} />,
          label: 'NAR Compliant',
          desc: 'All post-NAR settlement conditions are fully satisfied.'
        };
      case 'Warning':
        return {
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          icon: <WarningIcon sx={{ color: '#F59E0B' }} />,
          label: 'Compliance Alert',
          desc: 'Minor items require review.'
        };
      case 'Violation':
      default:
        return {
          color: '#EF4444',
          bgColor: '#FEE2E2',
          icon: <ViolationIcon sx={{ color: '#EF4444' }} />,
          label: 'NAR Violations',
          desc: 'Transaction contains non-compliant settlement entries.'
        };
    }
  };

  const details = getStatusDetails();

  return (
    <Card 
      sx={{ 
        bgcolor: '#ffffff', 
        borderColor: '#E8ECEB',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: '20px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              bgcolor: '#F1F5F9',
              color: '#64748B'
            }}
          >
            <GavelIcon fontSize="small" />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
            NAR 2024 Audit Check
          </Typography>
        </Box>

        {/* Status Highlight Banner */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: details.bgColor,
            mb: 1.5
          }}
        >
          {details.icon}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: details.color, fontFamily: '"Outfit", sans-serif' }}>
              {details.label}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.1 }}>
              {details.desc}
            </Typography>
          </Box>
        </Box>

        {/* Violations list */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 80 }}>
          {violations.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic', textAlign: 'center', mt: 1 }}>
              No compliance issues detected.
            </Typography>
          ) : (
            <List dense disablePadding>
              {violations.map((v, i) => (
                <ListItem key={i} sx={{ px: 0.5, py: 0.3, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 20, mt: 0.3 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: v.severity === 'violation' ? '#EF4444' : '#F59E0B' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#1E293B', lineHeight: 1.2, display: 'block' }}>
                        {v.message}
                      </Typography>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NARComplianceWidget;
