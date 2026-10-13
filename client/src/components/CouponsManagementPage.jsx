import React, { useState } from 'react';
import {
  Ticket,
  PlusCircle,
  Trash2,
  Edit3,
  Calendar,
  IndianRupee,
  Upload,
  AlertCircle,
  Tag,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function CouponsManagementPage({
  coupons = [],
  onCreateCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  user,
  token
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Villas',
    offer_type: 'Lucky Draw',
    price: 999,
    original_price: 2500,
    badge: 'DURGASHTAMI SPECIAL',
    venue: 'Palm Luxury Enclave',
    location: 'Bangalore / Regional',
    event_date: '2026-11-30',
    total_seats: 500,
    image_url: '/coupons/lucky_dip_villa.jpg'
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: null, message: '' });
  const [imagePreview, setImagePreview] = useState('/coupons/lucky_dip_villa.jpg');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingCouponId(null);
    setUploadStatus({ type: null, message: '' });
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'Villas',
      offer_type: 'Lucky Draw',
      price: 999,
      original_price: 2500,
      badge: 'DURGASHTAMI SPECIAL',
      venue: 'Palm Luxury Enclave',
      location: 'Bangalore / Regional',
      event_date: '2026-11-30',
      total_seats: 500,
      image_url: '/coupons/lucky_dip_villa.jpg'
    });
    setImagePreview('/coupons/lucky_dip_villa.jpg');
    setIsModalOpen(true);
  };

  // Open Edit Modal with prefilled coupon data
  const handleOpenEditModal = (coupon) => {
    setModalMode('edit');
    setEditingCouponId(coupon.id);
    setUploadStatus({ type: null, message: '' });
    setFormData({
      title: coupon.title || '',
      subtitle: coupon.subtitle || '',
      description: coupon.description || '',
      category: coupon.category || 'Villas',
      offer_type: coupon.offer_type || 'Lucky Draw',
      price: Number(coupon.price) || 0,
      original_price: Number(coupon.original_price) || 0,
      badge: coupon.badge || 'DURGASHTAMI SPECIAL',
      venue: coupon.venue || 'Palm Luxury Enclave',
      location: coupon.location || 'Bangalore / Regional',
      event_date: coupon.event_date ? coupon.event_date.slice(0, 10) : '2026-11-30',
      total_seats: Number(coupon.total_seats) || 500,
      image_url: coupon.image_url || '/coupons/lucky_dip_villa.jpg'
    });
    setImagePreview(coupon.image_url || '/coupons/lucky_dip_villa.jpg');
    setIsModalOpen(true);
  };

  // Multer Image Upload Handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setUploadStatus({ type: null, message: '' });

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('image', file);

      // Pass Authorization header with Bearer token
      const authToken = token || localStorage.getItem('1ticket_token');
      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers,
        body: data
      });

      const json = await res.json();
      if (json.success && json.imageUrl) {
        setFormData((prev) => ({ ...prev, image_url: json.imageUrl }));
        setImagePreview(json.imageUrl);
        setUploadStatus({
          type: 'success',
          message: json.provider === 'cloudinary'
            ? 'Uploaded to Cloudinary CDN successfully!'
            : 'Uploaded to server storage successfully!'
        });
      } else {
        const errorMsg = json.error || 'Failed to upload image. Please try again.';
        setUploadStatus({ type: 'error', message: `Upload failed: ${errorMsg}` });
      }
    } catch (err) {
      console.error('Multer image upload error:', err);
      setUploadStatus({ type: 'error', message: `Upload error: ${err.message || 'Network error'}` });
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler (Create vs Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (uploadingImage) {
      alert('Please wait for the image upload to Cloudinary to complete before saving.');
      return;
    }
    setIsSaving(true);
    try {
      if (modalMode === 'edit' && editingCouponId) {
        if (onUpdateCoupon) {
          await onUpdateCoupon(editingCouponId, formData);
        }
      } else {
        if (onCreateCoupon) {
          await onCreateCoupon(formData);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving coupon campaign:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category?.toLowerCase() === categoryFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      c.title?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(coupons.map(c => c.category).filter(Boolean)));

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
            Passes & Festive <span className="gold-gradient-text">Offers Management</span>
          </h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
            Create, edit details, upload graphics via Multer, manage quotas, or archive offers
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenCreateModal}
            className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={16} />
            <span>Create New Pass Offer</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: '#0d1017',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search campaigns by title, location or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.86rem',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={14} color="#9ca3af" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              background: '#131722',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#d1d5db',
              fontSize: '0.82rem'
            }}
          >
            <option value="all">All Categories ({coupons.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
        <div style={{
          background: '#0d1017',
          border: '1px dashed rgba(212, 175, 55, 0.3)',
          borderRadius: '14px',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <Ticket size={40} color="#f6c042" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', margin: '0 0 6px' }}>No Matching Passes Found</h4>
          <p style={{ fontSize: '0.84rem' }}>Try refining your search keyword or category filter.</p>
        </div>
      )}

      {/* Coupons Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '22px'
      }}>
        {filteredCoupons.map((c) => (
          <div
            key={c.id}
            style={{
              background: '#0d1017',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
            }}
          >
            {/* Banner Image */}
            <div style={{ height: '175px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src={c.image_url}
                alt={c.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(246, 192, 66, 0.4)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                color: '#f6c042',
                fontWeight: 700
              }}>
                {c.badge || 'FESTIVE OFFER'}
              </div>

              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                color: '#34d399',
                fontWeight: 600
              }}>
                {c.offer_type}
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Tag size={12} color="#f6c042" />
                <span style={{ fontSize: '0.72rem', color: '#f6c042', fontWeight: 600, textTransform: 'uppercase' }}>
                  {c.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: '0 0 6px', fontWeight: 700, lineHeight: 1.3 }}>
                {c.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: '#9ca3af', marginBottom: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#f6c042" />
                  {c.location || 'Regional'}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} color="#f6c042" />
                  {c.event_date?.slice(0, 10)}
                </span>
              </div>

              <p style={{
                fontSize: '0.78rem',
                color: '#9ca3af',
                margin: '0 0 14px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.45
              }}>
                {c.description}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#9ca3af', display: 'block' }}>PASS PRICE</span>
                    <span style={{ fontSize: '1.18rem', fontWeight: 800, color: '#f6c042' }}>
                      ₹{Number(c.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        style={{
                          background: 'rgba(246, 192, 66, 0.12)',
                          border: '1px solid rgba(246, 192, 66, 0.35)',
                          color: '#f6c042',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(246, 192, 66, 0.22)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(246, 192, 66, 0.12)'}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteCoupon(c.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#ffffff', fontWeight: 700 }}>
                  {modalMode === 'edit' ? 'Edit Pass Campaign' : 'Create New Pass Campaign'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  {modalMode === 'edit'
                    ? 'Update offer pricing, description, quota, or banner graphic'
                    : 'Multer image uploads & Postgres synchronization'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '24px' }}>
              {/* Multer Image Upload Box */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>
                  Pass Banner Image (Cloudinary CDN / Multer)
                </label>
                <div style={{
                  border: '2px dashed rgba(212, 175, 55, 0.4)',
                  borderRadius: '10px',
                  padding: '16px',
                  background: '#10141f',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '90px',
                    height: '60px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#090b10',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                  }}>
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/coupons/lucky_dip_villa.jpg';
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(246, 192, 66, 0.15)',
                        border: '1px solid rgba(246, 192, 66, 0.4)',
                        color: '#f6c042',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        opacity: uploadingImage ? 0.7 : 1
                      }}>
                        {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                          disabled={uploadingImage}
                        />
                      </label>

                      {formData.image_url?.includes('cloudinary.com') && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          color: '#4ade80',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 500
                        }}>
                          <CheckCircle2 size={12} /> Cloudinary CDN Active
                        </span>
                      )}
                    </div>

                    {uploadStatus.message && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: uploadStatus.type === 'success' ? '#4ade80' : '#f87171'
                      }}>
                        {uploadStatus.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        <span>{uploadStatus.message}</span>
                      </div>
                    )}

                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginTop: '6px' }}>
                      Supports PNG, JPG, WEBP. Uploads directly to Cloudinary CDN via Multer storage.
                    </span>
                  </div>
                </div>

                {/* Direct Image URL input for verification / manual URL */}
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#9ca3af', marginBottom: '4px' }}>
                    Banner Image URL (Cloudinary CDN link or image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, image_url: val }));
                      if (val) setImagePreview(val);
                    }}
                    placeholder="https://res.cloudinary.com/..."
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Campaign Offer Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lucky Dip Villa Pass"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Short Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stand a chance to win a world-class luxury contemporary smart villa"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                  Detailed Description *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the redemption terms, lucky dip dates, or booking waiver inclusions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#151922',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Category & Offer Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="Villas">Villas</option>
                    <option value="Plots & Land">Plots & Land</option>
                    <option value="Villas & Cars">Villas & Cars</option>
                    <option value="Heritage Crafts">Heritage Crafts</option>
                    <option value="Concerts & Gala">Concerts & Gala</option>
                    <option value="Luxury Dining">Luxury Dining</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Offer Type
                  </label>
                  <select
                    value={formData.offer_type}
                    onChange={(e) => setFormData({ ...formData, offer_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="Lucky Draw">Lucky Draw</option>
                    <option value="Booking Benefits">Booking Benefits</option>
                    <option value="Bumper Draw">Bumper Draw</option>
                    <option value="Complimentary Gift">Complimentary Gift</option>
                    <option value="Flat Discount">Flat Discount</option>
                    <option value="Masterclass Pass">Masterclass Pass</option>
                  </select>
                </div>
              </div>

              {/* Price, Original Worth, Total Pass Quota */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Pass Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Original Worth (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Total Pass Quota
                  </label>
                  <input
                    type="number"
                    value={formData.total_seats}
                    onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              {/* Location, Venue, Expiry Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore / Regional"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    Redemption Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#151922',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="btn-gold-outline"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    opacity: isSaving ? 0.6 : 1,
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingImage}
                  className="btn-gold"
                  style={{
                    padding: '9px 24px',
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: (isSaving || uploadingImage) ? 0.75 : 1,
                    cursor: (isSaving || uploadingImage) ? 'not-allowed' : 'pointer',
                    boxShadow: isSaving ? 'none' : '0 4px 14px rgba(246, 192, 66, 0.25)'
                  }}
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  <span>
                    {isSaving
                      ? (modalMode === 'edit' ? 'Saving Changes...' : 'Publishing Offer...')
                      : (uploadingImage
                        ? 'Uploading Graphic...'
                        : (modalMode === 'edit' ? 'Save Changes' : 'Create & Publish Offer'))}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
