import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, Ticket, User, Mail, Phone, Calendar, MapPin, Database } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function BookingModal({ coupon, onClose, onSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!coupon) return null;

  const unitPrice = Number(coupon.price) || 999;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!customerName || !customerEmail) {
      setError('Please provide your full name and email address.');
      return;
    }
    if (!customerPhone || cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number for coupon pass verification.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(getApiUrl('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: coupon.id,
          customerName,
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: cleanPhone,
          seatCount: quantity,
          seats: [`CPN-A${Math.floor(10 + Math.random() * 89)}`],
          totalPrice
        })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('1ticket_customer_email', customerEmail.trim().toLowerCase());
        localStorage.setItem('1ticket_customer_phone', cleanPhone);
        onSuccess(data.data);
      } else {
        setError(data.error || 'Failed to claim coupon.');
      }
    } catch (err) {
      console.error('Error claiming coupon:', err);
      setError('Network error while processing coupon. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(212, 175, 55, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f6c042, #ca8a04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <Ticket size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#ffffff' }}>Claim Exclusive Coupon</h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af' }}>Verified by 1ticket Guaranteed Trust</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Coupon Mini Overview */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{
            display: 'flex',
            gap: '14px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '8px',
            padding: '12px',
            alignItems: 'center'
          }}>
            <img
              src={coupon.image_url}
              alt={coupon.title}
              style={{
                width: '84px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(185, 28, 28, 0.25)',
                border: '1px solid rgba(185, 28, 28, 0.6)',
                color: '#fca5a5',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                marginBottom: '4px'
              }}>
                {coupon.badge || 'FESTIVE SPECIAL'}
              </div>
              <h4 style={{ fontSize: '0.96rem', margin: '0 0 3px', color: '#ffffff' }}>{coupon.title}</h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>{coupon.venue || 'Pan India Offers'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'block' }}>PRICE</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f6c042' }}>
                ₹{unitPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Email Address * (For Coupon Voucher Code)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Mobile Number * (For Pass Verification)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                  Number of Coupons
                </label>
                <div style={{ display: 'flex', alignItems: 'center', height: '42px', background: '#151922', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ flex: 1, height: '100%', background: 'transparent', color: '#f6c042', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    style={{ flex: 1, height: '100%', background: 'transparent', color: '#f6c042', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div style={{
            background: 'rgba(246, 192, 66, 0.05)',
            border: '1px dashed rgba(246, 192, 66, 0.3)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#d1d5db', display: 'block' }}>Total Payable Amount</span>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Includes festive bonus & draw entry</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f6c042' }}>
              ₹{totalPrice.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '0.95rem',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing Coupon...' : `Claim Coupon for ₹${totalPrice.toLocaleString('en-IN')}`}
          </button>

          <p style={{
            margin: '12px 0 0',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} color="#34d399" />
            <span>Instant redemption code • Stored securely in Neon DB • 100% Verified</span>
          </p>
        </form>
      </div>
    </div>
  );
}
