import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import UniversalCouponCard from './UniversalCouponCard';
import TypewriterHeader from './TypewriterHeader';
import {
  Search,
  Filter,
  Sparkles,
  Ticket,
  Tag,
  ArrowUpDown,
  Building,
  MapPin,
  Car,
  Home,
  Palette,
  CheckCircle2,
  Gift,
  Flame,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function ExploreCouponsPage({
  coupons = [],
  loading = false,
  onSelectCoupon
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOfferType, setSelectedOfferType] = useState('All');
  const [priceSort, setPriceSort] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc'

  // Extract unique categories and offer types
  const categories = ['All', ...Array.from(new Set(coupons.map(c => c.category).filter(Boolean)))];
  const offerTypes = ['All', ...Array.from(new Set(coupons.map(c => c.offer_type).filter(Boolean)))];

  // Category Icon helper
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'villas':
        return <Home size={15} />;
      case 'plots & land':
        return <MapPin size={15} />;
      case 'villas & cars':
        return <Car size={15} />;
      case 'heritage crafts':
        return <Palette size={15} />;
      case 'concerts & gala':
        return <Ticket size={15} />;
      default:
        return <Tag size={15} />;
    }
  };

  // Filter & Sort
  const filtered = coupons
    .filter((c) => {
      const matchesCategory = selectedCategory === 'All' || c.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesOfferType = selectedOfferType === 'All' || c.offer_type?.toLowerCase() === selectedOfferType.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.venue?.toLowerCase().includes(q);

      return matchesCategory && matchesOfferType && matchesSearch;
    })
    .sort((a, b) => {
      if (priceSort === 'price-asc') return Number(a.price || 0) - Number(b.price || 0);
      if (priceSort === 'price-desc') return Number(b.price || 0) - Number(a.price || 0);
      return 0; // featured default order
    });

  return (
    <div style={{ minHeight: '100vh', background: '#060709', color: '#ffffff', paddingBottom: '80px' }}>
      {/* Hero Banner Section for Explore Coupons */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(13, 16, 23, 0.95) 0%, rgba(6, 7, 9, 1) 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
        padding: '48px 24px 36px',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative radial gradients */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '240px',
          background: 'radial-gradient(ellipse, rgba(246, 192, 66, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(246, 192, 66, 0.1)', border: '1px solid rgba(246, 192, 66, 0.3)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
            <Sparkles size={14} color="#f6c042" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f6c042', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              FESTIVE CAMPAIGN CATALOG
            </span>
          </div>

          <TypewriterHeader
            as="h1"
            segments={[
              { text: 'Explore Exclusive ' },
              { text: 'Coupons & Passes', className: 'gold-gradient-text' }
            ]}
            speed={40}
            delay={150}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.7rem)',
              fontWeight: 800,
              margin: '0 0 10px',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          />

          <p style={{ color: '#9ca3af', fontSize: '0.96rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Handpicked festive privileges, lucky draw entries, land plot discounts, luxury villa vouchers, and heritage masterclass passes. Verified and scannable at venue check-in.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#d1d5db' }}>
              <CheckCircle2 size={16} color="#22c55e" />
              <span><strong>{coupons.length}</strong> Live Active Offers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#d1d5db' }}>
              <ShieldCheck size={16} color="#f6c042" />
              <span>Instant QR Pass via Nodemailer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#d1d5db' }}>
              <Gift size={16} color="#34d399" />
              <span>Durgashtami Festive Perks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1360px', margin: '32px auto 0', padding: '0 24px' }}>
        
        {/* Filter Controls & Search Box */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Top Row: Search & Sort */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '18px'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#131722',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 16px',
              flex: 1,
              minWidth: '280px'
            }}>
              <Search size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search by villa, car, lucky draw, location or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Price Sort & Offer Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Sort:</span>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  style={{
                    background: '#131722',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Type:</span>
                <select
                  value={selectedOfferType}
                  onChange={(e) => setSelectedOfferType(e.target.value)}
                  style={{
                    background: '#131722',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.84rem'
                  }}
                >
                  {offerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '16px'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: active ? 'linear-gradient(135deg, #f6c042 0%, #d97706 100%)' : '#141824',
                    color: active ? '#000000' : '#d1d5db',
                    border: active ? '1px solid #f6c042' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat !== 'All' && getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '0.88rem', color: '#9ca3af' }}>
            Showing <strong style={{ color: '#f6c042' }}>{filtered.length}</strong> available coupons
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedOfferType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedOfferType('All');
                setPriceSort('featured');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f6c042',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* 3-Per-Row Grid Display */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#f6c042' }}>
            <p>Loading coupons catalogue...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: '#0d1017',
            border: '1px dashed rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '70px 24px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <Ticket size={48} color="#f6c042" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#ffffff', margin: '0 0 8px', fontSize: '1.25rem' }}>No Coupons Found</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px' }}>
              We could not find any active offers matching your search criteria. Try a different category or clear the search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedOfferType('All');
              }}
              className="btn-gold"
            >
              View All Coupons
            </button>
          </div>
        ) : (
          <div className="coupons-grid">
            {filtered.map((coupon, idx) => (
              <UniversalCouponCard
                key={coupon.id}
                coupon={coupon}
                theme={idx % 2 === 0 ? 'black' : 'black'}
                onSelectOffer={(cpn) => onSelectCoupon(cpn)}
                onSelectDetails={(cpn) => onSelectCoupon(cpn)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
