import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Grid,
  ToggleButton, ToggleButtonGroup, IconButton, Tooltip
} from '@mui/material';
import { Refresh, TrendingUp, AccessTime, CheckCircle, LocalShipping } from '@mui/icons-material';
import api from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const getNextStatus = (status) => {
    const flow = { pending: 'preparing', preparing: 'ready', ready: 'delivered' };
    return flow[status] || null;
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'warning', preparing: 'info', ready: 'success', delivered: 'default', cancelled: 'error' };
    return colors[status] || 'default';
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <TrendingUp />, color: '#3b82f6' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: <AccessTime />, color: '#f59e0b' },
    { label: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, icon: <LocalShipping />, color: '#8b5cf6' },
    { label: 'Ready', value: orders.filter(o => o.status === 'ready').length, icon: <CheckCircle />, color: '#10b981' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">📋 Orders</Typography>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchOrders}>
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Card sx={{ background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`, border: `1px solid ${stat.color}20` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Tabs */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, val) => val && setFilter(val)}
        sx={{ mb: 3, flexWrap: 'wrap' }}
      >
        {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map(f => (
          <ToggleButton key={f} value={f} sx={{ px: 2.5, textTransform: 'capitalize', fontWeight: 600 }}>
            {f} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Orders Grid */}
      <Grid container spacing={2}>
        {filteredOrders.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography variant="h6">No orders found</Typography>
            </Box>
          </Grid>
        ) : (
          filteredOrders.map(order => (
            <Grid item xs={12} sm={6} lg={4} key={order.id}>
              <Card sx={{ borderLeft: `4px solid`, borderLeftColor: `${getStatusColor(order.status)}.main`, transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>
                      {order.type?.replace('_', ' ')}
                    </Typography>
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                    ${order.total_amount}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {order.notes || 'No notes'}
                  </Typography>

                  <Typography variant="caption" color="text.disabled">
                    {new Date(order.created_at).toLocaleString()}
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {getNextStatus(order.status) && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => updateStatus(order.id, getNextStatus(order.status))}
                      >
                        → {getNextStatus(order.status)}
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateStatus(order.id, 'cancelled')}
                      >
                        ✕
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default OrdersPage;
