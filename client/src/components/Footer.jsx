import React from 'react';
import {
  Ticket,
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenLegal }) {
  return (
    <footer style={{
      background: '#07090e',
      borderTop: '1px solid rgba(212, 175, 55, 0.22)',
      marginTop: 'auto',
      position: 'relative'
    }}>
      {/* Top golden accent shimmer line */}
      <div style={{
        height: '2px',
        width: '100%',
        background: 'linear-gradient(90deg, transparent 0%, #f6c042 50%, transparent 100%)',
        opacity: 0.6
      }} />

      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '50px 24px 28px'
      }}>
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Column 1: Brand & Mission */}
          <div style={{ maxWidth: '320px' }}>
            <div
              onClick={() => onNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '14px'
              }}
            >
              <img
                src="/logo.png"
                alt="1ticket"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p style={{
              fontSize: '0.84rem',
              color: '#9ca3af',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              Your premier destination for verified real estate coupons, festive promotions, lifestyle draws, and high-value booking benefits.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(246, 192, 66, 0.08)',
              border: '1px solid rgba(246, 192, 66, 0.25)',
              color: '#f6c042',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={14} />
              <span>100% Verified & Encrypted</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '0.02em'
            }}>
              Explore 1ticket
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>Home Showcase</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('explore-coupons-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>Exclusive Coupons</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>How 1ticket Works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-coupons')}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>My Saved Coupons</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  style={{
                    background: 'transparent',
                    color: '#f6c042',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '2px 0',
                    fontWeight: 600,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#f6c042'}
                >
                  <ChevronRight size={13} color="#f6c042" />
                  <span>Staff & Coordinator Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust Policies */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '0.02em'
            }}>
              Trust & Policies
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'terms', name: 'Terms and Conditions' },
                { id: 'privacy', name: 'Privacy Policy' },
                { id: 'refund', name: 'Refund & Cancellation' },
                { id: 'disclaimer', name: 'Statutory Disclaimer' },
                { id: 'coupon-policy', name: 'Coupon Redemption Policy' },
                { id: 'cookie', name: 'Cookie Policy' },
                { id: 'campaign-cancel', name: 'Campaign Cancellation' },
                { id: 'shipping', name: 'Shipping & Delivery' }
              ].map((policy) => (
                <li key={policy.id}>
                  <button
                    onClick={() => onOpenLegal(policy.id)}
                    style={{
                      background: 'transparent',
                      color: '#9ca3af',
                      fontSize: '0.83rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '2px 0',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <ChevronRight size={12} color="rgba(212, 175, 55, 0.7)" />
                    <span>{policy.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '0.02em'
            }}>
              Customer Care
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '14px' }}>
              Have questions regarding offer verification or redeeming a promotional coupon?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#d1d5db' }}>
                <Mail size={15} color="#f6c042" />
                <span>support@1ticket.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#d1d5db' }}>
                <Phone size={15} color="#f6c042" />
                <span>+91 (080) 4123-8899 / 24x7</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#d1d5db' }}>
                <MapPin size={15} color="#f6c042" />
                <span>Pan India Partner Hubs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer banner */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.78rem',
          color: '#6b7280'
        }}>
          <div>
            © {new Date().getFullYear()} 1ticket. All rights reserved. Built with Neon Serverless Postgres.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              onClick={() => onOpenLegal('terms')}
              style={{ cursor: 'pointer', color: '#9ca3af' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              Terms
            </span>
            <span>•</span>
            <span
              onClick={() => onOpenLegal('privacy')}
              style={{ cursor: 'pointer', color: '#9ca3af' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              Privacy
            </span>
            <span>•</span>
            <span
              onClick={() => onOpenLegal('refund')}
              style={{ cursor: 'pointer', color: '#9ca3af' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              Refunds
            </span>
            <span>•</span>
            <span
              onClick={() => onOpenLegal('disclaimer')}
              style={{ cursor: 'pointer', color: '#9ca3af' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              Disclaimer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
