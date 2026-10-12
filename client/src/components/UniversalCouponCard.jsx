import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Ticket, ArrowRight, Sparkles, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function UniversalCouponCard({
  coupon,
  onSelectOffer,
  onSelectDetails,
  theme = 'black' // 'black' or 'ivory'
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const isBlack = theme !== 'ivory';
  const cardBg = isBlack
    ? 'linear-gradient(135deg, #10131a 0%, #08090d 100%)'
    : 'linear-gradient(135deg, #fdfbf7 0%, #f4ede2 100%)';
  const textColor = isBlack ? '#ffffff' : '#111827';
  const subtextColor = isBlack ? '#9ca3af' : '#6b7280';
  const perforationBg = '#060709'; // Matches parent app background

  // Coupon ID generation or formatting
  const couponCode = coupon?.ticket_code || coupon?.id ? `1TKT-${(coupon?.id || 'PASS').toUpperCase()}` : '1TKT-PASS';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className="universal-coupon-wrapper"
    >
      <div
        className="universal-coupon-container"
        style={{
          position: 'relative',
          background: cardBg,
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isHovered
            ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(246, 192, 66, 0.3)'
            : '0 12px 35px rgba(0, 0, 0, 0.65), 0 0 15px rgba(212, 175, 55, 0.1)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Metallic Gold Light Sweep on Hover */}
        <motion.div
          animate={isHovered ? { left: '160%' } : { left: '-100%' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '60px',
            background: 'linear-gradient(90deg, transparent, rgba(253, 224, 71, 0.3), transparent)',
            transform: 'skewX(-25deg)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />

        {/* Top Header Ticket Bar */}
        <div
          style={{
            padding: '12px 18px',
            background: isBlack
              ? 'linear-gradient(90deg, rgba(246, 192, 66, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)'
              : 'linear-gradient(90deg, rgba(212, 175, 55, 0.22) 0%, rgba(246, 192, 66, 0.08) 100%)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #f6c042, #b48316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                boxShadow: '0 2px 8px rgba(246, 192, 66, 0.4)'
              }}
            >
              <Ticket size={15} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: isBlack ? '#f6c042' : '#926105',
                letterSpacing: '0.04em'
              }}
            >
              1ticket
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(246, 192, 66, 0.18)',
                color: '#f6c042',
                border: '1px solid rgba(246, 192, 66, 0.3)',
                letterSpacing: '0.06em'
              }}
            >
              EXCLUSIVE
            </span>
          </div>

          {coupon?.badge && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.66rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#fde68a',
                background: 'linear-gradient(135deg, #991b1b, #7f1d1d)',
                padding: '3px 9px',
                borderRadius: '20px',
                border: '1px solid rgba(254, 202, 202, 0.3)'
              }}
            >
              <Sparkles size={11} />
              <span>{coupon.badge}</span>
            </div>
          )}
        </div>

        {/* Thumbnail Image (16:9) */}
        {coupon?.image_url && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '50%',
              overflow: 'hidden',
              background: '#090a0f'
            }}
          >
            <img
              src={coupon.image_url}
              alt={coupon.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.4s ease'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isBlack
                  ? 'linear-gradient(to top, rgba(16, 19, 26, 0.92) 0%, transparent 60%)'
                  : 'linear-gradient(to top, rgba(244, 237, 226, 0.88) 0%, transparent 60%)'
              }}
            />
            {coupon?.category && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '16px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#f6c042',
                  background: 'rgba(0, 0, 0, 0.75)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {coupon.category}
              </span>
            )}
          </div>
        )}

        {/* Coupon Main Details */}
        <div style={{ padding: '16px 18px 12px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.18rem',
              fontWeight: 800,
              color: textColor,
              lineHeight: 1.25,
              marginBottom: '6px'
            }}
          >
            {coupon?.title}
          </h3>

          <p
            style={{
              fontSize: '0.8rem',
              color: subtextColor,
              lineHeight: 1.45,
              margin: '0 0 14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {coupon?.description || 'Exclusive promotional privilege authenticated and scannable via QR verification.'}
          </p>

          {/* Key Ticket Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: isBlack ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(212, 175, 55, 0.18)',
              fontSize: '0.74rem'
            }}
          >
            <div>
              <span style={{ color: subtextColor, display: 'block', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                VALIDITY
              </span>
              <span style={{ color: textColor, fontWeight: 600 }}>
                {coupon?.validity_text || 'Festive Season 2026'}
              </span>
            </div>
            <div>
              <span style={{ color: subtextColor, display: 'block', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                AUTHENTICATION
              </span>
              <span style={{ color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={11} />
                <span>Verified QR</span>
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Semicircular Ticket Divider */}
        <div
          style={{
            position: 'relative',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Left Notch */}
          <div
            style={{
              position: 'absolute',
              left: '-12px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: perforationBg,
              border: '1.5px solid rgba(212, 175, 55, 0.45)',
              boxShadow: 'inset -3px 0 6px rgba(0, 0, 0, 0.6)'
            }}
          />

          {/* Dotted Perforation Line */}
          <div
            style={{
              width: 'calc(100% - 36px)',
              borderBottom: '2px dashed rgba(212, 175, 55, 0.35)'
            }}
          />

          {/* Right Notch */}
          <div
            style={{
              position: 'absolute',
              right: '-12px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: perforationBg,
              border: '1.5px solid rgba(212, 175, 55, 0.45)',
              boxShadow: 'inset 3px 0 6px rgba(0, 0, 0, 0.6)'
            }}
          />
        </div>

        {/* Bottom Ticket Stub (Price, Code & Actions) */}
        <div style={{ padding: '12px 18px 16px', marginTop: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: subtextColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block'
                }}
              >
                COUPON PRICE
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: isBlack ? '#ffffff' : '#000000',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '2px'
                }}
              >
                <span style={{ color: '#f6c042', fontSize: '0.98rem' }}>₹</span>
                <span>{coupon?.price ? Number(coupon.price).toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectOffer?.(coupon)}
                className="btn-gold"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(246, 192, 66, 0.3)'
                }}
              >
                <span>View Offer</span>
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>

          {/* Ticket ID & View Details Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.7rem'
            }}
          >
            <span style={{ fontFamily: 'monospace', color: '#f6c042', letterSpacing: '0.06em' }}>
              {couponCode}
            </span>
            <button
              onClick={() => onSelectDetails?.(coupon)}
              style={{
                background: 'transparent',
                border: 'none',
                color: subtextColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f6c042')}
              onMouseLeave={(e) => (e.currentTarget.style.color = subtextColor)}
            >
              <span>View Coupon Details</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
