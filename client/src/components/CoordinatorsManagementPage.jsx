import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CoordinatorsManagementPage({
  coordinators = [],
  onCreateCoordinator,
  onDeleteCoordinator,
  user
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoord, setNewCoord] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'coord123',
    role: 'coordinator'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onCreateCoordinator(newCoord);
    setSubmitting(false);
    setIsCreateModalOpen(false);
    setNewCoord({
      name: '',
      email: '',
      phone: '',
      password: 'coord123',
      role: 'coordinator'
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
            Ground Coordinators & Staff <span className="gold-gradient-text">Roster</span>
          </h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            Invite and manage authorized verification agents; welcome credentials dispatched via Nodemailer
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={16} />
            <span>Create New Coordinator</span>
          </button>
        )}
      </div>

      {/* Coordinators Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {coordinators.map((c) => (
          <div
            key={c.id}
            style={{
              background: '#0d1017',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: c.role === 'admin' ? 'rgba(246, 192, 66, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  border: c.role === 'admin' ? '1px solid #f6c042' : '1px solid #38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.role === 'admin' ? '#f6c042' : '#38bdf8',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#ffffff', fontWeight: 700 }}>
                    {c.name}
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: c.role === 'admin' ? '#f6c042' : '#38bdf8',
                    marginTop: '2px'
                  }}>
                    {c.role === 'admin' ? 'Super Administrator' : 'Ground Coordinator'}
                  </span>
                </div>
              </div>

              {user.role === 'admin' && c.role !== 'admin' && (
                <button
                  onClick={() => onDeleteCoordinator(c.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  title="Remove coordinator access"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: '#d1d5db',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={13} color="#f6c042" />
                <span>{c.email}</span>
              </div>
              {c.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={13} color="#f6c042" />
                  <span>{c.phone}</span>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#9ca3af',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '10px'
            }}>
              <span>Status: <strong style={{ color: '#10b981' }}>Active / Verified</strong></span>
              <span>Joined: {new Date(c.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coordinator Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#ffffff', fontWeight: 700 }}>
                  Invite New Coordinator
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  Sends login credentials via Nodemailer transporter
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'transparent', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCoord.name}
                  onChange={(e) => setNewCoord({ ...newCoord, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.coord@1ticket.com"
                  value={newCoord.email}
                  onChange={(e) => setNewCoord({ ...newCoord, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={newCoord.phone}
                  onChange={(e) => setNewCoord({ ...newCoord, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Initial Password *
                </label>
                <input
                  type="text"
                  required
                  value={newCoord.password}
                  onChange={(e) => setNewCoord({ ...newCoord, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Assigned Role
                </label>
                <select
                  value={newCoord.role}
                  onChange={(e) => setNewCoord({ ...newCoord, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="coordinator">Ground Coordinator (Scanner & Pass Lookup)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-gold-outline"
                  style={{ padding: '9px 18px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold"
                  style={{
                    padding: '9px 24px',
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: submitting ? 0.75 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 4px 14px rgba(246, 192, 66, 0.25)'
                  }}
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  <span>{submitting ? 'Registering Coordinator...' : 'Dispatch Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
