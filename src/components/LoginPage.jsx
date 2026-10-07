import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const { login, register, backendHealth } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('operator@nimbus.earth');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const regRes = await register({
          email,
          password,
          role,
          full_name: fullName || email.split('@')[0]
        });
        setSuccessMsg(regRes.message || 'Akun berhasil dibuat! Silakan login sekarang.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (presetEmail, presetPassword) => {
    setEmail(presetEmail);
    setPassword(presetPassword);
    setError('');
    setLoading(true);
    login(presetEmail, presetPassword)
      .catch(err => {
        setError(err.message || 'Login failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <section id="login" className="login">
      <div className="login-card">
        {/* Left Visual Banner */}
        <div className="login-visual">
          <div className="logo-image">
            <img src="/nimbus-logo.png" alt="Nimbus logo" />
          </div>
          <h1>Climate & Environmental Intelligence for a Resilient Tomorrow</h1>
          <p>From data to action for people, nature and sustainable growth.</p>
        </div>

        {/* Right Form Card */}
        <div className="login-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              >
                Register
              </button>
            </div>
          </div>

          <div className="sub">
            {mode === 'login' 
              ? 'Sign in to access your Nimbus intelligence dashboard.'
              : 'Register an instant active account without email confirmation.'}
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="auth-alert error">
              <span>⚠️ {error}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-alert success">
              <span>✓ {successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Role</label>
                  <select
                    className="select"
                    style={{ width: '100%', height: 46 }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">Operator / Field Client (Role: user)</option>
                    <option value="superadmin">Administrator / Owner (Role: superadmin)</option>
                  </select>
                </div>
              </>
            )}

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'login' && (
              <div className="login-row">
                <span className="link" style={{ cursor: 'pointer' }} onClick={() => alert('Fitur reset password tersedia melalui Administrator Nimbus.')}>
                  Forgot password?
                </span>
              </div>
            )}

            <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
              {loading 
                ? 'Authenticating...' 
                : mode === 'login' ? 'Login' : 'Create & Activate Account'}
            </button>
          </form>

          {/* Quick 1-Click Credentials for Evaluators & Demo */}
          <div className="divider">quick demo access</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button
              type="button"
              className="demo-badge-btn"
              onClick={() => handleQuickLogin('operator@nimbus.earth', 'Password123!')}
              disabled={loading}
              title="Login as User Biasa / Operator"
            >
              <span className="demo-badge-role">Operator (User)</span>
              <span className="demo-badge-email">operator@nimbus.earth</span>
            </button>
            <button
              type="button"
              className="demo-badge-btn superadmin"
              onClick={() => handleQuickLogin('admin@nimbus.earth', 'Password123!')}
              disabled={loading}
              title="Login instantly with role 'superadmin'"
            >
              <span className="demo-badge-role gold">Superadmin</span>
              <span className="demo-badge-email">admin@nimbus.earth</span>
            </button>
          </div>

          <div className="divider">or</div>
          <button
            type="button"
            className="secondary"
            onClick={() => handleQuickLogin('operator@nimbus.earth', 'Password123!')}
          >
            ◉ &nbsp; Login with SSO
          </button>

          {/* Server Connection Status footer */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: backendHealth.isLive ? 'var(--green)' : 'var(--amber)'
            }} />
            <span>
              {backendHealth.isLive 
                ? 'Backend Live: Nimbus AI & Supabase Connected (localhost:8000)'
                : 'Offline Mode: Local Telemetry Simulator Ready'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
