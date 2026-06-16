import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import { login } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      onLogin(response.staff);
    } catch (err) {
      // Sanitize error message to prevent XSS
      const errorMessage = err.message || 'Login failed. Please try again.';
      const sanitizedError = DOMPurify.sanitize(errorMessage);
      setError(sanitizedError);
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
              disabled={loading}
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
              disabled={loading}
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
            🔒 Your login is secure. Passwords are encrypted.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
