import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Ticket,
  LayoutDashboard,
  QrCode,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Bell,
  CheckCircle2,
  XCircle,
  Sparkles,
  Printer
} from 'lucide-react';

import RevenueReportsPage from './RevenueReportsPage';
import CouponsManagementPage from './CouponsManagementPage';
import BookingsFilterPage from './BookingsFilterPage';
import CameraScannerPage from './CameraScannerPage';
import CoordinatorsManagementPage from './CoordinatorsManagementPage';
import VerifiedMembersPrintPage from './VerifiedMembersPrintPage';
import {
  RevenueReportsSkeleton,
  CouponsManagementSkeleton,
  BookingsFilterSkeleton,
  CoordinatorsManagementSkeleton,
  CameraScannerSkeleton
} from './Skeletons';
import { getApiUrl } from '../config/api';

export default function AdminDashboard({ user, token, onLogout, onReturnHome }) {
  // Page routing inside admin portal: 'revenue' | 'coupons' | 'bookings' | 'scanner' | 'coordinators' | 'verified-roster'
  const getInitialAdminPage = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const hashParts = hash.split('/');
    if (hashParts[0] === 'admin' && hashParts[1]) {
      const page = hashParts[1];
      if (['revenue', 'coupons', 'bookings', 'scanner', 'coordinators', 'verified-roster'].includes(page)) {
        if (user.role === 'coordinator' && !['scanner', 'bookings', 'verified-roster'].includes(page)) {
          return 'scanner';
        }
        return page;
      }
    }
    const saved = localStorage.getItem('1ticket_admin_page');
    if (saved && ['revenue', 'coupons', 'bookings', 'scanner', 'coordinators', 'verified-roster'].includes(saved)) {
      if (user.role === 'coordinator' && !['scanner', 'bookings', 'verified-roster'].includes(saved)) {
        return 'scanner';
      }
      return saved;
    }
    return user.role === 'coordinator' ? 'scanner' : 'revenue';
  };

  const [activePage, setActivePageState] = useState(getInitialAdminPage);

  const setActivePage = (page) => {
    setActivePageState(page);
    localStorage.setItem('1ticket_admin_page', page);
    window.history.replaceState(null, '', `#admin/${page}`);
  };

  useEffect(() => {
    if (!window.location.hash.includes('/')) {
      window.history.replaceState(null, '', `#admin/${activePage}`);
    }
  }, [activePage]);
  const [stats, setStats] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load analytics stats
      try {
        const resStats = await fetch(getApiUrl('/api/reports/analytics'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dStats = await resStats.json();
        if (dStats.success) setStats(dStats.data);
      } catch (e) {
        console.warn('Analytics load error:', e);
      }

      // Load coupons
      try {
        const resCoupons = await fetch(getApiUrl('/api/events'));
        const dCoupons = await resCoupons.json();
        if (dCoupons.success) setCoupons(dCoupons.data);
      } catch (e) {
        console.warn('Coupons load error:', e);
      }

      // Load bookings
      try {
        const resBookings = await fetch(getApiUrl('/api/bookings'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dBookings = await resBookings.json();
        if (dBookings.success) setBookings(dBookings.data);
      } catch (e) {
        console.warn('Bookings load error:', e);
      }

      // Load coordinators if admin
      if (user.role === 'admin') {
        try {
          const resCoords = await fetch(getApiUrl('/api/coordinators'), {
            headers: { Authorization: `Bearer ${token}` }
          });
          const dCoords = await resCoords.json();
          if (dCoords.success) setCoordinators(dCoords.data);
        } catch (e) {
          console.warn('Coordinators load error:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handlers for Coupon Create & Delete
  const handleCreateCoupon = async (couponData) => {
    try {
      const res = await fetch(getApiUrl('/api/events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(couponData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pass campaign created and published successfully!');
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to create pass', 'error');
      }
    } catch (err) {
      showToast('Error creating pass campaign', 'error');
    }
  };

  const handleUpdateCoupon = async (id, updatedData) => {
    try {
      const res = await fetch(getApiUrl(`/api/events/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pass offer updated successfully!');
        loadDashboardData();
        return true;
      } else {
        showToast(data.error || 'Failed to update pass', 'error');
        return false;
      }
    } catch (err) {
      showToast('Error updating pass campaign', 'error');
      return false;
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/events/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pass deleted');
        loadDashboardData();
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting pass', 'error');
    }
  };

  // Handlers for Coordinator Create & Delete
  const handleCreateCoordinator = async (coordData) => {
    try {
      const res = await fetch(getApiUrl('/api/coordinators'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(coordData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Coordinator registered and invitation dispatched via Nodemailer!');
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to create coordinator', 'error');
      }
    } catch (err) {
      showToast('Error registering coordinator', 'error');
    }
  };

  const handleDeleteCoordinator = async (id) => {
    if (!window.confirm('Are you sure you want to remove this coordinator?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/coordinators/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Coordinator removed');
        loadDashboardData();
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting coordinator', 'error');
    }
  };

  // Navigation Items
  const navItems = [
    ...(user.role === 'admin'
      ? [
          {
            id: 'revenue',
            label: 'Revenue Reports',
            badge: stats?.totalRevenue ? `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}` : null,
            icon: <TrendingUp size={18} />
          },
          {
            id: 'coupons',
            label: 'Passes Management',
            badge: coupons.length ? `${coupons.length}` : null,
            icon: <Ticket size={18} />
          }
        ]
      : []),
    {
      id: 'bookings',
      label: 'Bookings & Orders',
      badge: bookings.length ? `${bookings.length}` : null,
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'verified-roster',
      label: 'Verified Print Roster',
      badge: bookings.filter((b) => b.status === 'redeemed').length
        ? `${bookings.filter((b) => b.status === 'redeemed').length}`
        : null,
      badgeColor: '#10b981',
      icon: <Printer size={18} />
    },
    {
      id: 'scanner',
      label: 'Camera Scanner & Verify',
      badge: 'LIVE',
      badgeColor: '#22c55e',
      icon: <QrCode size={18} />
    },
    ...(user.role === 'admin'
      ? [
          {
            id: 'coordinators',
            label: 'Coordinators Team',
            badge: coordinators.length ? `${coordinators.length}` : null,
            icon: <Users size={18} />
          }
        ]
      : [])
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#060709', color: '#ffffff' }}>
      {/* Premium Toast Container */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '28px',
          zIndex: 9999,
          background: notification.type === 'error'
            ? 'linear-gradient(135deg, rgba(35, 10, 15, 0.95), rgba(55, 15, 20, 0.98))'
            : 'linear-gradient(135deg, rgba(10, 28, 20, 0.95), rgba(16, 40, 28, 0.98))',
          border: notification.type === 'error'
            ? '1px solid rgba(239, 68, 68, 0.5)'
            : '1px solid rgba(34, 197, 94, 0.5)',
          backdropFilter: 'blur(12px)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: notification.type === 'error'
            ? '0 16px 40px rgba(239, 68, 68, 0.25), 0 0 25px rgba(0, 0, 0, 0.8)'
            : '0 16px 40px rgba(34, 197, 94, 0.25), 0 0 25px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          fontWeight: 600,
          maxWidth: '440px',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {notification.type === 'error'
              ? <XCircle size={18} color="#f87171" />
              : <CheckCircle2 size={18} color="#4ade80" />}
          </div>

          <div style={{ flex: 1 }}>
            <span style={{
              display: 'block',
              fontSize: '0.72rem',
              color: notification.type === 'error' ? '#fca5a5' : '#86efac',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {notification.type === 'error' ? 'System Alert' : 'Success'}
            </span>
            <span style={{ fontSize: '0.86rem', color: '#ffffff' }}>
              {notification.msg}
            </span>
          </div>

          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: '270px',
          background: '#090b10',
          borderRight: '1px solid rgba(212, 175, 55, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          flexShrink: 0
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img
            src="/logo.png"
            alt="1ticket"
            style={{ height: '32px', width: 'auto', cursor: 'pointer' }}
            onClick={onReturnHome}
          />
          <span style={{
            background: user.role === 'admin' ? 'rgba(246, 192, 66, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            border: user.role === 'admin' ? '1px solid #f6c042' : '1px solid #38bdf8',
            color: user.role === 'admin' ? '#f6c042' : '#38bdf8',
            fontSize: '0.66rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: '10px',
            letterSpacing: '0.04em'
          }}>
            {user.role === 'admin' ? 'ADMIN' : 'COORDINATOR'}
          </span>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="admin-mobile-menu-btn"
            style={{ marginLeft: 'auto' }}
            title="Close Menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Card */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: user.role === 'admin' ? 'linear-gradient(135deg, #d4af37, #f6c042)' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
            color: '#060709',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.95rem'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          <div style={{ padding: '0 8px 8px', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Management Portal
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(246, 192, 66, 0.16) 0%, rgba(246, 192, 66, 0.05) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(246, 192, 66, 0.4)' : '1px solid transparent',
                  color: isActive ? '#f6c042' : '#9ca3af',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: isActive ? '#f6c042' : '#9ca3af' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: item.badgeColor ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: item.badgeColor ? '#22c55e' : '#d1d5db',
                    border: item.badgeColor ? '1px solid rgba(34, 197, 94, 0.4)' : 'none'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{
          padding: '16px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={onReturnHome}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#d1d5db',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={15} color="#f6c042" />
            <span>Switch to Public Site</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
            <span>End Session (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Minimal Staff Header */}
        <header style={{
          height: '64px',
          background: '#090b10',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 clamp(16px, 3vw, 32px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="admin-mobile-menu-btn"
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            <ShieldCheck size={20} color="#f6c042" />
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
              {user.role === 'admin' ? 'Super Administrator Dashboard' : 'Ground Coordinator Portal'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Active Session
            </span>
          </div>
        </header>

        {/* Page Container */}
        <div style={{ flex: 1, padding: 'clamp(14px, 2.5vw, 32px)' }}>
          {loading ? (
            activePage === 'revenue' ? (
              <RevenueReportsSkeleton />
            ) : activePage === 'coupons' ? (
              <CouponsManagementSkeleton />
            ) : activePage === 'bookings' ? (
              <BookingsFilterSkeleton />
            ) : activePage === 'scanner' ? (
              <CameraScannerSkeleton />
            ) : (
              <CoordinatorsManagementSkeleton />
            )
          ) : (
            <>
              {activePage === 'revenue' && user.role === 'admin' && (
                <RevenueReportsPage
                  stats={stats}
                  bookings={bookings}
                  onRefresh={loadDashboardData}
                  loading={loading}
                />
              )}

              {activePage === 'coupons' && user.role === 'admin' && (
                <CouponsManagementPage
                  coupons={coupons}
                  token={token}
                  onCreateCoupon={handleCreateCoupon}
                  onUpdateCoupon={handleUpdateCoupon}
                  onDeleteCoupon={handleDeleteCoupon}
                  user={user}
                />
              )}

              {activePage === 'bookings' && (
                <BookingsFilterPage bookings={bookings} user={user} />
              )}

              {activePage === 'verified-roster' && (
                <VerifiedMembersPrintPage bookings={bookings} user={user} />
              )}

              {activePage === 'scanner' && (
                <CameraScannerPage
                  bookings={bookings}
                  token={token}
                  onScanSuccess={loadDashboardData}
                />
              )}

              {activePage === 'coordinators' && user.role === 'admin' && (
                <CoordinatorsManagementPage
                  coordinators={coordinators}
                  onCreateCoordinator={handleCreateCoordinator}
                  onDeleteCoordinator={handleDeleteCoordinator}
                  user={user}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
