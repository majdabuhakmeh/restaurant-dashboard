import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Restaurant as MenuIcon,
  Receipt as OrdersIcon,
  People as StaffIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import api from '../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PINK      = '#FF2D6B';
const PINK_SOFT = '#fff0f5';
const PURPLE    = '#c084fc';

function StatCard({ label, value, icon, sparkData, dataKey }) {
  return (
    <Card>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary">{value}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{label}</Typography>
          </Box>
          <Box sx={{ bgcolor: PINK_SOFT, p: 1, borderRadius: 2.5, color: PINK, display: 'flex' }}>
            {icon}
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={48}>
          <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PINK} stopOpacity={0.25} />
                <stop offset="100%" stopColor={PINK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey={dataKey} stroke={PINK} strokeWidth={2} fill={`url(#spark-${label})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const [stats, setStats]       = useState({ orders: 0, menuItems: 0, staff: 0, revenue: 0 });
  const [monthlyData, setMonthly] = useState(MONTHS.map(m => ({ month: m, orders: 0, revenue: 0 })));
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [ordersRes, menuRes, staffRes] = await Promise.all([
        api.get('/orders'),
        api.get('/menu-items'),
        api.get('/staff'),
      ]);

      const orders    = ordersRes.data.orders || [];
      const menuItems = menuRes.data.items    || [];
      const staff     = staffRes.data         || [];

      const revenue = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

      setStats({
        orders:    orders.length,
        menuItems: menuItems.length,
        staff:     staff.length,
        revenue:   revenue.toFixed(0),
      });

      // Group by month
      const byMonth = MONTHS.map((month, i) => {
        const monthOrders = orders.filter(o => new Date(o.created_at).getMonth() === i);
        return {
          month,
          orders:  monthOrders.length,
          revenue: parseFloat(monthOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0).toFixed(0)),
        };
      });
      setMonthly(byMonth);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Menu Items', value: stats.menuItems, icon: <MenuIcon />,    dataKey: 'orders'  },
    { label: 'Orders',     value: stats.orders,    icon: <OrdersIcon />,  dataKey: 'orders'  },
    { label: 'Staff',      value: stats.staff,     icon: <StaffIcon />,   dataKey: 'orders'  },
    { label: 'Revenue (SAR)', value: `${Number(stats.revenue).toLocaleString()}`, icon: <RevenueIcon />, dataKey: 'revenue' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>

      {/* ── Stat cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(card => (
          <Grid item xs={12} sm={6} lg={3} key={card.label}>
            <StatCard {...card} sparkData={monthlyData} />
          </Grid>
        ))}
      </Grid>

      {/* ── Charts ── */}
      <Grid container spacing={2}>
        {/* Revenue area chart */}
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 4, height: 20, bgcolor: PINK, borderRadius: 2 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Monthly income from orders
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={PINK}   stopOpacity={0.25} />
                      <stop offset="95%" stopColor={PINK}   stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={PURPLE} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={PINK}   strokeWidth={2.5} fill="url(#gradRevenue)" name="Revenue (SAR)" />
                  <Area type="monotone" dataKey="orders"  stroke={PURPLE} strokeWidth={2.5} fill="url(#gradOrders)"  name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders bar chart */}
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 4, height: 20, bgcolor: PINK, borderRadius: 2 }} />
                <Typography variant="h6">Orders by Month</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Monthly order volume
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="orders" fill={PINK} radius={[6, 6, 0, 0]} name="Orders" maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
