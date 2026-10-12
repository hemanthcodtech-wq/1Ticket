import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Terminal, ExternalLink } from 'lucide-react';

export default function NeonInfoModal({ dbStatus, onClose, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const envSample = `DATABASE_URL=postgresql://neondb_owner:npg_xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d1222',
          padding: '28px',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: dbStatus?.isNeon ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: dbStatus?.isNeon ? '#34d399' : '#fbbf24'
          }}>
            <Database size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Neon Serverless Postgres</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`badge ${dbStatus?.isNeon ? 'badge-live' : 'badge-warning'}`}>
                {dbStatus?.isNeon ? 'Connected & Live' : 'Demo Mode (Mock)'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Driver: @neondatabase/serverless
              </span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
          {dbStatus?.message}
        </p>

        {/* Status card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="#06b6d4" />
            <span>How to connect your Neon Project:</span>
          </h4>
          <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <li>Go to <a href="https://console.neon.tech" target="_blank" rel="noreferrer" style={{ color: '#06b6d4', textDecoration: 'underline' }}>console.neon.tech</a> and create a free PostgreSQL database.</li>
            <li>Copy the <strong>Connection string</strong> from your Neon Dashboard.</li>
            <li>Paste it inside <code>server/.env</code> file as <code>DATABASE_URL</code>:</li>
          </ol>

          {/* Code block */}
          <div style={{
            marginTop: '12px',
            background: '#070a12',
            borderRadius: '8px',
            padding: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <code style={{ fontSize: '0.78rem', color: '#a5b4fc', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {envSample}
            </code>
            <button
              onClick={handleCopy}
              title="Copy snippet"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem'
              }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Database Tables preview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>
            Auto-Migrated Tables in Neon:
          </h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              public.events
            </span>
            <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              public.bookings
            </span>
          </div>
        </div>

        {/* Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePing}
            disabled={isRefreshing}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Checking...' : 'Check Connection'}</span>
          </button>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
