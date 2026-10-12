import React from 'react';

// Common Skeleton Shimmer Block
export function SkeletonBlock({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

// 1. Skeleton for Revenue Reports & Analytics Dashboard
export function RevenueReportsSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Bar Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <SkeletonBlock width="320px" height="32px" borderRadius="8px" style={{ marginBottom: '8px' }} />
          <SkeletonBlock width="450px" height="18px" />
        </div>
        <SkeletonBlock width="130px" height="40px" borderRadius="8px" />
      </div>

      {/* KPI 4 Cards Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-box" style={{ borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <SkeletonBlock width="100px" height="14px" />
              <SkeletonBlock width="36px" height="36px" borderRadius="10px" />
            </div>
            <SkeletonBlock width="140px" height="30px" style={{ marginBottom: '10px' }} />
            <SkeletonBlock width="80px" height="12px" />
          </div>
        ))}
      </div>

      {/* Chart & Highlights Breakdown Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="skeleton-box" style={{ borderRadius: '16px', padding: '24px', minHeight: '340px' }}>
          <SkeletonBlock width="220px" height="20px" style={{ marginBottom: '20px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '220px', padding: '10px 0' }}>
            {[45, 75, 60, 90, 50, 80, 100, 65].map((h, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <SkeletonBlock width="100%" height={`${h}%`} borderRadius="6px" />
                <SkeletonBlock width="24px" height="12px" />
              </div>
            ))}
          </div>
        </div>

        <div className="skeleton-box" style={{ borderRadius: '16px', padding: '24px', minHeight: '340px' }}>
          <SkeletonBlock width="180px" height="20px" style={{ marginBottom: '20px' }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <SkeletonBlock width="120px" height="16px" />
              <SkeletonBlock width="60px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Skeleton for Coupons Management Page
export function CouponsManagementSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <SkeletonBlock width="340px" height="32px" borderRadius="8px" style={{ marginBottom: '8px' }} />
          <SkeletonBlock width="420px" height="16px" />
        </div>
        <SkeletonBlock width="160px" height="42px" borderRadius="8px" />
      </div>

      {/* Coupons 3-Column Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-box" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <SkeletonBlock width="100%" height="180px" borderRadius="0" />
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <SkeletonBlock width="90px" height="20px" borderRadius="10px" />
                <SkeletonBlock width="60px" height="20px" />
              </div>
              <SkeletonBlock width="200px" height="22px" style={{ marginBottom: '8px' }} />
              <SkeletonBlock width="100%" height="14px" style={{ marginBottom: '6px' }} />
              <SkeletonBlock width="80%" height="14px" style={{ marginBottom: '16px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <SkeletonBlock width="80px" height="24px" />
                <SkeletonBlock width="70px" height="32px" borderRadius="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Skeleton for Bookings & Verified Members Directory
export function BookingsFilterSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div>
        <SkeletonBlock width="320px" height="32px" borderRadius="8px" style={{ marginBottom: '8px' }} />
        <SkeletonBlock width="460px" height="16px" />
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="skeleton-box" style={{ borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <SkeletonBlock width="320px" height="38px" borderRadius="8px" />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} width="110px" height="34px" borderRadius="6px" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="skeleton-box" style={{ borderRadius: '16px', overflow: 'hidden', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['Code', 'Customer', 'Contact', 'Offer', 'Amount', 'Status', 'Verified By', 'Date'].map((_, idx) => (
            <SkeletonBlock key={idx} width="80%" height="16px" />
          ))}
        </div>
        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '14px', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <SkeletonBlock width="90%" height="18px" />
            <SkeletonBlock width="80%" height="18px" />
            <SkeletonBlock width="75%" height="18px" />
            <SkeletonBlock width="85%" height="18px" />
            <SkeletonBlock width="60%" height="18px" />
            <SkeletonBlock width="70px" height="22px" borderRadius="10px" />
            <SkeletonBlock width="90%" height="18px" />
            <SkeletonBlock width="65%" height="16px" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Skeleton for Coordinators Team Management
export function CoordinatorsManagementSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <SkeletonBlock width="320px" height="32px" borderRadius="8px" style={{ marginBottom: '8px' }} />
          <SkeletonBlock width="400px" height="16px" />
        </div>
        <SkeletonBlock width="170px" height="42px" borderRadius="8px" />
      </div>

      {/* Coordinators Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-box" style={{ borderRadius: '16px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <SkeletonBlock width="46px" height="46px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <SkeletonBlock width="140px" height="20px" style={{ marginBottom: '6px' }} />
                <SkeletonBlock width="90px" height="14px" />
              </div>
            </div>
            <SkeletonBlock width="100%" height="14px" style={{ marginBottom: '8px' }} />
            <SkeletonBlock width="80%" height="14px" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <SkeletonBlock width="70px" height="20px" borderRadius="8px" />
              <SkeletonBlock width="80px" height="28px" borderRadius="6px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Skeleton for Camera Scanner View
export function CameraScannerSkeleton() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <SkeletonBlock width="360px" height="32px" borderRadius="8px" style={{ marginBottom: '8px' }} />
        <SkeletonBlock width="480px" height="16px" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <div className="skeleton-box" style={{ borderRadius: '16px', padding: '20px', minHeight: '440px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <SkeletonBlock width="150px" height="22px" />
            <SkeletonBlock width="110px" height="34px" borderRadius="6px" />
          </div>
          <SkeletonBlock width="100%" height="320px" borderRadius="12px" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="skeleton-box" style={{ borderRadius: '16px', padding: '20px' }}>
            <SkeletonBlock width="180px" height="20px" style={{ marginBottom: '14px' }} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <SkeletonBlock width="100%" height="40px" borderRadius="8px" />
              <SkeletonBlock width="100px" height="40px" borderRadius="8px" />
            </div>
            <SkeletonBlock width="140px" height="14px" style={{ marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} width="90px" height="24px" borderRadius="4px" />
              ))}
            </div>
          </div>

          <div className="skeleton-box" style={{ borderRadius: '16px', padding: '20px', minHeight: '180px' }}>
            <SkeletonBlock width="160px" height="18px" style={{ marginBottom: '14px' }} />
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <SkeletonBlock width="120px" height="16px" />
                <SkeletonBlock width="60px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
