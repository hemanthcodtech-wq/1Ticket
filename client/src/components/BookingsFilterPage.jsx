import React, { useState } from 'react';
import {
  LayoutDashboard,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Mail,
  Download,
  Calendar,
  IndianRupee,
  User,
  Phone
} from 'lucide-react';

export default function BookingsFilterPage({ bookings = [], user = null }) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'confirmed' | 'redeemed' | 'my-scans'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    let matchesStatus = true;
    if (statusFilter === 'confirmed') {
      matchesStatus = b.status === 'confirmed';
    } else if (statusFilter === 'redeemed') {
      matchesStatus = b.status === 'redeemed';
    } else if (statusFilter === 'my-scans') {
      matchesStatus = b.status === 'redeemed' && (
        (user?.id && b.verified_by_id === user.id) ||
        (user?.name && b.verified_by_name?.toLowerCase() === user.name?.toLowerCase()) ||
        (user?.email && b.verified_by_email?.toLowerCase() === user.email?.toLowerCase())
      );
    }

    const matchesQuery =
      !searchQuery.trim() ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customer_email && b.customer_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customer_phone && b.customer_phone.includes(searchQuery)) ||
      (b.ticket_code && b.ticket_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.verified_by_name && b.verified_by_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.event_title && b.event_title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesQuery;
  });

  const myScannedCount = bookings.filter((b) =>
    b.status === 'redeemed' && (
      (user?.id && b.verified_by_id === user.id) ||
      (user?.name && b.verified_by_name?.toLowerCase() === user.name?.toLowerCase()) ||
      (user?.email && b.verified_by_email?.toLowerCase() === user.email?.toLowerCase())
    )
  ).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
          Bookings & Orders <span className="gold-gradient-text">Directory</span>
        </h2>
        <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
          Filter confirmed vouchers, monitor real-time redemption at booths, and audit Nodemailer receipts
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '18px 22px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#151922',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          padding: '8px 14px',
          flex: '1',
          minWidth: '260px',
          maxWidth: '480px'
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or voucher serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.86rem',
              width: '100%'
            }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>Filter:</span>
          {[
            { id: 'all', label: 'All Vouchers', count: bookings.length },
            { id: 'confirmed', label: 'Unredeemed / Active', count: bookings.filter((b) => b.status === 'confirmed').length },
            { id: 'redeemed', label: 'Verified & Redeemed', count: bookings.filter((b) => b.status === 'redeemed').length },
            ...(user?.role === 'coordinator'
              ? [{ id: 'my-scans', label: 'Scanned by Me', count: myScannedCount, highlight: true }]
              : [])
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                background: statusFilter === st.id
                  ? '#f6c042'
                  : st.highlight ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                color: statusFilter === st.id
                  ? '#000000'
                  : st.highlight ? '#34d399' : '#d1d5db',
                border: statusFilter === st.id
                  ? '1px solid #f6c042'
                  : st.highlight ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{st.label}</span>
              <span style={{
                background: statusFilter === st.id ? '#000000' : 'rgba(255, 255, 255, 0.1)',
                color: statusFilter === st.id ? '#f6c042' : '#9ca3af',
                fontSize: '0.68rem',
                padding: '1px 6px',
                borderRadius: '8px'
              }}>
                {st.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
      }}>
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6b7280' }}>
            No matching vouchers found for the selected filter or search keyword.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Voucher Code</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Attendee / Customer</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Contact Info</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Campaign Offer</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Verified By Staff</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Redeemed On</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#f6c042', fontWeight: 800 }}>
                      {b.ticket_code}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: 600 }}>
                      {b.customer_name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#d1d5db', fontSize: '0.78rem' }}>
                      <div>{b.customer_email}</div>
                      <div style={{ color: '#9ca3af' }}>{b.customer_phone || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff' }}>
                      <div style={{ fontWeight: 600 }}>{b.event_title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Qty: {b.seat_count || b.quantity || 1} pass</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: 800 }}>
                      ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: b.status === 'redeemed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: b.status === 'redeemed' ? '#34d399' : '#f59e0b',
                        border: b.status === 'redeemed' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {b.status === 'redeemed' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{b.status === 'redeemed' ? 'VERIFIED' : 'CONFIRMED'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {b.status === 'redeemed' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{
                            color: '#f6c042',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <User size={13} />
                            {b.verified_by_name || 'Staff Member'}
                          </span>
                          {b.verified_by_email && (
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                              {b.verified_by_email}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          Not Yet Scanned
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.76rem' }}>
                      {b.redeemed_at ? new Date(b.redeemed_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.76rem' }}>
                      {new Date(b.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
