import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Ticket,
  Loader2
} from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess, onBackToHome }) {
  const [email, setEmail] = useState('admin@1ticket.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'coordinator'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickFill = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@1ticket.com');
      setPassword('admin123');
    } else {
      setEmail('coordinator@1ticket.com');
      setPassword('coord123');
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        // Save token and user in localStorage
        localStorage.setItem('1ticket_token', data.token);
        localStorage.setItem('1ticket_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to authentication server. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '82vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(246, 192, 66, 0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#0d1017',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(246, 192, 66, 0.12)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Brand & Badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <img
              src="/logo.png"
              alt="1ticket"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(246, 192, 66, 0.1)',
            border: '1px solid rgba(246, 192, 66, 0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            color: '#f6c042',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 auto 10px'
          }}>
            <Lock size={12} />
            <span>Staff Portal • JWT Secured</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            color: '#ffffff',
            margin: '0 0 6px'
          }}>
            Internal <span className="gold-gradient-text">Sign In</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.84rem', margin: 0 }}>
            Authorized portal for Administrators and Ground Coordinators
          </p>
        </div>

        {/* Quick Demo Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '22px'
        }}>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            style={{
              padding: '8px 12px',
              borderRadius: '7px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: selectedRole === 'admin' ? '#f6c042' : 'transparent',
              color: selectedRole === 'admin' ? '#000000' : '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={14} />
            <span>Administrator</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('coordinator')}
            style={{
              padding: '8px 12px',
              borderRadius: '7px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: selectedRole === 'coordinator' ? '#f6c042' : 'transparent',
              color: selectedRole === 'coordinator' ? '#000000' : '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={14} />
            <span>Coordinator</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.82rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
              Authorized Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  background: '#141824',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>
                Secure Password
              </label>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                Demo: {selectedRole === 'admin' ? 'admin123' : 'coord123'}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 40px',
                  background: '#141824',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.88rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  color: '#9ca3af',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.92rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.75 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(246, 192, 66, 0.25)'
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>
              {loading
                ? 'Authenticating with JWT...'
                : `Sign In as ${selectedRole === 'admin' ? 'Administrator' : 'Coordinator'}`}
            </span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Back to main site */}
        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            ← Return to Public Homepage
          </button>
        </div>
      </motion.div>
    </div>
  );
}
