import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  Avatar, Chip, FormControl, InputLabel, Select, MenuItem, Collapse
} from '@mui/material';
import { PersonAdd, Close } from '@mui/icons-material';
import api from '../services/api';

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'waiter' });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try { const res = await api.get('/staff'); setStaff(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff', form);
      setShowForm(false); setForm({ name: '', email: '', password: '', role: 'waiter' });
      fetchStaff();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const getRoleColor = (role) => {
    const colors = { admin: '#ef4444', manager: '#8b5cf6', kitchen: '#f59e0b', waiter: '#3b82f6', cashier: '#10b981', driver: '#06b6d4' };
    return colors[role] || '#6b7280';
  };

  const getRoleEmoji = (role) => {
    const emojis = { admin: '👑', manager: '📋', kitchen: '👨‍🍳', waiter: '🍽️', cashier: '💰', driver: '🚗' };
    return emojis[role] || '👤';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">👥 Staff</Typography>
        <Button variant="contained" startIcon={showForm ? <Close /> : <PersonAdd />} onClick={() => setShowForm(!showForm)} color={showForm ? 'secondary' : 'primary'}>
          {showForm ? 'Close' : 'Add Staff'}
        </Button>
      </Box>

      <Collapse in={showForm}>
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>➕ New Staff Member</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      <MenuItem value="admin">👑 Admin</MenuItem>
                      <MenuItem value="manager">📋 Manager</MenuItem>
                      <MenuItem value="kitchen">👨‍🍳 Kitchen</MenuItem>
                      <MenuItem value="waiter">🍽️ Waiter</MenuItem>
                      <MenuItem value="cashier">💰 Cashier</MenuItem>
                      <MenuItem value="driver">🚗 Driver</MenuItem>
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

      <Grid container spacing={2}>
        {staff.map(member => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
            <Card sx={{ textAlign: 'center', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, bgcolor: getRoleColor(member.role), fontSize: '1.5rem' }}>
                  {getRoleEmoji(member.role)}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{member.email}</Typography>
                <Chip label={member.role} size="small" sx={{ bgcolor: getRoleColor(member.role), color: 'white', fontWeight: 700 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StaffPage;
