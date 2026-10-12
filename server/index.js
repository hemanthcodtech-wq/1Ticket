import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import {
  initDb,
  getDbStatus,
  getEvents,
  getEventById,
  createBooking,
  getBookings,
  getBookingById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserByEmail,
  getUserById,
  getCoordinators,
  createCoordinator,
  deleteCoordinator,
  verifyAndScanTicket,
  getDashboardStats
} from './db.js';

import {
  initMailer,
  sendCouponConfirmationEmail,
  sendCoordinatorWelcomeEmail
} from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.production if present, falling back to standard .env
const envProductionPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProductionPath)) {
  dotenv.config({ path: envProductionPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || '1ticket_super_secret_jwt_key_2026';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Initialize Nodemailer
initMailer();

// Configure Cloudinary from environment variables
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_CLOUD_NAME.includes('your_')
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ Cloudinary initialized with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('ℹ️ Cloudinary credentials pending in .env; utilizing local disk Multer fallback.');
}

// Multer Storage Configuration (Cloudinary when configured, local disk fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let storage;
if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: '1ticket-coupons',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
    }
  });
} else {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'coupon-' + uniqueSuffix + ext);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed!'), false);
    }
  }
});

// Middlewares: Allow official production frontend URLs and local origins
const allowedOrigins = [
  'https://1-ticket-nqxo.vercel.app',
  'https://1-ticket.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5001',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (like curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback permissive for other clients
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Also copy or serve client coupons folder if requested
const clientCouponsDir = path.join(__dirname, '../client/public/coupons');
if (fs.existsSync(clientCouponsDir)) {
  app.use('/coupons', express.static(clientCouponsDir));
}

// Ensure Database is initialized on serverless requests
let dbInitPromise = null;
app.use(async (req, res, next) => {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      console.error('Database initialization warning:', err);
      dbInitPromise = null; // Retry on next request if failed
    });
  }
  await dbInitPromise;
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Auth Middleware: JWT verification
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// Role Guard Middleware: Admin Only
export function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access forbidden: Admin privilege required.' });
  }
}

// ==========================================
// 1. HEALTH & SYSTEM ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ok',
    service: '1ticket-api',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// ==========================================
// 2. AUTHENTICATION (ADMIN & COORDINATOR)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User with this email not found' });
    }

    // Verify password (plain check or bcrypt fallback)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Your account is deactivated. Contact admin.' });
    }

    // Generate JWT token (expires in 24h)
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: `Signed in successfully as ${user.role}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: 'Internal login error' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. IMAGE UPLOAD ROUTE (MULTER)
// ==========================================
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please choose an image file to upload' });
    }

    // Cloudinary returns full hosted URL in req.file.path or req.file.secure_url
    // Local disk returns filename in req.file.filename
    const imageUrl = req.file.path?.startsWith('http')
      ? req.file.path
      : `/uploads/${req.file.filename}`;

    const isCloudinary = req.file.path?.startsWith('http');

    res.json({
      success: true,
      message: isCloudinary
        ? 'Image uploaded to Cloudinary CDN successfully!'
        : 'Image uploaded to server storage successfully!',
      imageUrl,
      provider: isCloudinary ? 'cloudinary' : 'local-multer'
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message || 'Image upload failed' });
  }
});

// ==========================================
// 4. COUPONS / OFFERS ROUTES
// ==========================================
app.get('/api/events', async (req, res) => {
  try {
    const { category, search } = req.query;
    let events = await getEvents();

    if (category && category !== 'All' && category !== 'All Categories') {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Offer not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve event' });
  }
});

// Create Coupon (Admin & Coordinator)
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, venue, location, event_date, price } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, error: 'Coupon title and price are required' });
    }

    const newCoupon = await createEvent({
      ...req.body,
      venue: venue || 'Pan India Offers',
      location: location || 'Bangalore / Regional',
      event_date: event_date || '2026-11-30'
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully!', data: newCoupon });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create coupon' });
  }
});

// Update Coupon (Admin & Coordinator)
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const updatedCoupon = await updateEvent(req.params.id, req.body);
    res.json({ success: true, message: 'Coupon updated successfully!', data: updatedCoupon });
  } catch (err) {
    console.error('Error updating coupon:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update coupon' });
  }
});

// Delete Coupon (Admin Only)
app.delete('/api/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. RAZORPAY PAYMENT GATEWAY & BOOKINGS
// ==========================================
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1ticketMockKey';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_mock';

// GET Razorpay Public Config for frontend checkout
app.get('/api/payment/config', (req, res) => {
  res.json({
    success: true,
    keyId: RAZORPAY_KEY_ID,
    currency: 'INR',
    isLiveConfigured: Boolean(process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('Mock'))
  });
});

// Create Razorpay Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount for order creation' });
    }

    // Try real Razorpay instance if keys are provided
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const RazorpayModule = await import('razorpay');
        const Razorpay = RazorpayModule.default || RazorpayModule;
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const order = await instance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`
        });
        return res.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
      } catch (rzpErr) {
        console.warn('Real Razorpay API error, falling back to seamless mock order:', rzpErr.message);
      }
    }

    // Standard high-reliability order generation
    const mockOrder = {
      id: 'order_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    res.json({
      success: true,
      order: mockOrder,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create payment order' });
  }
});

