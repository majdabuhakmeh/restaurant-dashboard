import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, useMediaQuery, Divider, Chip
} from '@mui/material';
import {
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

const DRAWER_WIDTH = 268;

// Pastel role colours — bg + text pairs
const ROLE_STYLE = {
  admin:   { bg: '#fce7f3', color: '#be185d' },
  manager: { bg: '#ede9fe', color: '#6d28d9' },
  kitchen: { bg: '#fef3c7', color: '#b45309' },
  waiter:  { bg: '#dbeafe', color: '#1d4ed8' },
  cashier: { bg: '#d1fae5', color: '#065f46' },
  driver:  { bg: '#cffafe', color: '#0e7490' },
};

function App() {
  const [staff, setStaff] = useState(null);
  const [activePage, setActivePage] = useState('orders');
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const savedStaff = restoreSession();
    if (savedStaff) setStaff(savedStaff);
  }, []);

  const handleLogin  = (staffData) => setStaff(staffData);
  const handleLogout = async () => { await logout(); setStaff(null); };

  if (!staff) return <Login onLogin={handleLogin} />;

  const rolePages = {
    admin:   ['orders', 'menu', 'staff', 'theme'],
    manager: ['orders', 'menu', 'staff', 'theme'],
    kitchen: ['orders'],
    waiter:  ['orders', 'menu'],
    cashier: ['orders', 'menu'],
    driver:  ['orders'],
  };

  const allowedPages = rolePages[staff.role] || ['orders'];

  const pages = {
    orders: { icon: <OrdersIcon />, label: 'Orders',           component: <OrdersPage /> },
    menu:   { icon: <MenuIcon />,   label: 'Menu',             component: <MenuPage />   },
    staff:  { icon: <StaffIcon />,  label: 'Staff',            component: <StaffPage />  },
    theme:  { icon: <ThemeIcon />,  label: 'Theme & Settings', component: <ThemePage />  },
  };

  const roleStyle = ROLE_STYLE[staff.role] || { bg: '#f3f4f6', color: '#374151' };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', borderRight: '1px solid #f3e8ff' }}>

      {/* Logo */}
      <Box sx={{ px: 3, pt: 3.5, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark', letterSpacing: '-0.5px' }}>
          🍕 Pizza Palace
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* User card */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 3, bgcolor: '#fdf4ff' }}>
          <Avatar sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, width: 40, height: 40, fontWeight: 700, fontSize: '1rem', border: `2px solid ${roleStyle.color}30` }}>
            {staff.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {staff.name}
            </Typography>
            <Chip
              label={staff.role}
              size="small"
              sx={{ mt: 0.4, height: 20, fontSize: '0.62rem', fontWeight: 700, bgcolor: roleStyle.bg, color: roleStyle.color, textTransform: 'capitalize' }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#f3e8ff', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 1.5, flex: 1 }}>
        {allowedPages.map((page) => {
          const isActive = activePage === page;
          return (
            <ListItemButton
              key={page}
              selected={isActive}
              onClick={() => { setActivePage(page); setMobileOpen(false); }}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                pl: isActive ? 1.5 : 2,
                borderLeft: isActive ? '3px solid' : '3px solid transparent',
                borderColor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'primary.dark' : 'text.secondary',
                bgcolor: isActive ? '#fdf4ff' : 'transparent',
                '&:hover': {
                  bgcolor: '#fdf4ff',
                  color: 'primary.dark',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&.Mui-selected': {
                  bgcolor: '#fdf4ff',
                  '&:hover': { bgcolor: '#f5e6ff' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit', minWidth: 38 }}>
                {pages[page].icon}
              </ListItemIcon>
              <ListItemText
                primary={pages[page].label}
                primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.875rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2.5, color: '#e11d48', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Mobile hamburger */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ position: 'fixed', top: 14, left: 14, zIndex: 1300, bgcolor: 'primary.main', color: 'white', boxShadow: '0 4px 14px rgba(168,85,247,0.4)', width: 42, height: 42, '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <MenuToggleIcon fontSize="small" />
        </IconButton>
      )}

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}
      >
        {pages[activePage]?.component}
      </Box>
    </Box>
  );
}

export default App;
