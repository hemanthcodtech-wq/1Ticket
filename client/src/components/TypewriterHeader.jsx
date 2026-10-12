import React, { useState, useEffect } from 'react';

/**
 * TypewriterHeader: A premium, cinematic typewriter effect component for headers (h1 / h2).
 * 
 * Supports:
 * - Single text string or structured segments (with custom classes/colors e.g. gold-gradient-text).
 * - Smooth typing speed with natural cadence.
 * - Glowing gold cursor that pulses/blinks.
 * - Optional looping or type-once behavior.
 * - Prevents layout shift with min-height / inline cursor.
 */
export default function TypewriterHeader({
  text,
  segments,
  speed = 45,
  delay = 200,
  loop = false,
  pauseBeforeRestart = 3000,
  as: Tag = 'h1',
  cursor = true,
  className = '',
  style = {}
}) {
  // If segments is provided: e.g. [{ text: 'Explore Exclusive ' }, { text: 'Coupons & Passes', className: 'gold-gradient-text' }]
  // calculate full text
  const fullText = segments 
    ? segments.map(s => s.text).join('') 
    : (text || '');

  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let timeout;
    let isCancelled = false;

    setCharCount(0);

    const startTyping = () => {
      let current = 0;
      const typeNext = () => {
        if (isCancelled) return;
        if (current < fullText.length) {
          current++;
          setCharCount(current);
          timeout = setTimeout(typeNext, speed + (Math.random() * 20 - 10)); // Natural cadence
        } else if (loop) {
          timeout = setTimeout(() => {
            if (isCancelled) return;
            current = 0;
            setCharCount(0);
            timeout = setTimeout(typeNext, delay);
          }, pauseBeforeRestart);
        }
      };
      timeout = setTimeout(typeNext, delay);
    };

    startTyping();

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [fullText, speed, delay, loop, pauseBeforeRestart]);

  // Render text based on segments or simple string
  const renderContent = () => {
    if (!segments) {
      return fullText.slice(0, charCount);
    }

    let remaining = charCount;
    return segments.map((seg, idx) => {
      if (remaining <= 0) return null;
      const sliceLen = Math.min(seg.text.length, remaining);
      const displayed = seg.text.slice(0, sliceLen);
      remaining -= sliceLen;

      return (
        <span key={idx} className={seg.className || ''} style={seg.style || {}}>
          {displayed}
        </span>
      );
    });
  };

  return (
    <Tag className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {renderContent()}
      {cursor && (
        <span
          className="typewriter-cursor"
          style={{
            display: 'inline-block',
            width: '3px',
            marginLeft: '4px',
            height: '0.85em',
            verticalAlign: 'baseline',
            background: 'linear-gradient(180deg, #fde047 0%, #f6c042 100%)',
            boxShadow: '0 0 10px rgba(246, 192, 66, 0.8)',
            borderRadius: '2px',
            animation: 'typewriterBlink 0.9s infinite'
          }}
        />
      )}
    </Tag>
  );
}