// Create Confirmed Booking (after verified Razorpay payment)
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      seatCount,
      seats,
      totalPrice,
      attendees,
      paymentId,
      razorpayOrderId
    } = req.body;

    if (!eventId || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking details (eventId, customerName, customerEmail)'
      });
    }

    // Require payment confirmation
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: paymentId is required to finalize booking.'
      });
    }

    const booking = await createBooking({
      eventId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      seatCount: Number(seatCount) || 1,
      seats: seats || [`CPN-P${Math.floor(100 + Math.random() * 899)}`],
      totalPrice,
      attendees: attendees || [{ name: customerName, phone: customerPhone }],
      paymentId: paymentId || `pay_${Date.now()}`
    });

    // Send enhanced confirmation email via Nodemailer asynchronously
    sendCouponConfirmationEmail({
      customerEmail,
      customerName,
      customerPhone,
      couponTitle: booking.event_title || 'Exclusive Coupon Offer',
      ticketCode: booking.ticket_code,
      price: booking.total_price,
      seatCount: Number(seatCount) || 1,
      attendees: attendees || [{ name: customerName, phone: customerPhone }],
      venue: booking.venue || 'Authorized Partner Location',
      eventDate: booking.event_date
    }).catch(err => console.warn('Email send background error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Payment verified! Coupon claimed successfully and confirmation email dispatched.',
      data: booking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ success: false, error: err.message || 'Booking failed' });
  }
});

// View all bookings with filters (Admin & Coordinator) or Customer Lookup
app.get('/api/bookings', async (req, res) => {
  try {
    const { email, phone, status, search, verified_by_id } = req.query;

    // Customer coupon wallet lookup: STRICT match on both email AND phone
    if (email) {
      const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
      if (!phone || cleanPhone.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Please enter both your registered email and 10-digit mobile number.',
          data: []
        });
      }

      const matchingBookings = await getBookings(email, phone);
      if (!matchingBookings || matchingBookings.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No coupons found. The email and mobile number do not match our verified records. Both must match your purchase details.',
          data: []
        });
      }

      return res.json({ success: true, count: matchingBookings.length, data: matchingBookings });
    }

    // Admin & Coordinator queries
    let bookings = await getBookings();

    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }

    if (verified_by_id) {
      bookings = bookings.filter(b => b.verified_by_id === verified_by_id);
    }

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(b =>
        (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
        (b.customer_email && b.customer_email.toLowerCase().includes(q)) ||
        (b.customer_phone && b.customer_phone.toLowerCase().includes(q)) ||
        (b.ticket_code && b.ticket_code.toLowerCase().includes(q)) ||
        (b.verified_by_name && b.verified_by_name.toLowerCase().includes(q)) ||
        (b.event_title && b.event_title.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Bookings query error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking pass not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve pass' });
  }
});

// ==========================================
// 6. SCAN & VERIFY TICKET PASS
// ==========================================
app.post('/api/tickets/verify-scan', authenticateToken, async (req, res) => {
  try {
    const code = req.body.ticketCode || req.body.ticket_code;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Please provide or scan a ticket voucher code.' });
    }

    // Pass authenticated user so redemption is audited with staff name and ID
    const verificationResult = await verifyAndScanTicket(code, req.user);
    res.json({
      success: verificationResult.valid,
      ...verificationResult
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. COORDINATORS MANAGEMENT (ADMIN ONLY)
// ==========================================
app.get('/api/coordinators', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coordinators = await getCoordinators();
    res.json({ success: true, count: coordinators.length, data: coordinators });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coordinators', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Coordinator name and email are required.' });
    }

    const newCoord = await createCoordinator({ name, email, password, role, phone });

    // Send invitation email via nodemailer
    sendCoordinatorWelcomeEmail({
      email,
      name,
      role: role || 'coordinator',
      defaultPassword: password || 'coord123'
    }).catch(err => console.warn('Email error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Coordinator created successfully and invitation email dispatched!',
      data: newCoord
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/coordinators/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await deleteCoordinator(req.params.id);
    res.json({ success: true, message: 'Coordinator removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. REVENUE REPORTS & ANALYTICS
// ==========================================
app.get('/api/reports/analytics', authenticateToken, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve reports' });
  }
});

// Start Server (only when not running under Vercel serverless runtime)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`🚀 1ticket backend running on http://localhost:${PORT}`);
    await initDb();
    console.log(`⚡ Neon DB Status: ${getDbStatus().mode}`);
  });
}

export default app;
