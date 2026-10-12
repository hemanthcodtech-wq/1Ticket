import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LuxuryCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch devices or mobile viewports
    const checkTouch = () => {
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        window.innerWidth <= 768;
      setIsTouch(isTouchDevice);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return;
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element
      const target = e.target;
      if (target) {
        const interactive = target.closest('button, a, input, select, [role="button"], .coupon-card, .clickable');
        setIsPointer(!!interactive);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Small crisp gold dot */}
      <motion.div
        className="luxury-cursor-element"
        animate={{
          x: mousePosition.x - (isPointer ? 6 : 4),
          y: mousePosition.y - (isPointer ? 6 : 4),
          scale: isPointer ? 1.6 : 1,
          backgroundColor: isPointer ? '#fde047' : '#f6c042'
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 450, mass: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isPointer ? '12px' : '8px',
          height: isPointer ? '12px' : '8px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          boxShadow: '0 0 12px rgba(246, 192, 66, 0.8)'
        }}
      />

      {/* Trailing soft gold ring glow */}
      <motion.div
        className="luxury-cursor-element"
        animate={{
          x: mousePosition.x - (isPointer ? 22 : 16),
          y: mousePosition.y - (isPointer ? 22 : 16),
          scale: isPointer ? 1.35 : 1,
          opacity: isPointer ? 0.75 : 0.4
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 220, mass: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isPointer ? '44px' : '32px',
          height: isPointer ? '44px' : '32px',
          borderRadius: '50%',
          border: '1px solid rgba(246, 192, 66, 0.65)',
          background: 'radial-gradient(circle, rgba(246, 192, 66, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99997
        }}
      />
    </>
  );
}
