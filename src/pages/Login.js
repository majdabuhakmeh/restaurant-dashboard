import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import { login } from '../services/api';

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Please enter both email and password'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const response = await login(email, password);
      onLogin(response.staff);
    } catch (err) {
      setError(DOMPurify.sanitize(err.message || 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#faf8ff' }}>

      {/* Left — brand panel */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 6,
        background: 'linear-gradient(160deg, #7c3aed 0%, #a855f7 55%, #c084fc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative soft circles */}
        <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', top: -80, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', bottom: 40, left: -60 }} />

        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>🍕</Typography>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1.5, letterSpacing: '-1px' }}>
            Pizza Palace
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.80)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 340 }}>
            Manage your orders, menu, staff, and branding — all from one beautiful dashboard.
          </Typography>

          {/* Feature pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 4 }}>
            {['📋 Orders', '🍽️ Menu', '👥 Staff', '🎨 Theme'].map(label => (
              <Box key={label} sx={{ px: 2, py: 0.7, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 99, fontSize: '0.8rem', color: 'white', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right — login form */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 2, sm: 4 } }}>
        <Card sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 4, boxShadow: '0 8px 40px rgba(139,92,246,0.12)' }}>

          {/* Icon */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 14px rgba(168,85,247,0.35)' }}>
              <LockOutlined sx={{ color: 'white', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">Welcome back</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>Sign in to your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              margin="normal" required disabled={loading}
              placeholder="ahmed@pizzapalace.com"
            />
            <TextField
              fullWidth label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              margin="normal" required disabled={loading}
              placeholder="Enter your password"
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: '0.85rem' }}>
            New restaurant?{' '}
            <Typography
              component="span"
              onClick={onRegister}
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Create your account →
            </Typography>
          </Typography>

          <Typography sx={{ textAlign: 'center', mt: 1.5, color: 'text.disabled', fontSize: '0.75rem' }}>
            🔒 Your login is secure and encrypted.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
