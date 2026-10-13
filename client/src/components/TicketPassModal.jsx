import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Ticket,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  FileText
} from 'lucide-react';

export default function TicketPassModal({ booking, onClose, onOpenTerms }) {
  if (!booking) return null;

  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // High-Resolution Image Download
  const handleSaveCouponImage = async () => {
    if (!cardRef.current) return;

    try {
      setDownloading(true);

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2.5,
        backgroundColor: '#0d1017',
        cacheBust: true,
        style: {
          margin: '0',
          boxShadow: 'none'
        }
      });

      const cleanCode = (booking.ticket_code || '1TKT-PASS').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `1ticket-${cleanCode}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export coupon image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.08) 0%, rgba(13, 16, 23, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#22c55e" />
            <h2 style={{ fontSize: '1.18rem', margin: 0, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
              Verified Pass
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '4px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px' }}>
          {/* Golden Physical-style Voucher Pass */}
          <div
            ref={cardRef}
            style={{
              background: 'linear-gradient(145deg, #12151f 0%, #080a0f 100%)',
              border: '2px solid #f6c042',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(246, 192, 66, 0.2)'
            }}
          >
            {/* Top gold header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fde047 0%, #f6c042 50%, #ca8a04 100%)',
                color: '#000000',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={18} />
                <span style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>
                  1ticket
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    background: '#000',
                    color: '#f6c042',
                    borderRadius: '4px'
                  }}
                >
                  OFFICIAL PASS
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                {booking.badge || 'FESTIVE PRIVILEGE'}
              </span>
            </div>

            {/* Pass Hero Image if available (Auto-adjusted to voucher card) */}
            {booking.image_url && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '140px',
                  overflow: 'hidden',
                  background: '#090b10'
                }}
              >
                <img
                  src={booking.image_url}
                  alt={booking.event_title || 'Pass Preview'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #12151f 0%, rgba(18, 21, 31, 0.4) 60%, transparent 100%)'
                  }}
                />
              </div>
            )}

            {/* Voucher Body */}
            <div style={{ padding: '18px 18px 16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '0 0 6px', lineHeight: 1.25, fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
                {booking.event_title || 'Exclusive Pass Offer'}
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#9ca3af' }}>
                Present this certified QR voucher at the partner venue or customer registration desk.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.64rem', color: '#9ca3af', display: 'block', textTransform: 'uppercase' }}>HOLDER</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                    {booking.customer_name || 'Valued Guest'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.64rem', color: '#9ca3af', display: 'block', textTransform: 'uppercase' }}>TOTAL VALUE</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#f6c042' }}>
                    ₹{Number(booking.total_price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.64rem', color: '#9ca3af', display: 'block', textTransform: 'uppercase' }}>VALIDITY</span>
                  <span style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                    {booking.validity_text || 'Active / Seasonal'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.64rem', color: '#9ca3af', display: 'block', textTransform: 'uppercase' }}>STATUS</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22c55e' }}>
                    ● CERTIFIED ACTIVE
                  </span>
                </div>
              </div>

              {/* Perforation Divider with Semicircular Notches */}
              <div
                style={{
                  borderBottom: '2px dashed rgba(212, 175, 55, 0.45)',
                  margin: '16px 0',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-28px',
                    top: '-10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#0d1017',
                    border: '1px solid rgba(212, 175, 55, 0.45)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '-28px',
                    top: '-10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#0d1017',
                    border: '1px solid rgba(212, 175, 55, 0.45)'
                  }}
                />
              </div>

              {/* QR and Unique Voucher Code with Gold Shimmer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '6px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.64rem', color: '#9ca3af', display: 'block', textTransform: 'uppercase' }}>PASS SERIAL CODE</span>
                  <span
                    style={{
                      fontSize: '1.18rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: '#f6c042',
                      letterSpacing: '0.08em',
                      display: 'block',
                      marginTop: '2px'
                    }}
                  >
                    {booking.ticket_code || '1TKT-PASS'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#6b7280', display: 'block', marginTop: '2px' }}>
                    Scannable via Ground Coordinator Portal
                  </span>
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(246, 192, 66, 0.3)'
                  }}
                >
                  <QRCodeSVG
                    value={booking.ticket_code || ''}
                    size={76}
                    level="M"
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Download Success Notice */}
          {downloadSuccess && (
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: '#34d399',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <Check size={16} />
              <span>Pass PNG image downloaded successfully!</span>
            </div>
          )}

          {/* Action buttons (Download Coupon, View Offer Terms, Close) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveCouponImage}
                disabled={downloading}
                className="btn-gold"
                style={{
                  flex: 1.2,
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: downloading ? 'wait' : 'pointer'
                }}
              >
                <Download size={16} />
                <span>{downloading ? 'Exporting...' : downloadSuccess ? 'Downloaded!' : 'Download Pass'}</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenTerms) {
                    onOpenTerms();
                  } else {
                    setShowTermsModal(true);
                  }
                }}
                className="btn-gold-outline"
                style={{
                  flex: 1,
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '8px',
                  fontSize: '0.84rem'
                }}
              >
                <FileText size={15} />
                <span>View Offer Terms</span>
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '0.82rem',
                padding: '6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              Close Window
            </button>
          </div>

          {/* Modal Inline Terms fallback */}
          {showTermsModal && (
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                background: '#121622',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                fontSize: '0.78rem',
                color: '#d1d5db',
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: '#f6c042', display: 'block', marginBottom: '4px' }}>
                Official Offer Terms & Redemption Guidelines:
              </strong>
              1. This pass must be presented at venue registration or booking desk with valid government ID.<br />
              2. Pass is valid until the stated campaign expiry date and is non-transferable unless authorized.<br />
              3. Payments processed via secure Razorpay checkout; verified pass codes are authenticated against 1ticket records.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
