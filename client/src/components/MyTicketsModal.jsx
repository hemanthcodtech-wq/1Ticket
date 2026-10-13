import React, { useState } from 'react';
import {
  Ticket,
  Mail,
  Phone,
  ShieldCheck,
  Search,
  ArrowRight,
  X,
  QrCode,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function MyTicketsModal({ bookings = [], onSelectPass, onClose, onRefresh }) {
  // Always require email and mobile number verification first before displaying passes
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('1ticket_customer_email') || '');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('1ticket_customer_phone') || '');
  const [isVerified, setIsVerified] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverBookings, setServerBookings] = useState([]);

  // Validate Email and Mobile Number
  const handleValidateCustomer = async (e) => {
    e.preventDefault();
    setError(null);

    const emailTrim = userEmail.trim().toLowerCase();
    const phoneTrim = userPhone.trim().replace(/[^0-9]/g, '');

    // Validation checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    if (phoneTrim.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      // Query backend for this customer's passes with strict email and phone match
      const url = getApiUrl(`/api/bookings?email=${encodeURIComponent(emailTrim)}&phone=${encodeURIComponent(phoneTrim)}`);
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setServerBookings(data.data);
        setIsVerified(true);
        localStorage.setItem('1ticket_customer_email', emailTrim);
        localStorage.setItem('1ticket_customer_phone', phoneTrim);
        if (onRefresh) onRefresh();
      } else {
        setServerBookings([]);
        setIsVerified(false);
        setError(data.error || 'Both email and mobile number must match your purchase records. No passes found.');
      }
    } catch (err) {
      console.error('Validation error:', err);
      setIsVerified(false);
      setServerBookings([]);
      setError('Unable to connect to verification server. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = () => {
    setIsVerified(false);
    setServerBookings([]);
    setError(null);
  };

  // Filter the passes (ONLY shown when isVerified is true)
  const displayedBookings = (isVerified ? serverBookings : []).filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.ticket_code && b.ticket_code.toLowerCase().includes(q)) ||
      (b.event_title && b.event_title.toLowerCase().includes(q)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090b10',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.08) 0%, rgba(9, 11, 16, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(246, 192, 66, 0.15)',
              border: '1px solid rgba(246, 192, 66, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <Ticket size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  My Passes <span className="gold-gradient-text">Wallet</span>
                </h2>
                <span style={{
                  fontSize: '0.66rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(246, 192, 66, 0.15)',
                  color: isVerified ? '#34d399' : '#f6c042',
                  border: isVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(246, 192, 66, 0.3)',
                  fontWeight: 800
                }}>
                  {isVerified ? 'VERIFIED' : 'SECURE LOOKUP'}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
                {isVerified
                  ? `Showing passes registered to ${userEmail}`
                  : 'Verify your credentials to view your authentic pass vouchers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#9ca3af',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#f6c042'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY: STEP 1 (VERIFY EMAIL & PHONE) vs STEP 2 (PASSES LIST) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {!isVerified ? (
            /* VERIFICATION FORM */
            <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f6c042',
                margin: '0 auto 16px'
              }}>
                <ShieldCheck size={28} />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 6px', fontWeight: 700 }}>
                Verify Your Registered Details
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 22px', lineHeight: 1.5 }}>
                Please provide your Email Address and Mobile Number used during pass checkout to access your scannable passes.
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '18px',
                  textAlign: 'left'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleValidateCustomer} style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                    Registered Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        background: '#151922',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        background: '#151922',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginTop: '4px' }}>
                    We'll match your purchases and load your scannable passes instantly.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{loading ? 'Validating Account...' : 'Validate & Showcase Passes'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* VERIFIED PASSES LIST */
            <div>
              {/* Account summary bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#d1d5db' }}>
                  <CheckCircle2 size={15} color="#34d399" />
                  <span>Validated as: <strong>{userEmail}</strong> ({userPhone})</span>
                </div>
                <button
                  onClick={handleResetSession}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f6c042',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Change Email / Phone
                </button>
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter passes by title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              {/* Passes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {displayedBookings.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <Ticket size={36} color="#6b7280" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                    <p style={{ fontSize: '0.96rem', color: '#ffffff', fontWeight: 600, margin: '0 0 4px' }}>
                      No passes found for this account
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
                      If you booked under a different email address, click "Change Email / Phone" above.
                    </p>
                  </div>
                ) : (
                  displayedBookings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectPass(item)}
                      style={{
                        padding: '16px',
                        background: '#0d1017',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#f6c042';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '10px',
                          background: 'rgba(246, 192, 66, 0.12)',
                          border: '1px solid rgba(246, 192, 66, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f6c042',
                          flexShrink: 0
                        }}>
                          <QrCode size={24} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', color: '#ffffff', margin: '0 0 4px', fontWeight: 700 }}>
                            {item.event_title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: '#9ca3af', flexWrap: 'wrap' }}>
                            <span>Code: <strong style={{ color: '#f6c042', fontFamily: 'monospace' }}>{item.ticket_code}</strong></span>
                            <span>•</span>
                            <span>Attendee: <strong style={{ color: '#ffffff' }}>{item.customer_name}</strong></span>
                            <span>•</span>
                            <span>{item.seat_count || 1} {(item.seat_count || 1) === 1 ? 'Pass' : 'Passes'}</span>
                            <span>•</span>
                            <span style={{
                              color: item.status === 'redeemed' ? '#f59e0b' : '#34d399',
                              fontWeight: 700
                            }}>
                              ● {item.status?.toUpperCase() || 'ACTIVE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* View Pass Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPass(item);
                        }}
                        className="btn-gold"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexShrink: 0
                        }}
                      >
                        <span>View Pass</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
