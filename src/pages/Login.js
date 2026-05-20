import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import api from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('staff', JSON.stringify(response.data.staff));
      onLogin(response.data.staff);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Left Side - Branding */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6 }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>🍕</Typography>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, textAlign: 'center', mb: 2 }}>
          Restaurant Dashboard
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 400, fontSize: '1.1rem', lineHeight: 1.8 }}>
          Manage orders, menu, staff, and everything from one powerful dashboard.
        </Typography>
      </Box>

      {/* Right Side - Login Form */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <Card sx={{ p: 5, width: '100%', maxWidth: 440, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>Welcome Back</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Sign in to your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              placeholder="ahmed@pizzapalace.com"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              placeholder="Enter your password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontSize: '1rem', boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.disabled', fontSize: '0.8rem' }}>
            Test: ahmed@pizzapalace.com / password123
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
