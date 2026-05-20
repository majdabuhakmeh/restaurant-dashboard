import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  Switch, FormControlLabel, Select, MenuItem, InputLabel,
  FormControl, Chip, IconButton, Collapse
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import api from '../services/api';

function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', is_available: true });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await api.get('/menu-items'); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await api.put(`/menu-items/${editingItem.id}`, form);
      else await api.post('/menu-items', form);
      setShowForm(false); setEditingItem(null);
      setForm({ name: '', description: '', price: '', category_id: '', is_available: true });
      fetchItems();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description || '', price: item.price, category_id: item.category_id || '', is_available: item.is_available });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.delete(`/menu-items/${id}`); fetchItems(); }
    catch (err) { alert('Error deleting'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">🍔 Menu Items</Typography>
        <Button
          variant="contained"
          startIcon={showForm ? <Close /> : <Add />}
          onClick={() => { setShowForm(!showForm); setEditingItem(null); setForm({ name: '', description: '', price: '', category_id: '', is_available: true }); }}
          color={showForm ? 'secondary' : 'primary'}
        >
          {showForm ? 'Close Form' : 'Add Item'}
        </Button>
      </Box>

      {/* Form */}
      <Collapse in={showForm}>
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {editingItem ? '✏️ Edit Item' : '➕ New Menu Item'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Price" type="number" inputProps={{ step: '0.01' }} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={form.category_id} label="Category" onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="c1111111-1111-1111-1111-111111111111">Appetizers</MenuItem>
                      <MenuItem value="c2222222-2222-2222-2222-222222222222">Main Course</MenuItem>
                      <MenuItem value="c3333333-3333-3333-3333-333333333333">Drinks</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel control={<Switch checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />} label="Available for ordering" />
                    <Button type="submit" variant="contained" size="large">
                      {editingItem ? 'Update Item ✅' : 'Add Item ✅'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Collapse>

      {/* Items Grid */}
      <Grid container spacing={2}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>{item.name}</Typography>
                  <Chip label={item.is_available ? 'Available' : 'Sold Out'} size="small" color={item.is_available ? 'success' : 'error'} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                {item.category_name && <Chip label={item.category_name} size="small" variant="outlined" color="info" sx={{ mb: 1.5 }} />}
                <Typography variant="h5" color="success.main" fontWeight={700}>${item.price}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleEdit(item)} fullWidth>Edit</Button>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}><Delete /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MenuPage;
