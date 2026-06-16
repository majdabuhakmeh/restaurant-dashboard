import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { Save, Palette } from '@mui/icons-material';
import api from '../services/api';

const COLOR_FIELDS = [
  { key: 'primary_color',    label: 'Primary Color'    },
  { key: 'secondary_color',  label: 'Secondary Color'  },
  { key: 'background_color', label: 'Background'       },
  { key: 'text_color',       label: 'Text Color'       },
];

function ThemePage() {
  const [settings, setSettings] = useState({
    logo_url:         '',
    primary_color:    '#ff6b35',
    secondary_color:  '#2c3e50',
    background_color: '#ffffff',
    text_color:       '#333333',
    font_family:      'Cairo',
    button_style:     'rounded',
    welcome_message:  '',
    currency:         'SAR',
    language:         'ar',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...res.data }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const set = (field) => (e) => {
    setSaved(false);
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSettings(prev => ({ ...prev, logo_url: reader.result }));
    reader.readAsDataURL(file);
  };

  const buttonRadius =
    settings.button_style === 'pill'   ? '50px' :
    settings.button_style === 'square' ? '0'    : '12px';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">🎨 Theme & Settings</Typography>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>✅ Settings saved successfully!</Alert>}

      <Grid container spacing={3}>
        {/* ── Left: Settings ── */}
        <Grid item xs={12} md={7} lg={8}>

          {/* Logo */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>📷 Restaurant Logo</Typography>

              <Box
                onClick={() => document.getElementById('logo-input').click()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.light',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 2,
                  bgcolor: '#fff0f5',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: '#ffe4ee' },
                }}
              >
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                ) : (
                  <Box>
                    <Typography sx={{ fontSize: '2.5rem', lineHeight: 1, mb: 1 }}>🍕</Typography>
                    <Typography variant="body2" color="text.secondary">Click to upload logo</Typography>
                    <Typography variant="caption" color="text.disabled">PNG, JPG • Max 2MB</Typography>
                  </Box>
                )}
              </Box>
              <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />

              <TextField
                fullWidth
                label="Or paste logo URL"
                placeholder="https://example.com/logo.png"
                value={settings.logo_url || ''}
                onChange={set('logo_url')}
                size="small"
              />
            </CardContent>
          </Card>

          {/* Colors */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>🎨 Colors</Typography>
              <Grid container spacing={2}>
                {COLOR_FIELDS.map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      {label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                        <input
                          type="color"
                          value={settings[key] || '#000000'}
                          onChange={set(key)}
                          style={{
                            width: '44px', height: '44px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            padding: '2px',
                            backgroundColor: 'white',
                          }}
                        />
                      </Box>
                      <TextField
                        value={settings[key] || ''}
                        onChange={set(key)}
                        size="small"
                        sx={{ flex: 1 }}
                        inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Typography & Style */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>🔤 Typography & Style</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Font Family</InputLabel>
                    <Select value={settings.font_family || 'Cairo'} label="Font Family" onChange={set('font_family')}>
                      <MenuItem value="Cairo">Cairo (Arabic)</MenuItem>
                      <MenuItem value="Tajawal">Tajawal (Arabic)</MenuItem>
                      <MenuItem value="Poppins">Poppins (English)</MenuItem>
                      <MenuItem value="Inter">Inter (English)</MenuItem>
                      <MenuItem value="Roboto">Roboto (English)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Button Style</InputLabel>
                    <Select value={settings.button_style || 'rounded'} label="Button Style" onChange={set('button_style')}>
                      <MenuItem value="rounded">Rounded</MenuItem>
                      <MenuItem value="square">Square</MenuItem>
                      <MenuItem value="pill">Pill</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>⚙️ Restaurant Info</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth size="small"
                    label="Welcome Message"
                    placeholder="Welcome to our restaurant!"
                    value={settings.welcome_message || ''}
                    onChange={set('welcome_message')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Currency</InputLabel>
                    <Select value={settings.currency || 'SAR'} label="Currency" onChange={set('currency')}>
                      <MenuItem value="SAR">SAR (ريال)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="AED">AED (درهم)</MenuItem>
                      <MenuItem value="JOD">JOD (دينار)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select value={settings.language || 'ar'} label="Language" onChange={set('language')}>
                      <MenuItem value="ar">العربية</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right: Live Preview ── */}
        <Grid item xs={12} md={5} lg={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
              📱 Live Preview
            </Typography>
            <Box sx={{ border: '3px solid #e5e7eb', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', bgcolor: settings.background_color, fontFamily: settings.font_family }}>
              {/* Phone header */}
              <Box sx={{ bgcolor: settings.primary_color, p: 2.5, textAlign: 'center', color: 'white' }}>
                {settings.logo_url && (
                  <Box component="img" src={settings.logo_url} alt="Logo" sx={{ width: 48, height: 48, borderRadius: '12px', mb: 1, objectFit: 'cover', display: 'block', mx: 'auto' }} />
                )}
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>Pizza Palace</Typography>
                <Typography sx={{ fontSize: '0.75rem', opacity: 0.9, color: 'white', mt: 0.3 }}>
                  {settings.welcome_message || 'Welcome!'}
                </Typography>
              </Box>

              {/* Menu items */}
              <Box sx={{ p: 2 }}>
                {['Margherita Pizza', 'Garlic Bread'].map((name, i) => (
                  <Box key={i} sx={{ bgcolor: '#f8f9fa', p: 1.5, borderRadius: '10px', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: settings.text_color }}>{name}</Typography>
                      <Typography sx={{ color: settings.primary_color, fontWeight: 700, fontSize: '0.9rem', mt: 0.3 }}>
                        {settings.currency} {i === 0 ? '12.99' : '5.99'}
                      </Typography>
                    </Box>
                    <Box
                      component="button"
                      sx={{ px: 1.5, py: 0.6, bgcolor: settings.primary_color, color: 'white', border: 'none', borderRadius: buttonRadius, fontSize: '0.75rem', fontWeight: 600, cursor: 'default', fontFamily: 'inherit' }}
                    >
                      + Add
                    </Box>
                  </Box>
                ))}

                <Box
                  component="button"
                  sx={{ width: '100%', py: 1.5, bgcolor: settings.secondary_color, color: 'white', border: 'none', borderRadius: buttonRadius, fontWeight: 700, fontSize: '0.85rem', mt: 0.5, cursor: 'default', fontFamily: 'inherit' }}
                >
                  🛒 View Cart — {settings.currency} 18.98
                </Box>
              </Box>
            </Box>

            {/* Color swatches summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {COLOR_FIELDS.map(({ key, label }) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: settings[key], border: '1px solid #e5e7eb' }} />
                  <Typography variant="caption" color="text.secondary">{label.split(' ')[0]}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ThemePage;
