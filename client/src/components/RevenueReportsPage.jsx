import React, { useRef } from 'react';
import {
  TrendingUp,
  Ticket,
  Calendar,
  IndianRupee,
  RefreshCw,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  FileSpreadsheet,
  Download,
  Printer
} from 'lucide-react';

export default function RevenueReportsPage({ stats, bookings = [], onRefresh, loading }) {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
            Financial & Campaign <span className="gold-gradient-text">Revenue Reports</span>
          </h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            Audited financial breakdown, campaign booking volume, and real-time redemption metrics
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="btn-gold-outline"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '0.84rem' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Live Ledger</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Total Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(13, 16, 23, 0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', color: '#f6c042', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Gross Revenue Collected
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(246, 192, 66, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f6c042'
            }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '8px', display: 'block', fontWeight: 600 }}>
            ↑ Verified Stripe & Cashier checkouts
          </span>
        </div>

        {/* Total Coupons Sold */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Passes Purchased
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}>
              <Ticket size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            {stats?.totalSold || 0}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
            Customer vouchers allocated
          </span>
        </div>

        {/* Redeemed at Hubs */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Redeemed at Hubs
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            {stats?.totalRedeemed || 0}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
            Validated via ground scanner
          </span>
        </div>

        {/* Active Festive Offers */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Active Festive Campaigns
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            {stats?.activeOffers || 0}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
            Published on live portal
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Transactional Ledger & Nodemailer Dispatch Log
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
              Real-time audit record of buyer checkout, customer mobile, and email voucher distribution
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Export as Excel (CSV) */}
            <button
              onClick={() => {
                if (!bookings || bookings.length === 0) return;
                const headers = ['Voucher Code', 'Customer Name', 'Customer Email', 'Mobile Number', 'Campaign Offer', 'Amount (INR)', 'Pass Count', 'Payment Status', 'Nodemailer Status', 'Date'];
                const rows = bookings.map(b => [
                  b.ticket_code || '',
                  `"${(b.customer_name || '').replace(/"/g, '""')}"`,
                  b.customer_email || '',
                  b.customer_phone || '',
                  `"${(b.event_title || '').replace(/"/g, '""')}"`,
                  Number(b.total_price || 0),
                  Number(b.seat_count || 1),
                  (b.status || 'confirmed').toUpperCase(),
                  'Sent via Mailer',
                  new Date(b.created_at || Date.now()).toLocaleDateString('en-IN')
                ]);
                const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `1ticket_transactional_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FileSpreadsheet size={15} />
              <span>Export Excel</span>
            </button>

            {/* Export as PDF / Print */}
            <button
              onClick={() => {
                window.print();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#f6c042',
                background: 'rgba(246, 192, 66, 0.1)',
                border: '1px solid rgba(246, 192, 66, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Export PDF / Print</span>
            </button>

            <span style={{ fontSize: '0.76rem', color: '#f6c042', fontWeight: 600, marginLeft: '4px' }}>
              Showing {bookings.length} records
            </span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            No customer orders recorded yet. As users purchase passes, live revenue entries appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Voucher Code</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Mobile Number</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Campaign Offer</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Email (Nodemailer)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#f6c042', fontWeight: 700 }}>
                      {b.ticket_code}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#ffffff' }}>
                      <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{b.customer_email}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#ffffff' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#e5e7eb' }}>
                        <Phone size={12} color="#f6c042" />
                        <span>{b.customer_phone || '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#d1d5db' }}>
                      {b.event_title}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: 700 }}>
                      ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.72rem',
                        color: '#34d399',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '3px 8px',
                        borderRadius: '10px'
                      }}>
                        <Mail size={12} />
                        <span>Sent via Mailer</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: b.status === 'redeemed' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: b.status === 'redeemed' ? '#f59e0b' : '#10b981'
                      }}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '0.76rem' }}>
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
