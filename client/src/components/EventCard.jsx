import React from 'react';
import { Ticket, ArrowRight, Info, Sparkles, Building, MapPin, Car, Home, Palette } from 'lucide-react';

export default function EventCard({ coupon, onSelectOffer, onSelectDetails }) {
  // Select matching category icon
  const renderIcon = () => {
    switch (coupon.id) {
      case 'coupon-1':
        return <Ticket size={18} color="#f6c042" />;
      case 'coupon-2':
        return <MapPin size={18} color="#f6c042" />;
      case 'coupon-3':
        return <Car size={18} color="#f6c042" />;
      case 'coupon-4':
        return <Home size={18} color="#f6c042" />;
      case 'coupon-5':
        return <Palette size={18} color="#f6c042" />;
      default:
        return <Ticket size={18} color="#f6c042" />;
    }
  };

  return (
    <div className="coupon-card">
      {/* Ribbon badge matching reference */}
      {coupon.badge && (
        <div className="ribbon-badge">
          <Sparkles size={11} />
          <span>{coupon.badge}</span>
        </div>
      )}

      {/* Image Container with 4:3 Aspect */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '68%',
        overflow: 'hidden',
        background: '#151922'
      }}>
        <img
          src={coupon.image_url}
          alt={coupon.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="coupon-thumb"
        />
        {/* Subtle dark gradient overlay at bottom of image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13, 15, 21, 0.7) 0%, transparent 40%)'
        }} />
      </div>

      {/* Content Body */}
      <div style={{
        padding: '16px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Header row with icon & title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              marginTop: '2px',
              padding: '4px',
              background: 'rgba(246, 192, 66, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {renderIcon()}
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              lineHeight: 1.3,
              color: '#ffffff',
              margin: 0
            }}>
              {coupon.title}
            </h3>
          </div>

          {/* Subtitle / Description sentence */}
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            minHeight: '34px',
            margin: '0 0 10px'
          }}>
            {coupon.subtitle || coupon.description}
          </p>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {/* Unified Action Row: Price on Left, View Offer Button on Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: 'rgba(18, 22, 32, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            margin: '8px 0 10px'
          }}>
            {/* Price Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Ticket size={12} color="#f6c042" />
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#9ca3af',
                  textTransform: 'uppercase'
                }}>
                  COUPON PRICE
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.18rem',
                fontWeight: 800,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'baseline',
                gap: '3px',
                lineHeight: 1.2,
                marginTop: '2px'
              }}>
                <span style={{ color: '#f6c042', fontSize: '0.95rem' }}>₹</span>
                <span>{coupon.price ? coupon.price.toLocaleString('en-IN') : '- - -'}</span>
              </div>
            </div>

            {/* View Offer Button */}
            <button
              onClick={() => onSelectOffer(coupon)}
              className="btn-gold"
              style={{
                padding: '9px 18px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(246, 192, 66, 0.25)'
              }}
            >
              <span>View Offer</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* View Coupon Details link */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onSelectDetails(coupon)}
              style={{
                background: 'transparent',
                color: '#9ca3af',
                fontSize: '0.73rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 4px',
                transition: 'color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f6c042'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <Info size={12} />
              <span>View Coupon Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
