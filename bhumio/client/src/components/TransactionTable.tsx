import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, IconButton, TextField, MenuItem, Box, Typography,
  Checkbox, FormControlLabel, Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';

export interface TeamMember {
  agentId: string;
  name: string;
  splitPercent: number;
  role: 'lead' | 'buyers_agent' | 'showing_agent';
}

export interface SaleTransaction {
  date: string;
  salesValue: number;
  dealType: 'Buy Side' | 'Listing' | 'Duel' | 'Rental';
  commissionPercent: number;
  buyerAgencyFee?: number;
  buyerAgencyFeeType?: 'fixed' | 'percentage';
  buyerAgreementSigned?: boolean;
  buyerAgreementDate?: string;
  sellerConcession?: number;
  compensationChannel?: 'direct' | 'concession' | 'MLS';
  teamMembers?: TeamMember[];
  rentalTerm?: 'annual' | 'month_to_month';
  monthlyRent?: number;
}

type SaleTransactionValue = SaleTransaction[keyof SaleTransaction];

interface TransactionTableProps {
  transactions: SaleTransaction[];
  onChange: (txs: SaleTransaction[]) => void;
  onOpenTeamSplit: (index: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onChange,
  onOpenTeamSplit
}) => {
  const [newTx, setNewTx] = useState<SaleTransaction>({
    date: new Date().toISOString().split('T')[0],
    salesValue: 250000,
    dealType: 'Buy Side',
    commissionPercent: 6,
    buyerAgreementSigned: true,
    buyerAgreementDate: new Date().toISOString().split('T')[0],
    buyerAgencyFee: 3,
    buyerAgencyFeeType: 'percentage',
    compensationChannel: 'direct',
    sellerConcession: 0
  });

  const handleAdd = () => {
    // If it's rental, copy rent values
    const prepared = { ...newTx };
    if (prepared.dealType === 'Rental') {
      prepared.monthlyRent = prepared.salesValue / 100; // Mock monthly rent
      prepared.rentalTerm = 'annual';
    }
    const updated = [...transactions, prepared];
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = transactions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (index: number, key: keyof SaleTransaction, val: SaleTransactionValue) => {
    const updated = transactions.map((t, i) => {
      if (i === index) {
        return { ...t, [key]: val };
      }
      return t;
    });
    onChange(updated);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontFamily: '"Outfit", sans-serif' }}>
          Sales Transactions
        </Typography>
      </Box>

      {/* Adding Form Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5, 
          p: 2, 
          mb: 3, 
          borderRadius: '12px', 
          bgcolor: '#EEFBF7', 
          border: '1px solid rgba(0, 191, 165, 0.2)',
          alignItems: 'center'
        }}
      >
        <TextField
          type="date"
          size="small"
          label="Close Date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={newTx.date}
          onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
          sx={{ width: 140, bgcolor: '#ffffff' }}
        />

        <TextField
          size="small"
          label={newTx.dealType === 'Rental' ? 'Monthly Rent ($)' : 'Sale Price ($)'}
          type="number"
          value={newTx.salesValue}
          onChange={(e) => setNewTx({ ...newTx, salesValue: parseFloat(e.target.value) || 0 })}
          sx={{ width: 130, bgcolor: '#ffffff' }}
        />

        <TextField
          select
          size="small"
          label="Deal Type"
          value={newTx.dealType}
          onChange={(e) => setNewTx({ ...newTx, dealType: e.target.value as SaleTransaction['dealType'] })}
          sx={{ width: 120, bgcolor: '#ffffff' }}
        >
          <MenuItem value="Buy Side">Buy Side</MenuItem>
          <MenuItem value="Listing">Listing</MenuItem>
          <MenuItem value="Duel">Dual Agency</MenuItem>
          <MenuItem value="Rental">Rental</MenuItem>
        </TextField>

        <TextField
          size="small"
          label="Commission (%)"
          type="number"
          value={newTx.commissionPercent}
          onChange={(e) => setNewTx({ ...newTx, commissionPercent: parseFloat(e.target.value) || 0 })}
          sx={{ width: 130, bgcolor: '#ffffff' }}
        />

        {/* Post-NAR fields simplified inside adding layout */}
        {newTx.dealType === 'Buy Side' && (
          <>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={!!newTx.buyerAgreementSigned} 
                  onChange={(e) => setNewTx({ ...newTx, buyerAgreementSigned: e.target.checked })} 
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Buyer Agmt Signed</Typography>}
              sx={{ ml: 0.5 }}
            />
            <TextField
              select
              size="small"
              label="Comp Channel"
              value={newTx.compensationChannel}
              onChange={(e) => setNewTx({ ...newTx, compensationChannel: e.target.value as SaleTransaction['compensationChannel'] })}
              sx={{ width: 130, bgcolor: '#ffffff' }}
            >
              <MenuItem value="direct">Direct Negotiation</MenuItem>
              <MenuItem value="concession">Seller Concession</MenuItem>
              <MenuItem value="MLS">MLS (Banned)</MenuItem>
            </TextField>
          </>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            ml: 'auto',
            bgcolor: '#00BFA5',
            backgroundImage: 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '20px',
            '&:hover': {
              backgroundImage: 'linear-gradient(135deg, #059669 0%, #00A892 100%)'
            }
          }}
        >
          Add Deal
        </Button>
      </Box>

      {/* Table List Section */}
      <TableContainer component={Paper} sx={{ borderRadius: '16px', maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Price/Rent ($)</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Comm. %</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }}>Post-NAR Compliance Details</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }} align="center">Team splits</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#F8FAFC' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#64748B', fontStyle: 'italic' }}>
                  No transactions added. Use the form above to add a deal!
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx, index) => (
                <TableRow key={index} hover>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 1, py: 0.2, 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        bgcolor: tx.dealType === 'Buy Side' ? '#E3F2FD' : tx.dealType === 'Listing' ? '#EEFBF7' : '#F3E5F5',
                        color: tx.dealType === 'Buy Side' ? '#1976D2' : tx.dealType === 'Listing' ? '#10B981' : '#7B1FA2'
                      }}
                    >
                      {tx.dealType}
                    </Box>
                  </TableCell>
                  <TableCell>${tx.salesValue.toLocaleString()}</TableCell>
                  <TableCell>{tx.commissionPercent}%</TableCell>
                  
                  {/* Real-time Inline Compliance toggles */}
                  <TableCell sx={{ maxWidth: 220 }}>
                    {(tx.dealType === 'Buy Side' || tx.dealType === 'Duel') ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              size="small"
                              checked={!!tx.buyerAgreementSigned} 
                              onChange={(e) => handleFieldChange(index, 'buyerAgreementSigned', e.target.checked)} 
                            />
                          }
                          label={<Typography sx={{ fontSize: '0.75rem' }}>Buyer Agmt Signed</Typography>}
                        />
                        <TextField
                          select
                          size="small"
                          label="Comp Channel"
                          value={tx.compensationChannel || 'direct'}
                          onChange={(e) => handleFieldChange(index, 'compensationChannel', e.target.value)}
                          sx={{ 
                            width: 140, 
                            '& .MuiInputBase-input': { py: 0.3, fontSize: '0.7rem' },
                            '& .MuiInputLabel-root': { fontSize: '0.7rem', transform: 'translate(14px, 4px) scale(1)' } 
                          }}
                        >
                          <MenuItem value="direct" sx={{ fontSize: '0.75rem' }}>Direct Negotiation</MenuItem>
                          <MenuItem value="concession" sx={{ fontSize: '0.75rem' }}>Concession</MenuItem>
                          <MenuItem value="MLS" sx={{ fontSize: '0.75rem' }}>MLS (Banned)</MenuItem>
                        </TextField>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: '#64748B' }}>NAR rules apply to Buy-Side only</Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Configure split among team members">
                      <IconButton 
                        onClick={() => onOpenTeamSplit(index)}
                        sx={{ 
                          color: tx.teamMembers && tx.teamMembers.length > 0 ? '#10B981' : '#64748B',
                          bgcolor: tx.teamMembers && tx.teamMembers.length > 0 ? '#EEFBF7' : 'rgba(0,0,0,0.03)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
                        }}
                      >
                        <GroupIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {tx.teamMembers && tx.teamMembers.length > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#10B981', mt: 0.2 }}>
                        {tx.teamMembers.length} active
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton onClick={() => handleRemove(index)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionTable;
