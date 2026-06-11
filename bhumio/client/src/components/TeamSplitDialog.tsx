import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Box, TextField, MenuItem, IconButton, Table, 
  TableBody, TableCell, TableHead, TableRow, Slider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Group as GroupIcon } from '@mui/icons-material';
import type { TeamMember } from './TransactionTable';

interface TeamSplitDialogProps {
  open: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  onSave: (members: TeamMember[]) => void;
}

const TeamSplitDialog: React.FC<TeamSplitDialogProps> = ({
  open,
  onClose,
  teamMembers,
  onSave
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<TeamMember>({
    agentId: 'agent-1',
    name: 'Jane Doe',
    splitPercent: 50,
    role: 'buyers_agent'
  });

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setMembers(teamMembers || []);
      });
    }
  }, [open, teamMembers]);

  const handleAdd = () => {
    const updated = [...members, { ...newMember, agentId: `agent-${Date.now()}` }];
    setMembers(updated);
    setNewMember({
      agentId: '',
      name: '',
      splitPercent: 0,
      role: 'buyers_agent'
    });
  };

  const handleRemove = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSliderChange = (index: number, val: number) => {
    const updated = members.map((m, i) => {
      if (i === index) {
        return { ...m, splitPercent: val };
      }
      return m;
    });
    setMembers(updated);
  };

  const handleNameChange = (index: number, name: string) => {
    const updated = members.map((m, i) => {
      if (i === index) {
        return { ...m, name };
      }
      return m;
    });
    setMembers(updated);
  };

  const handleRoleChange = (index: number, role: TeamMember['role']) => {
    const updated = members.map((m, i) => {
      if (i === index) {
        return { ...m, role };
      }
      return m;
    });
    setMembers(updated);
  };

  const totalSplit = members.reduce((sum, m) => sum + m.splitPercent, 0);
  const isValid = totalSplit === 100 || members.length === 0;

  const handleSave = () => {
    onSave(members);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
        <GroupIcon sx={{ color: '#00BFA5' }} />
        Configure Team Commission splits
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
          Post- NAR rules and broker standards permit splitting commission shares among registered team members. The split percentages across the team **must sum to exactly 100%**.
        </Typography>

        {/* Form to Add Member */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', alignItems: 'center' }}>
          <TextField
            size="small"
            label="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            sx={{ flexGrow: 1, bgcolor: '#ffffff' }}
          />

          <TextField
            select
            size="small"
            label="Role"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMember['role'] })}
            sx={{ width: 160, bgcolor: '#ffffff' }}
          >
            <MenuItem value="lead">Lead Agent</MenuItem>
            <MenuItem value="buyers_agent">Buyer's Agent</MenuItem>
            <MenuItem value="showing_agent">Showing Agent</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Initial Split %"
            type="number"
            value={newMember.splitPercent || ''}
            onChange={(e) => setNewMember({ ...newMember, splitPercent: parseFloat(e.target.value) || 0 })}
            sx={{ width: 120, bgcolor: '#ffffff' }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!newMember.name}
            onClick={handleAdd}
            sx={{
              bgcolor: '#00BFA5',
              backgroundImage: 'linear-gradient(135deg, #10B981 0%, #00BFA5 100%)',
              color: '#ffffff',
              borderRadius: '20px',
            }}
          >
            Add Member
          </Button>
        </Box>

        {/* Members List Table with Sliders */}
        {members.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: '#64748B', fontStyle: 'italic' }}>
            No team members added. Add members above to allocate splits.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Split Allocation (%)</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }} align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ py: 1.5 }}>
                    <TextField
                      size="small"
                      value={m.name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <TextField
                      select
                      size="small"
                      value={m.role}
                      onChange={(e) => handleRoleChange(i, e.target.value as TeamMember['role'])}
                      sx={{ width: 140, '& .MuiInputBase-input': { py: 0.5 } }}
                    >
                      <MenuItem value="lead">Lead Agent</MenuItem>
                      <MenuItem value="buyers_agent">Buyer's Agent</MenuItem>
                      <MenuItem value="showing_agent">Showing Agent</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, width: '40%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Slider
                        value={m.splitPercent}
                        onChange={(_, val) => handleSliderChange(i, val as number)}
                        min={0}
                        max={100}
                        step={5}
                        sx={{ color: '#00BFA5', flexGrow: 1 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 40 }}>
                        {m.splitPercent}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }} align="center">
                    <IconButton onClick={() => handleRemove(i)} sx={{ color: '#EF4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Sum Indicator */}
        {members.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, p: 1.5, borderRadius: '8px', bgcolor: isValid ? '#EEFBF7' : '#FEE2E2' }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: isValid ? '#10B981' : '#EF4444' }}>
              Total Split Allocation: {totalSplit}% {isValid ? '✓ (Valid)' : '✗ (Must equal exactly 100%)'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text" sx={{ color: '#64748B' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!isValid}
          sx={{
            bgcolor: '#00BFA5',
            backgroundImage: 'linear-gradient(135deg, #00BFA5 0%, #00B0FF 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            px: 3
          }}
        >
          Apply Splits
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamSplitDialog;
