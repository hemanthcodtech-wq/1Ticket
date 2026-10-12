import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  Ticket,
  ShieldCheck,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function VerifiedMembersPrintPage({ bookings = [], user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'name'

  // If coordinator, they can view their own or all
  const isCoordinator = user?.role === 'coordinator';

  // Only consider verified / redeemed bookings
  const verifiedBookings = bookings.filter((b) => {
    if (b.status !== 'redeemed') return false;
    if (isCoordinator && selectedStaff === 'me') {
      return (b.verified_by_email && b.verified_by_email.toLowerCase() === user.email?.toLowerCase()) ||
             (b.verified_by_name && b.verified_by_name.toLowerCase() === user.name?.toLowerCase());
    }
    return true;
  });

  // Extract unique campaigns and verifying staff for filters
  const uniqueOffers = Array.from(new Set(verifiedBookings.map((b) => b.event_title).filter(Boolean)));
  const uniqueStaff = Array.from(new Set(verifiedBookings.map((b) => b.verified_by_name).filter(Boolean)));

  // Filter and Sort
  const filteredList = verifiedBookings
    .filter((b) => {
      const matchesOffer = selectedOffer === 'all' || b.event_title === selectedOffer;
      const matchesStaff = selectedStaff === 'all' || b.verified_by_name === selectedStaff;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
        (b.customer_email && b.customer_email.toLowerCase().includes(q)) ||
        (b.customer_phone && b.customer_phone.includes(q)) ||
        (b.ticket_code && b.ticket_code.toLowerCase().includes(q)) ||
        (b.verified_by_name && b.verified_by_name.toLowerCase().includes(q));

      return matchesOffer && matchesStaff && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return (a.customer_name || '').localeCompare(b.customer_name || '');
      }
      const timeA = new Date(a.redeemed_at || a.created_at || 0).getTime();
      const timeB = new Date(b.redeemed_at || b.created_at || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Calculate stats
  const totalVerifiedMembers = filteredList.length;
  const totalRedeemedValue = filteredList.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Sl No',
      'Voucher Serial Code',
      'Customer Name',
      'Email Address',
      'Mobile Phone',
      'Offer Campaign',
      'Pass Quantity',
      'Amount Paid (INR)',
      'Verified By Staff',
      'Staff Email',
      'Redemption Timestamp',
      'Booking Date'
    ];

    const rows = filteredList.map((b, idx) => [
      idx + 1,
      `"${b.ticket_code || ''}"`,
      `"${b.customer_name || ''}"`,
      `"${b.customer_email || ''}"`,
      `"${b.customer_phone || ''}"`,
      `"${(b.event_title || '').replace(/"/g, '""')}"`,
      b.seat_count || b.quantity || 1,
      Number(b.total_price || 0).toFixed(2),
      `"${b.verified_by_name || 'Staff Member'}"`,
      `"${b.verified_by_email || ''}"`,
      `"${b.redeemed_at ? new Date(b.redeemed_at).toLocaleString('en-IN') : 'N/A'}"`,
      `"${b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `1ticket_verified_members_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          aside, header, .no-print, button, input, select {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print-header {
            display: block !important;
            margin-bottom: 20px !important;
            border-bottom: 2px solid #000 !important;
            padding-bottom: 12px !important;
          }
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
            color: #000000 !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #333 !important;
            padding: 8px 10px !important;
            color: #000000 !important;
            font-size: 10pt !important;
          }
          .print-table th {
            background-color: #f3f4f6 !important;
            font-weight: bold !important;
          }
        }
      `}</style>

      {/* Screen Page Header (Hidden on print) */}
      <div className="no-print" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <CheckCircle2 size={20} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
                Verified Members &amp; Coupons <span className="gold-gradient-text">Print Center</span>
              </h2>
            </div>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.86rem' }}>
              Official verified registry of attendees and coupons redeemed at partner counters and event booths.
            </p>
          </div>

          {/* Action Buttons: Print & Download CSV */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e5e7eb',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f6c042'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#e5e7eb'; }}
            >
              <FileSpreadsheet size={16} color="#34d399" />
              <span>Download CSV Report</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                fontSize: '0.86rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(246, 192, 66, 0.25)'
              }}
            >
              <Printer size={16} />
              <span>Print Official Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights (Hidden on print) */}
      <div className="no-print" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '14px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(52, 211, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Verified Passes
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '2px 0 0', fontWeight: 800 }}>
              {totalVerifiedMembers} <span style={{ fontSize: '0.84rem', color: '#34d399', fontWeight: 600 }}>Guests</span>
            </h3>
          </div>
        </div>

        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '14px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(246, 192, 66, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6c042'
          }}>
            <Ticket size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Redeemed Gross Value
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '2px 0 0', fontWeight: 800 }}>
              ₹{totalRedeemedValue.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d1d5db'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verifying Staff Active
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '2px 0 0', fontWeight: 800 }}>
              {uniqueStaff.length} <span style={{ fontSize: '0.84rem', color: '#9ca3af', fontWeight: 500 }}>Coordinators</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar (Hidden on print) */}
      <div className="no-print" style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
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
          maxWidth: '420px'
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by attendee, voucher code, or staff..."
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

        {/* Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Campaign Filter */}
          <select
            value={selectedOffer}
            onChange={(e) => setSelectedOffer(e.target.value)}
            style={{
              background: '#151922',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}
          >
            <option value="all">All Campaign Offers</option>
            {uniqueOffers.map((off) => (
              <option key={off} value={off}>{off}</option>
            ))}
          </select>

          {/* Staff Filter */}
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            style={{
              background: '#151922',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}
          >
            <option value="all">All Verifying Staff</option>
            {uniqueStaff.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              background: '#151922',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}
          >
            <option value="newest">Recently Verified First</option>
            <option value="oldest">Earliest Verified First</option>
            <option value="name">Attendee Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* PRINT-FRIENDLY & ON-SCREEN TABLE CONTAINER */}
      <div className="print-container" style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Printable Official Header (Shows when printed) */}
        <div className="print-header" style={{ display: 'none', padding: '16px 20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 800 }}>1TICKET OFFICIAL VERIFIED MEMBERS ROSTER</h1>
          <p style={{ margin: '4px 0 0', fontSize: '10pt', color: '#555' }}>
            Generated on: {new Date().toLocaleString('en-IN')} • Total Verified Attendees: {totalVerifiedMembers} • Gross Value: ₹{totalRedeemedValue.toLocaleString('en-IN')}
          </p>
        </div>

        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <CheckCircle2 size={42} color="#6b7280" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h4 style={{ color: '#ffffff', margin: '0 0 6px', fontSize: '1.05rem' }}>No Verified Members Found</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#9ca3af' }}>
              No coupons have been marked as redeemed matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#9ca3af',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Voucher Serial</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Attendee / Customer</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Contact Details</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Offer Campaign</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Verified By</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Redemption Time</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((b, idx) => (
                  <tr
                    key={b.id || idx}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.78rem' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#f6c042', fontWeight: 800 }}>
                      {b.ticket_code}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: 600 }}>
                      {b.customer_name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#d1d5db', fontSize: '0.78rem' }}>
                      <div>{b.customer_email}</div>
                      <div style={{ color: '#9ca3af' }}>{b.customer_phone || '—'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff' }}>
                      <div style={{ fontWeight: 600 }}>{b.event_title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        Qty: {b.seat_count || b.quantity || 1}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: 800 }}>
                      ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#f6c042', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} />
                          {b.verified_by_name || 'Staff Member'}
                        </span>
                        {b.verified_by_email && (
                          <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                            {b.verified_by_email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#d1d5db', fontSize: '0.78rem' }}>
                      {b.redeemed_at ? (
                        <div>
                          <div>{new Date(b.redeemed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                            {new Date(b.redeemed_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        'Recorded'
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={12} />
                        VERIFIED
                      </span>
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
