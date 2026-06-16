import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, useMediaQuery, Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as OrdersIcon,
  Restaurant as MenuIcon,
  People as StaffIcon,
  Palette as ThemeIcon,
  Logout as LogoutIcon,
  Menu as MenuToggleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import StaffPage from './pages/StaffPage';
import ThemePage from './pages/ThemePage';
import { logout, restoreSession } from './services/api';

const DRAWER_WIDTH = 248;

const ROLE_STYLE = {
  admin:   { bg: '#fff0f5', color: '#FF2D6B' },
  manager: { bg: '#ede9fe', color: '#6d28d9' },
  kitchen: { bg: '#fef3c7', color: '#b45309' },
  waiter:  { bg: '#dbeafe', color: '#1d4ed8' },
  cashier: { bg: '#d1fae5', color: '#065f46' },
  driver:  { bg: '#cffafe', color: '#0e7490' },
};

function App() {
  const [staff, setStaff]         = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authPage, setAuthPage]   = useState('login');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const saved = restoreSession();
    if (saved) setStaff(saved);
  }, []);

  const handleLogin  = (staffData) => { setStaff(staffData); setActivePage('dashboard'); };
  const handleLogout = async () => { await logout(); setStaff(null); setAuthPage('login'); };

  if (!staff) {
    if (authPage === 'register') return <Register onLogin={handleLogin} onSignIn={() => setAuthPage('login')} />;
    return <Login onLogin={handleLogin} onRegister={() => setAuthPage('register')} />;
  }

  const rolePages = {
    admin:   ['dashboard', 'orders', 'menu', 'staff', 'theme'],
    manager: ['dashboard', 'orders', 'menu', 'staff', 'theme'],
    kitchen: ['dashboard', 'orders'],
    waiter:  ['dashboard', 'orders', 'menu'],
    cashier: ['dashboard', 'orders', 'menu'],
    driver:  ['dashboard', 'orders'],
  };
  const allowedPages = rolePages[staff.role] || ['dashboard', 'orders'];

  const pages = {
    dashboard: { icon: <DashboardIcon />, label: 'Dashboard',        component: <DashboardPage /> },
    orders:    { icon: <OrdersIcon />,    label: 'Orders',           component: <OrdersPage />   },
    menu:      { icon: <MenuIcon />,      label: 'Menu',             component: <MenuPage />     },
    staff:     { icon: <StaffIcon />,     label: 'Staff',            component: <StaffPage />    },
    theme:     { icon: <ThemeIcon />,     label: 'Theme & Settings', component: <ThemePage />    },
  };

  const roleStyle = ROLE_STYLE[staff.role] || { bg: '#f3f4f6', color: '#374151' };

  const navigate = (page) => { setActivePage(page); setMobileOpen(false); };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', borderRight: '1px solid #f3f4f6' }}>

      {/* ── Logo ── */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(255,45,107,0.3)' }}>
          🍕
        </Box>
        <Typography fontWeight={800} fontSize="1rem" color="text.primary" sx={{ letterSpacing: '-0.3px' }}>
          Pizza Palace
        </Typography>
        {isMobile && (
          <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => setMobileOpen(false)}>
            <MenuToggleIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* ── User info ── */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: '#fafafa' }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 700, fontSize: '0.9rem', border: `1.5px solid ${roleStyle.color}25` }}>
            {staff.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {staff.name}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', textTransform: 'capitalize' }}>
              {staff.role}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Navigation ── */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {allowedPages.map((page) => {
          const isActive = activePage === page;
          return (
            <ListItemButton
              key={page}
              selected={isActive}
              onClick={() => navigate(page)}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                py: 1,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? '#fff0f5' : 'transparent',
                '&:hover': { bgcolor: isActive ? '#fff0f5' : '#fafafa', color: 'primary.main' },
                '&.Mui-selected': {
                  bgcolor: '#fff0f5',
                  '&:hover': { bgcolor: '#ffe4ee' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                transition: 'all 0.15s',
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : '#9ca3af', minWidth: 36 }}>
                {pages[page].icon}
              </ListItemIcon>
              <ListItemText
                primary={pages[page].label}
                primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.875rem' }}
              />
              {/* Badge on Orders */}
              {page === 'orders' && (
                <Chip label="!" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: 'white', minWidth: 20 }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* ── CTA card (matches the Koki pink card) ── */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{
          p: 2,
          background: 'linear-gradient(135deg, #FF2D6B 0%, #ff6b9d 100%)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.25)', top: -20, right: -20 }} />
          <Box sx={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.15)', bottom: 8, right: 24 }} />
          <Typography sx={{ color: 'white', fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.5, mb: 1.5, position: 'relative' }}>
            Manage your menu items through the button below
          </Typography>
          <Box
            component="button"
            onClick={() => navigate('menu')}
            sx={{
              display: 'block', width: '100%', py: 0.8,
              bgcolor: 'white', color: 'primary.main',
              border: 'none', borderRadius: 99,
              fontWeight: 700, fontSize: '0.8rem',
              cursor: 'pointer', position: 'relative',
              '&:hover': { bgcolor: '#fff0f5' },
              fontFamily: 'inherit',
            }}
          >
            + Add Menu Item
          </Box>
        </Box>
      </Box>

      {/* ── Logout ── */}
      <Box sx={{ px: 2, pb: 2.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2.5, color: '#ef4444', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
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
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 14, left: 14, zIndex: 1300, bgcolor: 'primary.main', color: 'white', width: 40, height: 40, boxShadow: '0 4px 14px rgba(255,45,107,0.4)', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <MenuToggleIcon fontSize="small" />
        </IconButton>
      )}

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxShadow: 'none' } }}>
            {drawer}
          </Drawer>
        ) : (
          <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxShadow: 'none' } }}>
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        {pages[activePage]?.component}
      </Box>
    </Box>
  );
}

export default App;
