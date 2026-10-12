import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import UniversalCouponCard from './components/UniversalCouponCard';
import SplashScreen from './components/SplashScreen';
import LuxuryCursor from './components/LuxuryCursor';
import BookingModal from './components/BookingModal';
import TicketPassModal from './components/TicketPassModal';
import MyTicketsModal from './components/MyTicketsModal';
import NeonInfoModal from './components/NeonInfoModal';
import HowItWorksPage from './components/HowItWorksPage';
import FAQPage from './components/FAQPage';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import CouponDetailPage from './components/CouponDetailPage';
import ExploreCouponsPage from './components/ExploreCouponsPage';
import TypewriterHeader from './components/TypewriterHeader';
import { getApiUrl } from './config/api';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Headphones,
  Sparkles,
  Ticket,
  Home,
  Info,
  ChevronDown,
  Star,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  // Derive initial tab from URL hash (e.g. #admin, #faq, #how-it-works, #explore, #coupon-detail) or localStorage
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash.startsWith('coupon/')) {
      return 'coupon-detail';
    }
    if (['home', 'explore', 'how-it-works', 'faq', 'admin', 'my-coupons', 'coupon-detail'].includes(hash)) {
      return hash;
    }
    const saved = localStorage.getItem('1ticket_active_tab');
    if (saved && ['home', 'explore', 'how-it-works', 'faq', 'admin', 'my-coupons', 'coupon-detail'].includes(saved)) {
      return saved;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [detailCoupon, setDetailCoupon] = useState(null);
  const [openHomeFaqs, setOpenHomeFaqs] = useState({ 0: true, 1: true });

  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash animation on first visit in the session
    const seen = sessionStorage.getItem('1ticket_splash_seen');
    return !seen;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('1ticket_splash_seen', 'true');
    setShowSplash(false);
  };

  const toggleHomeFaq = (index) => {
    setOpenHomeFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('1ticket_active_tab', tab);
    if (window.location.hash !== `#${tab}`) {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  // Sync tab with browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash.startsWith('coupon/')) {
        const cpnId = hash.replace('coupon/', '');
        const matched = coupons.find(c => c.id === cpnId);
        if (matched) {
          setDetailCoupon(matched);
        }
        setActiveTabState('coupon-detail');
        localStorage.setItem('1ticket_active_tab', 'coupon-detail');
        return;
      }
      if (['home', 'explore', 'how-it-works', 'faq', 'admin', 'my-coupons', 'coupon-detail'].includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem('1ticket_active_tab', hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // Ensure initial URL hash matches activeTab
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab, coupons]);

  // Staff/Admin Auth state
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('1ticket_user') || 'null');
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('1ticket_token') || null;
  });

  // Search & Filter state matching hero bar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedOfferType, setSelectedOfferType] = useState('All Offer Types');

  const [dbStatus, setDbStatus] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Modals
  const [selectedCouponForOffer, setSelectedCouponForOffer] = useState(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState(null);
  const [activeTicketPass, setActiveTicketPass] = useState(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [isNeonModalOpen, setIsNeonModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activeLegalPolicy, setActiveLegalPolicy] = useState(null);

  // Fetch initial data
  const fetchDbStatus = async () => {
    try {
      const res = await fetch(getApiUrl('/api/health'));
      const data = await res.json();
      setDbStatus(data.database);
    } catch (err) {
      console.warn('API health check error:', err);
      setDbStatus({ isNeon: false, mode: 'demo', message: 'API connection pending or offline' });
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/events'));
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
        const hash = window.location.hash.replace('#', '').trim();
        if (hash.startsWith('coupon/')) {
          const cpnId = hash.replace('coupon/', '');
          const matched = data.data.find(c => c.id === cpnId);
          if (matched) {
            setDetailCoupon(matched);
            setActiveTabState('coupon-detail');
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(getApiUrl('/api/bookings'));
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    fetchCoupons();
    fetchBookings();
  }, []);

  // Filter coupons based on search and dropdowns
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      (c.category && c.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesOfferType =
      selectedOfferType === 'All Offer Types' ||
      (c.offer_type && c.offer_type.toLowerCase().includes(selectedOfferType.toLowerCase()));

    return matchesSearch && matchesCategory && matchesOfferType;
  });

  const handleBookingSuccess = (newBooking) => {
    setSelectedCouponForOffer(null);
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTicketPass(newBooking);
    fetchCoupons();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#060709' }}>
      {/* Luxury Gold Desktop Cursor Accent */}
      <LuxuryCursor />

      {/* Cinematic Splash Animation on First Visit */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Navbar matching reference (Hidden inside Admin & Coordinator Dashboard) */}
      {!(activeTab === 'admin' && adminUser && adminToken) && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'my-coupons') setIsMyTicketsOpen(true);
          }}
          bookedCount={bookings.length}
          adminUser={adminUser}
        />
      )}

      {/* Tab Switcher: Admin Portal vs How It Works Page vs FAQ Page vs Home Page */}
      {activeTab === 'admin' ? (
        adminUser && adminToken ? (
          <AdminDashboard
            user={adminUser}
            token={adminToken}
            onLogout={() => {
              localStorage.removeItem('1ticket_token');
              localStorage.removeItem('1ticket_user');
              setAdminUser(null);
              setAdminToken(null);
              setActiveTab('home');
            }}
            onReturnHome={() => setActiveTab('home')}
          />
        ) : (
          <AdminLoginPage
            onLoginSuccess={(user, token) => {
              setAdminUser(user);
              setAdminToken(token);
            }}
            onBackToHome={() => setActiveTab('home')}
          />
        )
      ) : activeTab === 'how-it-works' ? (
        <HowItWorksPage
          onExploreCoupons={() => {
            setActiveTab('home');
            setTimeout(() => {
              const el = document.getElementById('explore-coupons-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
        />
      ) : activeTab === 'faq' ? (
        <FAQPage />
      ) : activeTab === 'explore' ? (
        <ExploreCouponsPage
          coupons={coupons}
          loading={loading}
          onSelectCoupon={(cpn) => {
            setDetailCoupon(cpn);
            setActiveTab('coupon-detail');
            window.history.pushState(null, '', `#coupon/${cpn.id}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : activeTab === 'coupon-detail' ? (
        <CouponDetailPage
          coupon={detailCoupon || coupons[0]}
          onBack={() => {
            setActiveTab('explore');
            window.history.pushState(null, '', '#explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBookingSuccess={(booking) => {
            fetchBookings();
            setActiveTicketPass(booking);
          }}
        />
      ) : (
        <>
          {/* Main Hero Banner matching exact reference */}
          <section style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '30px 24px 20px'
      }}>
        {/* Hero Card Container */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }}>
          {/* Background Hero Villa Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}>
            <img
              src="/coupons/hero_villa.jpg"
              alt="Luxury Villa"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 40%'
              }}
            />
            {/* Dark gradient overlay for text readability on left, festive banner on right */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(6, 7, 9, 0.94) 0%, rgba(6, 7, 9, 0.85) 38%, rgba(6, 7, 9, 0.45) 65%, rgba(136, 19, 55, 0.3) 100%)'
            }} />
          </div>

          {/* Festive Durga & Hanging Diya Artwork on Right */}
          <div
            className="hero-festive-badge-container"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '420px',
              zIndex: 2,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: '24px 30px'
            }}
          >
            {/* Festive Golden Goddess/Diya Badge */}
            <div style={{
              background: 'linear-gradient(135deg, #991b1b 0%, #4c0519 100%)',
              border: '2px solid #f6c042',
              borderRadius: '12px',
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(246, 192, 66, 0.3)'
            }}>
              {/* Eye & Bindi symbol */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
                  <path d="M22 2C22 2 12 12 2 12C12 12 22 22 22 22C22 22 32 12 42 12C32 12 22 2 22 2Z" fill="#F6C042" fillOpacity="0.2" stroke="#F6C042" strokeWidth="1.5"/>
                  <circle cx="22" cy="12" r="4" fill="#F6C042"/>
                  <circle cx="22" cy="4" r="2" fill="#EF4444"/>
                </svg>
              </div>
              <span style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.06em',
                display: 'block'
              }}>
                DURGASHTAMI
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fde68a',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                SPECIAL OFFERS
              </span>
            </div>

            {/* Golden 1ticket Universal Coupon Floating Graphic with Light Sweep */}
            <motion.div
              className="hero-floating-ticket"
              animate={{
                y: [0, -12, 0],
                rotate: [-4, -2, -4]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              style={{
                marginTop: '36px',
                marginRight: '24px',
                background: 'linear-gradient(135deg, #161922 0%, #0d0f17 100%)',
                padding: '20px 24px',
                borderRadius: '14px',
                border: '1.8px solid #f6c042',
                color: '#ffffff',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 30px rgba(246, 192, 66, 0.35)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                width: '320px',
                cursor: 'pointer'
              }}
              onClick={() => {
                const el = document.getElementById('explore-coupons-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Metallic Gold Light Sweep across the coupon */}
              <motion.div
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '60px',
                  background: 'linear-gradient(90deg, transparent, rgba(253, 224, 71, 0.35), transparent)',
                  transform: 'skewX(-25deg)',
                  pointerEvents: 'none'
                }}
              />

              {/* Perforated Semicircle Notches */}
              <div
                style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#060709',
                  border: '1.5px solid #f6c042'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#060709',
                  border: '1.5px solid #f6c042'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ticket size={16} color="#f6c042" />
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '0.95rem', color: '#f6c042' }}>
                    1ticket PASS
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', background: 'rgba(246, 192, 66, 0.15)', color: '#f6c042', borderRadius: '4px', border: '1px solid rgba(246, 192, 66, 0.3)' }}>
                  AUTHENTIC
                </span>
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                Universal Promotional Pass
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginBottom: '14px' }}>
                Verified Admission & Instant QR Benefits
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed rgba(212, 175, 55, 0.35)', paddingTop: '10px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#f6c042', fontWeight: 700 }}>
                  1TKT-UNIVERSAL
                </span>
                <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                  ● Tap to Explore
                </span>
              </div>
            </motion.div>
          </div>

          {/* Left Text Content */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            padding: 'clamp(24px, 5vw, 50px) clamp(16px, 4vw, 48px) 20px',
            maxWidth: '680px'
          }}>
            {/* Mobile Festive Badge: shown cleanly above text on small screens */}
            <div className="hero-mobile-festive-badge">
              <Sparkles size={14} color="#f6c042" />
              <span>DURGASHTAMI FESTIVE SPECIAL</span>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: 'clamp(0.7rem, 2.2vw, 0.78rem)',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#f6c042',
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <span>PREMIUM OFFERS</span>
              <span>•</span>
              <span>REAL VALUE</span>
              <span>•</span>
              <span>LIMITED TIME</span>
            </motion.div>

            {/* Main Headline with Typewriter Animation */}
            <TypewriterHeader
              as="h1"
              segments={[
                { text: 'One Ticket. ' },
                { text: 'Endless Possibilities.', className: 'gold-gradient-text' }
              ]}
              speed={48}
              delay={350}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 5.8vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '14px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              style={{
                fontSize: 'clamp(0.95rem, 2.6vw, 1.15rem)',
                color: '#d1d5db',
                lineHeight: 1.55,
                marginBottom: '26px',
                maxWidth: '580px'
              }}
            >
              Discover exclusive coupons, exciting offers, and extraordinary experiences.
            </motion.p>

            {/* Prominent Explore Offers CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(246, 192, 66, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('explore-coupons-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold"
                style={{
                  padding: '13px 28px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>Explore Offers</span>
                <ArrowRight size={17} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('how-it-works')}
                className="btn-gold-outline"
                style={{
                  padding: '13px 22px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Ticket size={16} />
                <span>How It Works</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Search & Filter Bar at Bottom of Hero */}
          <div
            className="hero-search-container"
            style={{
              position: 'relative',
              zIndex: 4,
              padding: '0 clamp(16px, 4vw, 48px) clamp(24px, 4vw, 40px)'
            }}
          >
            <div
              className="hero-search-bar"
              style={{
                background: 'rgba(10, 12, 17, 0.94)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '6px 8px 6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '920px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* Text Search Input */}
              <div
                className="hero-search-input-group"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: '1.8',
                  minWidth: '180px'
                }}
              >
                <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search offers, locations, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Divider */}
              <div className="hero-search-divider" style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)' }} />

              {/* All Categories Dropdown */}
              <div
                className="hero-search-select-group"
                style={{ flex: '1', minWidth: '130px', display: 'flex', alignItems: 'center' }}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#d1d5db',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All Categories" style={{ background: '#121620' }}>All Categories</option>
                  <option value="Villas" style={{ background: '#121620' }}>Villas</option>
                  <option value="Plots & Land" style={{ background: '#121620' }}>Plots & Land</option>
                  <option value="Construction" style={{ background: '#121620' }}>Construction</option>
                  <option value="Heritage & Art" style={{ background: '#121620' }}>Heritage & Art</option>
                </select>
              </div>

              {/* Divider */}
              <div className="hero-search-divider" style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)' }} />

              {/* All Offer Types Dropdown */}
              <div
                className="hero-search-select-group"
                style={{ flex: '1', minWidth: '130px', display: 'flex', alignItems: 'center' }}
              >
                <select
                  value={selectedOfferType}
                  onChange={(e) => setSelectedOfferType(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#d1d5db',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All Offer Types" style={{ background: '#121620' }}>All Offer Types</option>
                  <option value="Lucky Draw" style={{ background: '#121620' }}>Lucky Draw</option>
                  <option value="Booking Benefit" style={{ background: '#121620' }}>Booking Benefit</option>
                  <option value="Bumper Draw" style={{ background: '#121620' }}>Bumper Draw</option>
                  <option value="Discount Offer" style={{ background: '#121620' }}>Discount Offer</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('explore-coupons-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold hero-search-btn"
                style={{
                  padding: '9px 24px',
                  fontSize: '0.88rem'
                }}
              >
                <Search size={15} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Exclusive Coupons Section */}
      <section
        id="explore-coupons-section"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '24px 24px 36px'
        }}
      >
        {/* Section Heading matching reference */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-heading-row" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <TypewriterHeader
              as="h2"
              text="Explore Exclusive Coupons"
              speed={42}
              delay={200}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
                fontWeight: 700,
                color: '#f6c042',
                margin: 0
              }}
            />
            <div className="heading-accent-line" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f6c042' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(212, 175, 55, 0.4)' }} />
              <div style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', background: '#f6c042' }} />
              <div style={{ width: '40px', height: '1px', background: 'rgba(212, 175, 55, 0.4)' }} />
            </div>
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            marginTop: '6px'
          }}>
            Handpicked offers to help you build your dreams, upgrade your lifestyle and celebrate more.
          </p>
        </div>

        {/* Category Filters with sliding active indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '28px',
          paddingBottom: '4px'
        }}>
          {['All Categories', 'Property', 'Construction', 'Gifts', 'Courses', 'Festival Offers'].map((cat) => {
            const active = selectedCategory.toLowerCase() === cat.toLowerCase() ||
              (cat === 'Property' && selectedCategory === 'Villas') ||
              (cat === 'Gifts' && selectedCategory === 'Plots & Land') ||
              (cat === 'Festival Offers' && selectedCategory === 'All Categories' && cat === 'All Categories');
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (cat === 'Property') setSelectedCategory('Villas');
                  else if (cat === 'Festival Offers') setSelectedCategory('All Categories');
                  else setSelectedCategory(cat);
                }}
                style={{
                  position: 'relative',
                  background: (selectedCategory === cat || (cat === 'Property' && selectedCategory === 'Villas'))
                    ? 'linear-gradient(135deg, #f6c042 0%, #ca8a04 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: (selectedCategory === cat || (cat === 'Property' && selectedCategory === 'Villas'))
                    ? '#000000'
                    : '#d1d5db',
                  border: (selectedCategory === cat || (cat === 'Property' && selectedCategory === 'Villas'))
                    ? '1px solid #f6c042'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '7px 18px',
                  fontSize: '0.82rem',
                  fontWeight: (selectedCategory === cat || (cat === 'Property' && selectedCategory === 'Villas')) ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: (selectedCategory === cat || (cat === 'Property' && selectedCategory === 'Villas'))
                    ? '0 4px 16px rgba(246, 192, 66, 0.35)'
                    : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{cat}</span>
              </motion.button>
            );
          })}
        </div>

        {/* 5 Coupons Row with Reusable Universal Coupon Template */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#f6c042' }}>
            <p>Loading festive exclusive coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#0d0f15',
            borderRadius: '12px',
            border: '1px dashed rgba(212, 175, 55, 0.3)'
          }}>
            <p style={{ color: '#d1d5db', fontSize: '1rem', marginBottom: '12px' }}>
              No coupons found matching your query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedOfferType('All Offer Types');
              }}
              className="btn-gold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="coupons-grid">
            {filteredCoupons.map((coupon, cIdx) => (
              <UniversalCouponCard
                key={coupon.id}
                coupon={coupon}
                theme={cIdx % 2 === 0 ? 'black' : 'black'}
                onSelectOffer={(cpn) => {
                  setDetailCoupon(cpn);
                  setActiveTab('coupon-detail');
                  window.history.pushState(null, '', `#coupon/${cpn.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectDetails={(cpn) => {
                  setActiveTicketPass({
                    ...cpn,
                    ticket_code: `1TKT-${(cpn.id || 'PASS').toUpperCase()}`,
                    event_title: cpn.title,
                    customer_name: 'Preview Holder',
                    total_price: cpn.price
                  });
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Trust & Feature Bar matching reference */}
      <section
        id="trust-features-section"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '10px 24px 40px'
        }}
      >
        <div style={{
          background: 'rgba(13, 15, 21, 0.85)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '12px',
          padding: '22px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Feature 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(246, 192, 66, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>
                Secure Booking
              </h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>
                Your transactions are 100% safe & secure.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(246, 192, 66, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>
                Verified Offers
              </h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>
                Only genuine & trusted offers.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(246, 192, 66, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>
                Clear Terms
              </h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>
                No hidden charges. Full transparency.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(246, 192, 66, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <Headphones size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>
                24/7 Customer Support
              </h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>
                We're here to help, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Story - About 1ticket (Matching User Reference Design) */}
      <section
        id="overview-story-section"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '20px 24px 60px'
        }}
      >
        <div className="story-grid-container">
          {/* Left Column: Story, Philosophy & 4 Highlights */}
          <div>
            <div style={{ marginBottom: '6px' }}>
              <span style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#f6c042',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                OVERVIEW & STORY
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 22px',
              letterSpacing: '-0.01em',
              lineHeight: 1.15
            }}>
              ABOUT <span className="gold-gradient-text">1TICKET</span>
            </h2>

            <div style={{
              background: '#0d1017',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '32px 30px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)'
            }}>
              <p style={{ fontSize: '0.94rem', color: '#e5e7eb', lineHeight: 1.7, margin: '0 0 16px' }}>
                Presented by <strong style={{ color: '#f6c042', fontWeight: 700 }}>1ticket</strong>, your destination for exclusive promotional coupons, exciting offers, and extraordinary opportunities.
              </p>
              <p style={{ fontSize: '0.91rem', color: '#9ca3af', lineHeight: 1.7, margin: '0 0 16px' }}>
                Created with a vision to make discovering special offers more convenient and rewarding, 1ticket brings together a curated range of promotional campaigns spanning property benefits, luxury gifts, construction offers, festive specials, and unique learning experiences.
              </p>
              <p style={{ fontSize: '0.91rem', color: '#9ca3af', lineHeight: 1.7, margin: '0 0 16px' }}>
                From exploring exclusive villa and plot promotions to discovering exciting gift campaigns and special festival offers, 1ticket delivers a premium digital experience where customers can explore opportunities, understand the benefits, and access eligible coupons with ease.
              </p>
              <p style={{ fontSize: '0.91rem', color: '#9ca3af', lineHeight: 1.7, margin: '0 0 24px' }}>
                Whether you are looking for an exciting promotional offer, a special gift opportunity, or a valuable deal for your next big decision, 1ticket makes every discovery feel special through a seamless, customer-focused experience.
              </p>

              {/* 2x2 Feature Highlights (Matching exact screenshot cards) */}
              <div className="story-highlights-grid">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#f6c042',
                    margin: '0 0 6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Exclusive Promotional Offers
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                    Discover exciting coupons, special campaigns, and offers across multiple categories.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#f6c042',
                    margin: '0 0 6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Premium Digital Experience
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                    Explore offers, access coupon details, and follow redemption instructions through one convenient platform.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#f6c042',
                    margin: '0 0 6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Transparent Offer Details
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                    Understand coupon values, eligibility requirements, validity periods, and applicable terms before making a purchase.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#f6c042',
                    margin: '0 0 6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Extraordinary Opportunities
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                    Discover property-related benefits, construction promotions, gift campaigns, and learning experiences, subject to specific offer conditions.
                  </p>
                </div>
              </div>

              {/* Endless Possibilities Tag */}
              <div style={{
                background: 'rgba(246, 192, 66, 0.06)',
                border: '1px solid rgba(246, 192, 66, 0.25)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.02rem',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={16} color="#f6c042" />
                  <span>One Ticket. Endless Possibilities.</span>
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
                  At 1ticket, every offer begins with an opportunity to discover something special. Explore the possibilities, choose the offer that suits you, and experience a smarter way to discover promotions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Information, Contact & Google Maps */}
          <div>
            <div style={{
              background: '#0d1017',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              {/* Header with Star and Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} color="#f6c042" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    PLATFORM & VENUE DESK
                  </h3>
                </div>
                <span style={{
                  background: 'rgba(246, 192, 66, 0.1)',
                  border: '1px solid rgba(246, 192, 66, 0.35)',
                  color: '#f6c042',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  OFFICIAL ACCESS
                </span>
              </div>

              {/* Contact and Info rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Mail size={16} color="#f6c042" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Email Desk</div>
                    <a href="mailto:1ticket0308@gmail.com" style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600, textDecoration: 'none' }}>
                      1ticket0308@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Phone size={16} color="#f6c042" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Helpline & Support</div>
                    <a href="tel:+917989938718" style={{ fontSize: '0.94rem', color: '#f6c042', fontWeight: 700, textDecoration: 'none' }}>
                      +91 79899 38718
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={16} color="#f6c042" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Venue Location</div>
                    <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>
                      White House Convention, Mahabubnagar
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div style={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.3357744141426!2d78.05516505075678!3d16.7599621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bca2f79671b12e5%3A0xf93387087e69a3fc!2sWhite%20House%20Convention!5e0!3m2!1sen!2sin!4v1791799530896!5m2!1sen!2sin"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="White House Convention Google Map"
                />
              </div>

              {/* Book Passes CTA matching screenshot */}
              <button
                onClick={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(246, 192, 66, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <span>BOOK PASSES NOW</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Most Important FAQs Section (Directly Below Overview & Story) */}
      <section
        id="important-faqs-section"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '10px 24px 70px'
        }}
      >
        <div style={{
          background: 'radial-gradient(ellipse at top, rgba(246, 192, 66, 0.05) 0%, rgba(13, 16, 23, 0.85) 70%)',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: '20px',
          padding: '44px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(246, 192, 66, 0.1)',
              border: '1px solid rgba(246, 192, 66, 0.3)',
              borderRadius: '20px',
              padding: '4px 14px',
              color: '#f6c042',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <HelpCircle size={13} />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
              color: '#ffffff',
              margin: '0 0 10px',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}>
              EVERYTHING YOU <span className="gold-gradient-text">NEED TO KNOW</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              Quick answers to the most important questions about booking passes, lucky dip participation, QR redemption, and payments.
            </p>
          </div>

          {/* Interactive Accordion Items */}
          <div style={{
            maxWidth: '920px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {[
              {
                q: 'What is 1ticket and how do promotional campaigns work?',
                a: '1ticket is an authentic digital discovery and ticketing platform for exclusive promotional campaigns, lucky dip opportunities, and special festive offers. Customers can explore curated campaigns spanning property benefits, luxury gifts, construction promotions, and art workshops, then purchase digital coupons with transparent terms.'
              },
              {
                q: 'Will I receive my QR pass and booking receipt immediately?',
                a: 'Yes, immediately! As soon as payment is confirmed, your digital pass featuring a unique QR code is displayed on your screen and simultaneously sent to your registered email address via Nodemailer. You can also view or save your voucher passes anytime under "My Coupons".'
              },
              {
                q: 'How does the Lucky Dip Villa & Promotional Draw work?',
                a: 'Participation in draw-based campaigns (such as the Lucky Dip Villa Coupon) is confirmed upon purchasing your pass. The official, transparent draw takes place at White House Convention on the announced date. All verified ticket codes are entered into the draw, and winners are contacted via registered email and phone.'
              },
              {
                q: 'Can I purchase passes for multiple guests or family members?',
                a: 'Yes! When purchasing more than 1 pass, our checkout automatically prompts you for the names and mobile numbers of all individual attendees so that distinct, verified passes are generated for each guest.'
              },
              {
                q: 'How do I redeem my pass at the venue on event day?',
                a: 'Simply present your QR pass on your mobile phone or printout at the counter or gate. Our ground coordinators scan and verify the voucher in real-time using high-speed camera scanners for instant entry verification.'
              },
              {
                q: 'Which payment methods are accepted and is transaction data secure?',
                a: 'We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking through Razorpay’s 256-bit bank-grade SSL encrypted gateway. Transactions are 100% safe and verified.'
              },
              {
                q: 'Who do I contact if I have questions or need assistance?',
                a: 'Our dedicated customer care team is available via direct helpline at +91 79899 38718 and email at 1ticket0308@gmail.com. You can also visit our venue desk at White House Convention, Mahabubnagar.'
              }
            ].map((faq, idx) => {
              const isOpen = !!openHomeFaqs[idx];
              return (
                <div
                  key={idx}
                  style={{
                    background: isOpen ? '#141824' : '#0e111a',
                    border: isOpen ? '1px solid rgba(246, 192, 66, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    transition: 'all 0.25s ease',
                    overflow: 'hidden',
                    boxShadow: isOpen ? '0 10px 25px rgba(0, 0, 0, 0.5)' : 'none'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleHomeFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isOpen ? '#f6c042' : 'rgba(255, 255, 255, 0.06)',
                        color: isOpen ? '#000000' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: isOpen ? '#f6c042' : '#ffffff',
                        transition: 'color 0.2s ease'
                      }}>
                        {faq.q}
                      </span>
                    </div>
                    <div style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? '#f6c042' : '#9ca3af',
                      flexShrink: 0
                    }}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 22px 20px 60px',
                      color: '#d1d5db',
                      fontSize: '0.88rem',
                      lineHeight: 1.7,
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                      paddingTop: '12px'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Callout to Full FAQ Page */}
          <div style={{
            marginTop: '36px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '0.86rem', margin: 0 }}>
              Need more details regarding campaign terms, winner selection, or coordinator verification?
            </p>
            <button
              onClick={() => {
                setActiveTab('faq');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold-outline"
              style={{
                padding: '10px 22px',
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}
            >
              <span>Explore All 25+ FAQs in Help Center</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Booking / Claim Offer Modal */}
      {selectedCouponForOffer && (
        <BookingModal
          coupon={selectedCouponForOffer}
          onClose={() => setSelectedCouponForOffer(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Coupon Details Modal */}
      {selectedCouponDetails && (
        <div className="modal-overlay" onClick={() => setSelectedCouponDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={selectedCouponDetails.image_url}
                alt={selectedCouponDetails.title}
                style={{ width: '100%', height: '240px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(185, 28, 28, 0.9)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '4px'
              }}>
                {selectedCouponDetails.badge || 'FESTIVE OFFER'}
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px' }}>
                {selectedCouponDetails.title}
              </h3>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedCouponDetails.description}
              </p>

              <div style={{
                background: 'rgba(246, 192, 66, 0.06)',
                border: '1px solid rgba(246, 192, 66, 0.25)',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>COUPON PRICE</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f6c042' }}>
                    ₹{Number(selectedCouponDetails.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const cpn = selectedCouponDetails;
                    setSelectedCouponDetails(null);
                    setSelectedCouponForOffer(cpn);
                  }}
                  className="btn-gold"
                  style={{ padding: '10px 24px' }}
                >
                  Claim This Coupon
                </button>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedCouponDetails(null)}
                  className="btn-gold-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Pass / Success Voucher Modal */}
      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
        />
      )}

      {/* My Tickets / Coupons Modal */}
      {isMyTicketsOpen && (
        <MyTicketsModal
          bookings={bookings}
          onClose={() => setIsMyTicketsOpen(false)}
          onSelectPass={(b) => {
            setIsMyTicketsOpen(false);
            setActiveTicketPass(b);
          }}
          onViewTicket={(b) => {
            setIsMyTicketsOpen(false);
            setActiveTicketPass(b);
          }}
          onRefresh={fetchBookings}
        />
      )}

      {/* Neon DB Info Modal */}
      {isNeonModalOpen && (
        <NeonInfoModal
          dbStatus={dbStatus}
          onClose={() => setIsNeonModalOpen(false)}
          onRefresh={fetchDbStatus}
        />
      )}

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="modal-overlay" onClick={() => setIsSignInOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '8px' }}>Sign In to 1ticket</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '20px' }}>
              Access your lucky dip coupon vouchers, booking benefits, and saved offers.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#151922',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                color: '#fff',
                marginBottom: '14px',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={() => {
                alert('Signed in successfully with demo profile!');
                setIsSignInOpen(false);
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '12px', marginBottom: '10px' }}
            >
              Continue
            </button>
            <button
              onClick={() => setIsSignInOpen(false)}
              className="btn-gold-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Legal & Policy Center Modal */}
      {activeLegalPolicy && (
        <LegalModal
          activeTab={activeLegalPolicy}
          onClose={() => setActiveLegalPolicy(null)}
        />
      )}

      {/* Global Footer (Hidden inside Admin & Coordinator Dashboard) */}
      {!(activeTab === 'admin' && adminUser && adminToken) && (
        <Footer
          onNavigate={(tab) => {
            setActiveTab(tab);
            if (tab === 'my-coupons') setIsMyTicketsOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLegal={(policyId) => setActiveLegalPolicy(policyId)}
        />
      )}

      {/* Mobile Sticky Booking Bar (Only on Home Page, < 900px) */}
      {activeTab === 'home' && !isSignInOpen && !activeTicketPass && !isMyTicketsOpen && (
        <div className="home-mobile-sticky-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f6c042', display: 'inline-block', boxShadow: '0 0 8px rgba(246, 192, 66, 0.8)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e5e7eb', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                18/10/2026
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                ₹100
              </span>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                onwards
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('explore');
              window.location.hash = '#explore';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              padding: '11px 22px',
              fontSize: '0.84rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #f6c042 0%, #eab308 50%, #d97706 100%)',
              color: '#000000',
              border: 'none',
              boxShadow: '0 4px 18px rgba(246, 192, 66, 0.45)',
              cursor: 'pointer'
            }}
          >
            <Ticket size={16} strokeWidth={2.4} />
            <span>BOOK PASSES</span>
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  );
}
