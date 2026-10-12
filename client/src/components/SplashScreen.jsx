import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    // Stage 1: Reveal logo & draw gold border
    const t1 = setTimeout(() => {
      setStage('shimmer');
    }, 1100);

    // Stage 2: Light sweep & tagline
    const t2 = setTimeout(() => {
      setStage('exit');
    }, 1900);

    // Stage 3: Complete splash screen and reveal home
    const t3 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Generate floating gold particles
  const particles = [
    { x: -70, y: -45, size: 4, delay: 0.1 },
    { x: 80, y: -60, size: 3, delay: 0.3 },
    { x: -95, y: 30, size: 5, delay: 0.2 },
    { x: 90, y: 40, size: 3, delay: 0.4 },
    { x: -40, y: -80, size: 2.5, delay: 0.5 },
    { x: 45, y: -75, size: 4, delay: 0.2 },
    { x: 0, y: 70, size: 3, delay: 0.35 }
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#040507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: stage === 'exit' ? 'none' : 'auto'
      }}
    >
      {/* Golden Radial Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.85, 0.6], scale: [0.6, 1.2, 1] }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(246, 192, 66, 0.22) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Gold Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.9, 0],
            y: [-15, -45],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{
            duration: 1.8,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.2
          }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde047, #f6c042)',
            boxShadow: '0 0 10px #f6c042',
            transform: `translate(${p.x}px, ${p.y}px)`,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Center Logo Box with animated gold frame */}
      <div style={{ position: 'relative', padding: '24px 38px', textAlign: 'center' }}>
        {/* Animated Metallic Gold Border SVG */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <motion.rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="12"
            fill="none"
            stroke="url(#splashGoldGradient)"
            strokeWidth="1.8"
            strokeDasharray="400"
            strokeDashoffset="400"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="splashGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f6c042" />
              <stop offset="100%" stopColor="#b48316" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo with smooth opacity fade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative' }}
        >
          <img
            src="/logo.png"
            alt="1ticket"
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 18px rgba(246, 192, 66, 0.4))'
            }}
          />

          {/* Golden Light Sweep Beam across the logo */}
          <motion.div
            initial={{ left: '-100%', opacity: 0 }}
            animate={{ left: '200%', opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.1, delay: 0.9, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '50px',
              background: 'linear-gradient(90deg, transparent, rgba(253, 224, 71, 0.65), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </div>

      {/* Brand Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        style={{
          marginTop: '22px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.08rem',
            letterSpacing: '0.12em',
            color: '#f6c042',
            textTransform: 'uppercase',
            fontWeight: 700,
            textShadow: '0 2px 14px rgba(246, 192, 66, 0.35)',
            display: 'block'
          }}
        >
          One Ticket. Endless Possibilities.
        </span>

        <span
          style={{
            display: 'block',
            fontSize: '0.72rem',
            letterSpacing: '0.24em',
            color: '#9ca3af',
            textTransform: 'uppercase',
            marginTop: '6px',
            fontWeight: 600
          }}
        >
          EXCLUSIVE COUPONS & OFFERS PLATFORM
        </span>
      </motion.div>
    </motion.div>
  );
}
