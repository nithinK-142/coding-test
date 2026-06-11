import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Snackbar, Alert, Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { 
  NavigateNext as NavigateNextIcon,
  ContentCopy as CopyIcon,
  Map as MapIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

interface BreadcrumbsProps {
  address?: string;
  onExportCsv?: () => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  address = '120 Conklin Ave, Binghamton, NY 13903',
  onExportCsv
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ py: 3, px: 4, bgcolor: '#ffffff', borderBottom: '1px solid #E8ECEB' }}>
      {/* Small navigation links */}
      <MuiBreadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94A3B8' }} />} 
        aria-label="breadcrumb"
        sx={{ mb: 1, fontSize: '0.85rem', color: '#64748B' }}
      >
        <Typography variant="body2" sx={{ color: '#64748B' }}>Network</Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>Property</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{address.split(',')[0]}</Typography>
      </MuiBreadcrumbs>

      {/* Main Bar with Address and Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        {/* Left Side: Large Address with Copy */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
            {address}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleCopy} 
            sx={{ 
              color: '#64748B', 
              bgcolor: 'rgba(100, 116, 139, 0.05)',
              '&:hover': { bgcolor: 'rgba(100, 116, 139, 0.1)' }
            }}
          >
            <CopyIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Right Side: Action Buttons matching the snapshot look and feel */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Show on Map Button (Outlined light teal bg, teal border and text) */}
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            sx={{
              color: '#00BFA5',
              borderColor: 'rgba(0, 191, 165, 0.3)',
              borderRadius: '24px',
              bgcolor: '#eefbf7',
              px: 2.5,
              py: 0.8,
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': {
                borderColor: '#00BFA5',
                bgcolor: 'rgba(0, 191, 165, 0.08)'
              }
            }}
          >
            Show on Map
          </Button>

          {/* Export Report Button (Teal filled background, white text) */}
          <Button
            variant="contained"
            onClick={onExportCsv}
            startIcon={<PdfIcon />}
            sx={{
              bgcolor: '#00BFA5',
              backgroundImage: 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              px: 3,
              py: 1,
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': {
                backgroundImage: 'linear-gradient(135deg, #059669 0%, #00A892 100%)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }
            }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Copy Alert Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '12px' }}>
          Address copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Breadcrumbs;
