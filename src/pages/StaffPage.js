import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  Avatar, Chip, FormControl, InputLabel, Select, MenuItem, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel
} from '@mui/material';
import { PersonAdd, Close, Edit } from '@mui/icons-material';
import api from '../services/api';

const ROLES = [
  { value: 'admin',   label: '👑 Admin' },
  { value: 'manager', label: '📋 Manager' },
  { value: 'kitchen', label: '👨‍🍳 Kitchen' },
  { value: 'waiter',  label: '🍽️ Waiter' },
  { value: 'cashier', label: '💰 Cashier' },
  { value: 'driver',  label: '🚗 Driver' },
];

const ROLE_COLORS = { admin: '#fff0f5', manager: '#ede9fe', kitchen: '#fef3c7', waiter: '#dbeafe', cashier: '#d1fae5', driver: '#cffafe' };
const ROLE_TEXT   = { admin: '#FF2D6B', manager: '#6d28d9', kitchen: '#b45309', waiter: '#1d4ed8', cashier: '#065f46', driver: '#0e7490' };
const ROLE_EMOJIS = { admin: '👑', manager: '📋', kitchen: '👨‍🍳', waiter: '🍽️', cashier: '💰', driver: '🚗' };

const EMPTY_ADD_FORM = { name: '', email: '', password: '', role: 'waiter' };

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);

  // Edit dialog state
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try { const res = await api.get('/staff'); setStaff(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff', addForm);
      setShowAddForm(false);
      setAddForm(EMPTY_ADD_FORM);
      fetchStaff();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      is_active: member.is_active,
      password: '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/staff/${editingMember.id}`, editForm);
      setEditingMember(null);
      fetchStaff();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">👥 Staff</Typography>
        <Button variant="contained" startIcon={showAddForm ? <Close /> : <PersonAdd />} onClick={() => setShowAddForm(!showAddForm)} color={showAddForm ? 'secondary' : 'primary'}>
          {showAddForm ? 'Close' : 'Add Staff'}
        </Button>
      </Box>

      {/* ── ADD STAFF FORM ── */}
      <Collapse in={showAddForm}>
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>➕ New Staff Member</Typography>
            <form onSubmit={handleAdd}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Password" type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select value={addForm.role} label="Role" onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
                      {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large">Add Staff ✅</Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Collapse>

      {/* ── STAFF CARDS ── */}
      <Grid container spacing={2}>
        {staff.map(member => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
            <Card sx={{ textAlign: 'center', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, bgcolor: ROLE_COLORS[member.role], color: ROLE_TEXT[member.role], fontSize: '1.5rem', border: `2px solid ${ROLE_TEXT[member.role]}30` }}>
                  {ROLE_EMOJIS[member.role] || '👤'}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{member.email}</Typography>
                <Chip label={member.role} size="small" sx={{ bgcolor: ROLE_COLORS[member.role], color: ROLE_TEXT[member.role], fontWeight: 700, mb: 1 }} />
                {!member.is_active && (
                  <Chip label="Inactive" size="small" sx={{ ml: 0.5, mb: 1, bgcolor: '#e5e7eb', color: '#6b7280', fontWeight: 700 }} />
                )}
                <Box sx={{ mt: 1.5 }}>
                  <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => openEdit(member)}>
                    Edit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── EDIT DIALOG ── */}
      <Dialog open={!!editingMember} onClose={() => setEditingMember(null)} maxWidth="sm" fullWidth>
        <form onSubmit={handleUpdate}>
          <DialogTitle>✏️ Edit {editingMember?.name}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={editForm.role || ''} label="Role" onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                    {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={editForm.password || ''}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                  helperText="Only fill this if you want to change the password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      color="success"
                    />
                  }
                  label={editForm.is_active ? 'Active — can log in' : 'Inactive — cannot log in'}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditingMember(null)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes ✅</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default StaffPage;
