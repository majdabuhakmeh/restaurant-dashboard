import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ThemePage() {
  const [settings, setSettings] = useState({
    logo_url: '',
    primary_color: '#ff6b35',
    secondary_color: '#2c3e50',
    background_color: '#ffffff',
    text_color: '#333333',
    font_family: 'Cairo',
    button_style: 'rounded',
    welcome_message: '',
    currency: 'SAR',
    language: 'ar'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      alert('✅ Theme & settings saved successfully!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for preview (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="empty-state"><p>Loading settings...</p></div>;

  const buttonRadius = settings.button_style === 'pill' ? '50px' : settings.button_style === 'square' ? '0' : '12px';

  return (
    <div>
      <div className="page-header">
        <h1>🎨 Theme & Settings</h1>
        <button className="btn btn-success" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Settings Panel */}
        <div>
          {/* Logo Upload */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>📷 Restaurant Logo</h3>
            <div className="logo-upload" onClick={() => document.getElementById('logo-input').click()}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" />
              ) : (
                <div className="placeholder">🍕</div>
              )}
              <p style={{ fontSize: '13px', color: '#888' }}>Click to upload logo</p>
              <p style={{ fontSize: '11px', color: '#bbb' }}>PNG, JPG • Max 2MB</p>
            </div>
            <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            
            {/* OR paste URL */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Or paste logo URL:</label>
              <input
                className="form-input"
                placeholder="https://example.com/logo.png"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              />
            </div>
          </div>

          {/* Colors */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>🎨 Colors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { key: 'primary_color', label: 'Primary Color' },
                { key: 'secondary_color', label: 'Secondary Color' },
                { key: 'background_color', label: 'Background' },
                { key: 'text_color', label: 'Text Color' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="color"
                      value={settings[key] || '#000000'}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                      style={{ width: '48px', height: '40px', border: '2px solid #e8e8e8', borderRadius: '10px', cursor: 'pointer', padding: '2px' }}
                    />
                    <input
                      className="form-input"
                      value={settings[key] || ''}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Style */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>🔤 Typography & Style</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Font Family</label>
                <select className="form-input" value={settings.font_family || 'Cairo'} onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}>
                  <option value="Cairo">Cairo (Arabic)</option>
                  <option value="Tajawal">Tajawal (Arabic)</option>
                  <option value="Poppins">Poppins (English)</option>
                  <option value="Inter">Inter (English)</option>
                  <option value="Roboto">Roboto (English)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Button Style</label>
                <select className="form-input" value={settings.button_style || 'rounded'} onChange={(e) => setSettings({ ...settings, button_style: e.target.value })}>
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </select>
              </div>
            </div>
          </div>

          {/* Restaurant Settings */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>⚙️ Restaurant Info</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Welcome Message</label>
                <input className="form-input" placeholder="Welcome to our restaurant!" value={settings.welcome_message || ''} onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select className="form-input" value={settings.currency || 'SAR'} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
                  <option value="SAR">SAR (ريال)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (درهم)</option>
                  <option value="JOD">JOD (دينار)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select className="form-input" value={settings.language || 'ar'} onChange={(e) => setSettings({ ...settings, language: e.target.value })}>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ position: 'sticky', top: '20px', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '14px', color: '#888' }}>📱 Live Preview</h3>
          <div style={{ border: '3px solid #e0e0e0', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', backgroundColor: settings.background_color, fontFamily: settings.font_family }}>
            {/* Header */}
            <div style={{ backgroundColor: settings.primary_color, padding: '20px', textAlign: 'center', color: 'white' }}>
              {settings.logo_url && <img src={settings.logo_url} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '8px', objectFit: 'cover' }} />}
              <h3 style={{ margin: 0, fontSize: '18px' }}>Pizza Palace</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.9 }}>{settings.welcome_message || 'Welcome!'}</p>
            </div>
            {/* Items */}
            <div style={{ padding: '16px' }}>
              {['Margherita Pizza', 'Garlic Bread'].map((name, i) => (
                <div key={i} style={{ backgroundColor: '#f8f9fa', padding: '14px', borderRadius: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: settings.text_color }}>{name}</p>
                      <p style={{ margin: '4px 0 0', color: settings.primary_color, fontWeight: 700, fontSize: '15px' }}>
                        {settings.currency} {i === 0 ? '12.99' : '5.99'}
                      </p>
                    </div>
                    <button style={{ padding: '8px 14px', backgroundColor: settings.primary_color, color: 'white', border: 'none', borderRadius: buttonRadius, fontSize: '12px', fontWeight: 600 }}>
                      + Add
                    </button>
                  </div>
                </div>
              ))}
              <button style={{ width: '100%', padding: '14px', backgroundColor: settings.secondary_color, color: 'white', border: 'none', borderRadius: buttonRadius, fontWeight: 700, fontSize: '14px', marginTop: '8px' }}>
                🛒 View Cart — {settings.currency} 18.98
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemePage;
