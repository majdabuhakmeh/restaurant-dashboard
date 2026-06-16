import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, useMediaQuery, Divider, Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as OrdersIcon,
  Restaurant as MenuIcon,
  People as StaffIcon,
  Palette as ThemeIcon,
  Logout as LogoutIcon,
  Menu as MenuToggleIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Login from './pages/Login';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import StaffPage from './pages/StaffPage';
import ThemePage from './pages/ThemePage';
import { logout, restoreSession } from './services/api';

const drawerWidth = 280;

function App() {
  const [staff, setStaff] = useState(null);
  const [activePage, setActivePage] = useState('orders');
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    // Restore session from localStorage on app load
    const savedStaff = restoreSession();
    if (savedStaff) setStaff(savedStaff);
  }, []);

  const handleLogin = (staffData) => setStaff(staffData);

  const handleLogout = async () => {
    await logout();
    setStaff(null);
  };

  if (!staff) return <Login onLogin={handleLogin} />;

  const rolePages = {
    admin: ['orders', 'menu', 'staff', 'theme'],
    manager: ['orders', 'menu', 'staff', 'theme'],
    kitchen: ['orders'],
    waiter: ['orders', 'menu'],
    cashier: ['orders', 'menu'],
    driver: ['orders']
  };

  const allowedPages = rolePages[staff.role] || ['orders'];

  const pages = {
    orders: { icon: <OrdersIcon />, label: 'Orders', component: <OrdersPage /> },
    menu: { icon: <MenuIcon />, label: 'Menu', component: <MenuPage /> },
    staff: { icon: <StaffIcon />, label: 'Staff', component: <StaffPage /> },
    theme: { icon: <ThemeIcon />, label: 'Theme & Settings', component: <ThemePage /> },
  };

  const getRoleColor = (role) => {
    const colors = { admin: '#ef4444', manager: '#8b5cf6', kitchen: '#f59e0b', waiter: '#3b82f6', cashier: '#10b981', driver: '#06b6d4' };
    return colors[role] || '#6b7280';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          🍕 Pizza Palace
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Avatar sx={{ bgcolor: getRoleColor(staff.role), width: 44, height: 44, fontSize: '1.2rem' }}>
            {staff.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
              {staff.name}
            </Typography>
            <Chip
              label={staff.role.toUpperCase()}
              size="small"
              sx={{ mt: 0.5, bgcolor: getRoleColor(staff.role), color: 'white', fontWeight: 700, fontSize: '0.65rem', height: 22 }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {allowedPages.map((page) => (
          <ListItemButton
            key={page}
            selected={activePage === page}
            onClick={() => { setActivePage(page); setMobileOpen(false); }}
            sx={{
              borderRadius: 2.5,
              mb: 0.5,
              color: 'rgba(255,255,255,0.6)',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: '0 4px 15px rgba(255,107,53,0.4)',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {pages[page].icon}
            </ListItemIcon>
            <ListItemText primary={pages[page].label} primaryTypographyProps={{ fontWeight: activePage === page ? 600 : 400, fontSize: '0.9rem' }} />
          </ListItemButton>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2.5, color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)', '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile toggle */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300, bgcolor: 'secondary.main', color: 'white', boxShadow: 3, '&:hover': { bgcolor: 'secondary.light' } }}
        >
          <MenuToggleIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}>
            {drawer}
          </Drawer>
        ) : (
          <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}>
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}>
        {pages[activePage]?.component}
      </Box>
    </Box>
  );
}

export default App;
