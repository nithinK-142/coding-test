import React from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Badge } from '@mui/material';
import { 
  Home as HomeIcon,
  Hub as NetworkIcon,
  BarChart as ReportsIcon,
  Handshake as CoMarketIcon,
  ReceiptLong as TransactionsIcon,
  People as ContactsIcon,
  Campaign as LeadsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as ProfileIcon,
  Search as SearchIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const Navbar: React.FC = () => {
  const navItems = [
    { label: 'Home', icon: <HomeIcon fontSize="small" /> },
    { label: 'Network', icon: <NetworkIcon fontSize="small" />, active: true },
    { label: 'Reports', icon: <ReportsIcon fontSize="small" /> },
    { label: 'Co-Market', icon: <CoMarketIcon fontSize="small" /> },
    { label: 'Transactions', icon: <TransactionsIcon fontSize="small" /> },
    { label: 'Contacts', icon: <ContactsIcon fontSize="small" /> },
    { label: 'Leads', icon: <LeadsIcon fontSize="small" />, badge: 'NEW' }
  ];

  return (
    <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #E8ECEB', bgcolor: '#ffffff' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Navigation Items (Mimicking the look of the snapshot) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navItems.map((item, index) => (
            <Button
              key={index}
              startIcon={item.icon}
              sx={{
                color: item.active ? '#00BFA5' : '#64748B',
                fontWeight: item.active ? 700 : 500,
                fontSize: '0.9rem',
                py: 1,
                px: 1.5,
                borderRadius: '8px',
                bgcolor: item.active ? 'rgba(0, 191, 165, 0.05)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(0, 191, 165, 0.08)',
                },
                position: 'relative',
              }}
            >
              {item.label}
              {item.badge && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    bgcolor: '#10B981',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    px: 0.8,
                    py: 0.1,
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </Button>
          ))}
        </Box>

        {/* Right utility icons (Mimicking the snapshot) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small" sx={{ color: '#64748B' }}>
            <SearchIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: '#64748B' }}>
            <ChatIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: '#64748B' }}>
            <SettingsIcon />
          </IconButton>
          <Badge badgeContent={47} color="error" max={99}>
            <IconButton size="small" sx={{ color: '#64748B' }}>
              <NotificationsIcon />
            </IconButton>
          </Badge>
          <IconButton size="small" sx={{ color: '#64748B' }}>
            <ProfileIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
