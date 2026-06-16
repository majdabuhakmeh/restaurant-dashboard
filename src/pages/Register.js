import React, { useState } from 'react';
import {
  Box, Card, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import { StorefrontOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { register } from '../services/api';

function Register({ onLogin, onSignIn }) {
  const [form, setForm] = useState({
    restaurantName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        restaurantName: form.restaurantName,
        adminName:      form.adminName,
        email:          form.email,
        password:       form.password,
      });
      onLogin(response.staff);
    } catch (err) {
      setError(err.message);
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
        <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', top: -80, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', bottom: 40, left: -60 }} />

        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>🚀</Typography>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1.5, letterSpacing: '-1px' }}>
            Start for free
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.80)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 340 }}>
            Create your restaurant account in seconds. No setup fees, no contracts.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4, textAlign: 'left' }}>
            {[
              '✅ Your own digital menu',
              '✅ Real-time order management',
              '✅ Staff & role management',
              '✅ Custom theme & branding',
            ].map(line => (
              <Typography key={line} sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>
                {line}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right — registration form */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 2, sm: 4 }, overflowY: 'auto' }}>
        <Card sx={{ p: { xs: 3, sm: 4.5 }, width: '100%', maxWidth: 460, borderRadius: 4, boxShadow: '0 8px 40px rgba(139,92,246,0.12)', my: 3 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 14px rgba(168,85,247,0.35)' }}>
              <StorefrontOutlined sx={{ color: 'white', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>Create your restaurant</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
              Fill in the details below to get started
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            {/* Section label */}
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
              Restaurant Info
            </Typography>
            <TextField
              fullWidth
              label="Restaurant Name"
              placeholder="e.g. Pizza Palace"
              value={form.restaurantName}
              onChange={set('restaurantName')}
              margin="normal"
              required
              disabled={loading}
              sx={{ mt: 0.5 }}
            />

            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase', letterSpacing: 1, mt: 2.5, mb: 0.5, display: 'block' }}>
              Admin Account
            </Typography>
            <TextField
              fullWidth
              label="Your Full Name"
              placeholder="e.g. Ahmed Al-Rashid"
              value={form.adminName}
              onChange={set('adminName')}
              margin="normal"
              required
              disabled={loading}
              sx={{ mt: 0.5 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="ahmed@yourrestaurant.com"
              value={form.email}
              onChange={set('email')}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set('password')}
              margin="normal"
              required
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small" tabIndex={-1}>
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Restaurant 🎉'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <Typography
              component="span"
              onClick={onSignIn}
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign In
            </Typography>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Register;
