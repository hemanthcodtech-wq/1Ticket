import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  ShieldCheck,
  Menu,
  X,
  Home,
  Compass,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  bookedCount,
  adminUser
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore Offers', icon: Compass },
    { id: 'how-it-works', label: 'How It Works', icon: Layers },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'my-coupons', label: 'My Passes', icon: Ticket }
  ];

  return (
    <>
      <header
        className="navbar-fixed-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          background: scrolled ? 'rgba(5, 6, 8, 0.97)' : 'rgba(7, 8, 12, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.28)' : '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.8)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
      <div
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: scrolled ? '10px clamp(16px, 3vw, 32px)' : '14px clamp(16px, 3vw, 32px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          transition: 'padding 0.3s ease'
        }}
      >
        {/* Brand Logo with golden glow hover */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '8px'
          }}
        >
          <img
            src="/logo.png"
            alt="1ticket"
            style={{
              height: scrolled ? '32px' : '36px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(246, 192, 66, 0.25))',
              transition: 'height 0.3s ease'
            }}
          />
        </motion.div>

        {/* Desktop Navigation Links with sliding gold underline */}
        <nav
          className="navbar-desktop-nav"
          style={{
            alignItems: 'center',
            gap: '32px'
          }}
        >
          {navLinks.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? '#f6c042' : '#d1d5db',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 2px',
                  position: 'relative',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#f6c042';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#d1d5db';
                }}
              >
                <span>{item.label}</span>

                {/* Sliding Gold Underline Animation */}
                {isActive && (
                  <motion.div
                    layoutId="navbarActiveUnderline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #fde047 0%, #f6c042 50%, #ca8a04 100%)',
                      boxShadow: '0 0 10px rgba(246, 192, 66, 0.7)'
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right side: Desktop CTA / Staff Portal & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Primary Explore Offers Button on desktop */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(246, 192, 66, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('explore')}
            className="navbar-desktop-staff-btn btn-gold"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <Sparkles size={14} />
            <span>Explore Offers</span>
          </motion.button>

          {/* Desktop Staff Portal Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('admin')}
            className="navbar-desktop-staff-btn"
            style={{
              background: activeTab === 'admin'
                ? 'linear-gradient(135deg, #d4af37 0%, #f6c042 100%)'
                : 'rgba(212, 175, 55, 0.08)',
              border: activeTab === 'admin'
                ? '1px solid #f6c042'
                : '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '8px',
              color: activeTab === 'admin' ? '#060709' : '#f6c042',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <ShieldCheck size={15} color={activeTab === 'admin' ? '#060709' : '#f6c042'} />
            <span>
              {adminUser
                ? (adminUser.role === 'admin' ? 'Admin' : 'Coordinator')
                : 'Staff'}
            </span>
          </motion.button>

          {/* Mobile Hamburger Toggle Button (Animated Icon) */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-mobile-toggle"
            style={{
              background: isMobileMenuOpen ? 'rgba(246, 192, 66, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(246, 192, 66, 0.4)',
              color: '#f6c042',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu with Smooth Slide Transition */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="navbar-mobile-drawer"
            style={{
              overflow: 'hidden',
              background: 'rgba(8, 10, 15, 0.98)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)'
            }}
          >
            <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navLinks.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.25 }}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      background: isActive ? 'rgba(246, 192, 66, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(246, 192, 66, 0.35)' : '1px solid transparent',
                      borderRadius: '10px',
                      color: isActive ? '#f6c042' : '#e5e7eb',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.94rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={18} color={isActive ? '#f6c042' : '#9ca3af'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#f6c042',
                          boxShadow: '0 0 8px #f6c042'
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Staff Portal Link */}
              <div style={{ marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick('admin')}
                  style={{
                    width: '100%',
                    background: activeTab === 'admin'
                      ? 'linear-gradient(135deg, #f6c042 0%, #ca8a04 100%)'
                      : 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '10px',
                    color: activeTab === 'admin' ? '#000000' : '#f6c042',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} />
                    <span>Staff Scanner & Admin Portal</span>
                  </div>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
      {/* Spacer to prevent page content from being pushed under fixed header */}
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}
