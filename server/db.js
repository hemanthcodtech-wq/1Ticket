import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
let sql = null;
let isNeonConnected = false;

// Sample seed exclusive coupons matching reference design
const SEED_EVENTS = [
  {
    id: 'coupon-1',
    title: 'Lucky Dip Villa Pass',
    subtitle: 'Your chance to win a dream villa with a special lucky draw pass.',
    description: 'Enter the grand Durgashtami festive lucky dip! Secure your exclusive pass for an opportunity to own a world-class luxury contemporary smart villa with private pool, landscaped gardens, and high-end interiors.',
    badge: 'DURGASHTAMI SPECIAL',
    category: 'Villas',
    offer_type: 'Lucky Draw',
    venue: 'Palm Luxury Enclave',
    location: 'Bangalore / Hyderabad',
    event_date: '2026-10-30',
    event_time: '18:00',
    price: 999,
    original_price: 2500,
    total_seats: 500,
    available_seats: 382,
    image_url: '/coupons/lucky_dip_villa.jpg',
    tags: ['Villa', 'Lucky Dip', 'Durgashtami Special', 'Luxury Homes']
  },
  {
    id: 'coupon-2',
    title: 'Villa Booking Benefit',
    subtitle: 'Book your dream villa and get exclusive booking benefits.',
    description: 'Avail exclusive festive waivers up to ₹5,00,000 on registration, customized modular Italian kitchen fittings, and 2 years of complimentary clubhouse membership upon booking your villa lot this festive week.',
    badge: 'DURGASHTAMI SPECIAL',
    category: 'Plots & Land',
    offer_type: 'Booking Benefit',
    venue: 'Green Meadows Reserve',
    location: 'Airport Corridor, North Hub',
    event_date: '2026-11-15',
    event_time: '10:00',
    price: 499,
    original_price: 1500,
    total_seats: 250,
    available_seats: 184,
    image_url: '/coupons/villa_plot.jpg',
    tags: ['Land Plots', 'Villa Booking', 'Festive Offer', 'Cashback']
  },
  {
    id: 'coupon-3',
    title: 'Book a Villa & Win a Baleno',
    subtitle: 'Book your villa and stand a chance to win a brand new Baleno car.',
    description: 'Grand festive bumper reward! Every confirmed villa booking voucher automatically enters the mega bumper draw to drive home a brand-new Nexa Blue Maruti Suzuki Baleno hatchback with zero down-payment hassles.',
    badge: 'DURGASHTAMI SPECIAL',
    category: 'Villas & Cars',
    offer_type: 'Bumper Draw',
    venue: 'Royal Palm Estates',
    location: 'Financial District Gateway',
    event_date: '2026-11-25',
    event_time: '19:30',
    price: 1499,
    original_price: 3500,
    total_seats: 300,
    available_seats: 215,
    image_url: '/coupons/baleno_car.jpg',
    tags: ['Automobile', 'Villa', 'Nexa Baleno', 'Bumper Prize']
  },
  {
    id: 'coupon-4',
    title: 'House Construction Offer',
    subtitle: 'Build your dream home at a special rate with an exclusive per sq.ft offer.',
    description: 'Turnkey architectural luxury house construction packages at an unbeatable locked-in rate of ₹1,850/sq.ft including premium German sanitaryware, structural warranty of 10 years, and milestone-based transparent escrow.',
    badge: 'DURGASHTAMI SPECIAL',
    category: 'Construction',
    offer_type: 'Discount Offer',
    venue: 'Metro Construction Studios',
    location: 'Pan India / South Region',
    event_date: '2026-12-01',
    event_time: '11:00',
    price: 799,
    original_price: 2000,
    total_seats: 400,
    available_seats: 310,
    image_url: '/coupons/house_construction.jpg',
    tags: ['Construction', 'Architecture', 'Per Sq.Ft Deal', 'Turnkey']
  },
  {
    id: 'coupon-5',
    title: 'Tanjore Cloth Painting + Free Kit',
    subtitle: 'Learn the traditional art with a free training kit.',
    description: 'Celebrate Indian heritage with a masterclass in classic Tanjore gold leaf foil cloth painting of Goddess Durga / Lakshmi. Includes a complimentary professional starter kit: 22k genuine gold foils, Arabic gum, pigments, and teak wood frame.',
    badge: 'FESTIVE ART',
    category: 'Heritage & Art',
    offer_type: 'Workshop & Kit',
    venue: 'Heritage Cultural Center',
    location: 'Cultural Arts Quarter',
    event_date: '2026-11-10',
    event_time: '15:00',
    price: 299,
    original_price: 1200,
    total_seats: 150,
    available_seats: 64,
    image_url: '/coupons/tanjore_painting.jpg',
    tags: ['Traditional Art', 'Tanjore Painting', 'DIY Kit', 'Heritage']
  }
];

// In-memory fallback storage
let memoryEvents = JSON.parse(JSON.stringify(SEED_EVENTS));
let memoryBookings = [];
let memoryUsers = [
  {
    id: 'usr-admin-1',
    name: 'Super Administrator',
    email: 'admin@1ticket.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98888 11111',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-coord-1',
    name: 'Bangalore Coordinator',
    email: 'coordinator@1ticket.com',
    password: 'coord123',
    role: 'coordinator',
    phone: '+91 97777 22222',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

export async function initDb() {
  if (DATABASE_URL && !DATABASE_URL.includes('xxxx')) {
    try {
      sql = neon(DATABASE_URL);
      // Test connectivity
      const test = await sql`SELECT 1 as connected`;
      if (test && test.length > 0) {
        isNeonConnected = true;
        console.log('✅ Successfully connected to Neon PostgreSQL database!');

        // Create tables if not exists
        await sql`
          CREATE TABLE IF NOT EXISTS events (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(64) NOT NULL,
            venue VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            event_date DATE NOT NULL,
            event_time VARCHAR(32) NOT NULL,
            price NUMERIC(10, 2) NOT NULL DEFAULT 0,
            total_seats INT NOT NULL DEFAULT 100,
            available_seats INT NOT NULL DEFAULT 100,
            image_url TEXT,
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // Ensure extra columns for coupons exist on events table
        try {
          await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS subtitle TEXT;`;
          await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS badge VARCHAR(64);`;
          await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS offer_type VARCHAR(64);`;
          await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);`;
        } catch (e) {
          console.warn('Note on events table columns migration:', e.message);
        }

        await sql`
          CREATE TABLE IF NOT EXISTS bookings (
            id VARCHAR(64) PRIMARY KEY,
            event_id VARCHAR(64) REFERENCES events(id) ON DELETE CASCADE,
            customer_name VARCHAR(255) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(32),
            seat_count INT NOT NULL DEFAULT 1,
            seats TEXT[],
            total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
            ticket_code VARCHAR(64) UNIQUE NOT NULL,
            status VARCHAR(32) DEFAULT 'confirmed',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // Ensure customer_phone and verification audit columns exist on bookings table
        try {
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(32);`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS attendees JSONB;`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_id VARCHAR(128);`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS verified_by_id VARCHAR(64);`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS verified_by_name VARCHAR(255);`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS verified_by_email VARCHAR(255);`;
          await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS redeemed_at TIMESTAMP WITH TIME ZONE;`;
          // Backfill any existing bookings that have null or empty phone
          await sql`UPDATE bookings SET customer_phone = '9876543210' WHERE customer_phone IS NULL OR customer_phone = '';`;
        } catch (e) {
          console.warn('Note on bookings table columns migration:', e.message);
        }

        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(32) NOT NULL DEFAULT 'coordinator',
            phone VARCHAR(32),
            status VARCHAR(32) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // Check if users exist; if not, seed default admin & coordinator
        const existingUsers = await sql`SELECT COUNT(*)::int as count FROM users`;
        if (existingUsers[0].count === 0) {
          console.log('🌱 Seeding initial admin and coordinator to Neon database...');
          await sql`
            INSERT INTO users (id, name, email, password, role, phone, status)
            VALUES 
              ('usr-admin-1', 'Super Administrator', 'admin@1ticket.com', 'admin123', 'admin', '+91 98888 11111', 'active'),
              ('usr-coord-1', 'Bangalore Coordinator', 'coordinator@1ticket.com', 'coord123', 'coordinator', '+91 97777 22222', 'active');
          `;
          console.log('✅ Default users seeded in Neon!');
        }
        const existingEvents = await sql`SELECT COUNT(*)::int as count FROM events`;
        if (existingEvents[0].count === 0) {
          console.log('🌱 Seeding initial events to Neon database...');
          for (const ev of SEED_EVENTS) {
            await sql`
              INSERT INTO events (id, title, description, category, venue, location, event_date, event_time, price, total_seats, available_seats, image_url, tags)
              VALUES (${ev.id}, ${ev.title}, ${ev.description}, ${ev.category}, ${ev.venue}, ${ev.location}, ${ev.event_date}, ${ev.event_time}, ${ev.price}, ${ev.total_seats}, ${ev.available_seats}, ${ev.image_url}, ${ev.tags})
            `;
          }
          console.log('✅ Seeding complete in Neon!');
        }
        return { isNeon: true };
      }
    } catch (err) {
      console.warn('⚠️ Neon connection attempt failed, switching to memory mock fallback:', err.message);
      isNeonConnected = false;
    }
  } else {
    console.log('ℹ️ No valid DATABASE_URL provided. Running with in-memory store (Ready for Neon when configured).');
    isNeonConnected = false;
  }
  return { isNeon: false };
}

export function getDbStatus() {
  return {
    isNeon: isNeonConnected,
    mode: isNeonConnected ? 'neon-postgres' : 'in-memory-mock',
    message: isNeonConnected
      ? 'Connected to Neon Serverless PostgreSQL'
      : 'Running in demo mode. Add DATABASE_URL to server/.env to sync with Neon cloud.'
  };
}

export async function getEvents() {
  if (isNeonConnected && sql) {
    const rows = await sql`SELECT * FROM events ORDER BY event_date ASC`;
    return rows;
  }
  return memoryEvents;
}

export async function getEventById(id) {
  if (isNeonConnected && sql) {
    const rows = await sql`SELECT * FROM events WHERE id = ${id}`;
    return rows[0] || null;
  }
  return memoryEvents.find(e => e.id === id) || null;
}

export async function createBooking({
  eventId,
  customerName,
  customerEmail,
  customerPhone,
  seatCount = 1,
  seats = [],
  totalPrice,
  attendees = [],
  paymentId = null
}) {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  if (event.available_seats < seatCount) {
    throw new Error(`Only ${event.available_seats} seats remaining`);
  }

  const bookingId = 'bk-' + Math.random().toString(36).substring(2, 9);
  const ticketCode = '1TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
  const calculatedTotal = totalPrice || (Number(event.price) * seatCount);
  const attendeesJson = JSON.stringify(attendees || []);

  if (isNeonConnected && sql) {
    await sql`UPDATE events SET available_seats = available_seats - ${seatCount} WHERE id = ${eventId}`;
    try {
      const result = await sql`
        INSERT INTO bookings (id, event_id, customer_name, customer_email, customer_phone, seat_count, seats, total_price, ticket_code, attendees, payment_id, status)
        VALUES (${bookingId}, ${eventId}, ${customerName}, ${customerEmail}, ${customerPhone || ''}, ${seatCount}, ${seats || []}, ${calculatedTotal}, ${ticketCode}, ${attendeesJson}::jsonb, ${paymentId}, 'confirmed')
        RETURNING *
      `;
      const booking = result[0];
      return { ...booking, event_title: event.title, event_date: event.event_date, event_time: event.event_time, venue: event.venue, image_url: event.image_url };
    } catch (colErr) {
      console.warn('Fallback inserting booking:', colErr.message);
      const result = await sql`
        INSERT INTO bookings (id, event_id, customer_name, customer_email, customer_phone, seat_count, seats, total_price, ticket_code, status)
        VALUES (${bookingId}, ${eventId}, ${customerName}, ${customerEmail}, ${customerPhone || ''}, ${seatCount}, ${seats || []}, ${calculatedTotal}, ${ticketCode}, 'confirmed')
        RETURNING *
      `;
      const booking = result[0];
      return { ...booking, customer_phone: customerPhone, attendees, payment_id: paymentId, event_title: event.title, event_date: event.event_date, event_time: event.event_time, venue: event.venue, image_url: event.image_url };
    }
  } else {
    event.available_seats -= seatCount;
    const newBooking = {
      id: bookingId,
      event_id: eventId,
      event_title: event.title,
      event_date: event.event_date,
      event_time: event.event_time,
      venue: event.venue,
      image_url: event.image_url,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      seat_count: seatCount,
      seats: seats || [],
      total_price: calculatedTotal,
      ticket_code: ticketCode,
      attendees: attendees || [],
      payment_id: paymentId,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    memoryBookings.unshift(newBooking);
    return newBooking;
  }
}

export async function getBookings(emailOrQuery, phone) {
  if (isNeonConnected && sql) {
    if (emailOrQuery && phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const last10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
      const cleanEmail = emailOrQuery.trim().toLowerCase();

      // STRICT MATCH: Both email AND phone must match!
      return await sql`
        SELECT b.*, e.title as event_title, e.event_date, e.event_time, e.venue, e.location, e.image_url
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE LOWER(TRIM(b.customer_email)) = ${cleanEmail}
          AND RIGHT(REGEXP_REPLACE(COALESCE(b.customer_phone, ''), '[^0-9]', '', 'g'), 10) = ${last10}
        ORDER BY b.created_at DESC
      `;
    }
    if (emailOrQuery) {
      // Customer lookup without phone is disallowed to maintain privacy
      return [];
    }
    return await sql`
      SELECT b.*, e.title as event_title, e.event_date, e.event_time, e.venue, e.location, e.image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      ORDER BY b.created_at DESC
    `;
  }

  if (emailOrQuery && phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const last10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
    const cleanEmail = emailOrQuery.trim().toLowerCase();

    return memoryBookings.filter(b => {
      const emailMatches = (b.customer_email || '').trim().toLowerCase() === cleanEmail;
      const bPhoneClean = (b.customer_phone || '').replace(/[^0-9]/g, '');
      const bPhoneLast10 = bPhoneClean.length >= 10 ? bPhoneClean.slice(-10) : bPhoneClean;
      const phoneMatches = Boolean(last10) && Boolean(bPhoneLast10) && (bPhoneLast10 === last10);
      return emailMatches && phoneMatches;
    });
  }

  if (emailOrQuery) {
    return [];
  }
  return memoryBookings;
}

export async function getBookingById(id) {
  if (isNeonConnected && sql) {
    const rows = await sql`
      SELECT b.*, e.title as event_title, e.event_date, e.event_time, e.venue, e.location, e.image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ${id} OR b.ticket_code = ${id}
    `;
    return rows[0] || null;
  }
  return memoryBookings.find(b => b.id === id || b.ticket_code === id) || null;
}

export async function createEvent(eventData) {
  const id = 'evt-' + Date.now().toString(36);
  const newEv = {
    id,
    title: eventData.title,
    subtitle: eventData.subtitle || null,
    description: eventData.description,
    category: eventData.category || 'Villas',
    offer_type: eventData.offer_type || 'Lucky Draw',
    badge: eventData.badge || 'SPECIAL OFFER',
    venue: eventData.venue,
    location: eventData.location,
    event_date: eventData.event_date,
    event_time: eventData.event_time || '18:00',
    price: Number(eventData.price) || 0,
    original_price: Number(eventData.original_price) || 0,
    total_seats: Number(eventData.total_seats) || 100,
    available_seats: Number(eventData.total_seats) || 100,
    image_url: eventData.image_url || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    tags: eventData.tags || []
  };

  if (isNeonConnected && sql) {
    try {
      const result = await sql`
        INSERT INTO events (id, title, subtitle, description, category, offer_type, badge, venue, location, event_date, event_time, price, original_price, total_seats, available_seats, image_url, tags)
        VALUES (${newEv.id}, ${newEv.title}, ${newEv.subtitle}, ${newEv.description}, ${newEv.category}, ${newEv.offer_type}, ${newEv.badge}, ${newEv.venue}, ${newEv.location}, ${newEv.event_date}, ${newEv.event_time}, ${newEv.price}, ${newEv.original_price}, ${newEv.total_seats}, ${newEv.available_seats}, ${newEv.image_url}, ${newEv.tags})
        RETURNING *
      `;
      return result[0];
    } catch (colErr) {
      console.warn('Insert fallback with base columns:', colErr.message);
      const result = await sql`
        INSERT INTO events (id, title, description, category, venue, location, event_date, event_time, price, total_seats, available_seats, image_url, tags)
        VALUES (${newEv.id}, ${newEv.title}, ${newEv.description}, ${newEv.category}, ${newEv.venue}, ${newEv.location}, ${newEv.event_date}, ${newEv.event_time}, ${newEv.price}, ${newEv.total_seats}, ${newEv.available_seats}, ${newEv.image_url}, ${newEv.tags})
        RETURNING *
      `;
      return result[0];
    }
  } else {
    memoryEvents.unshift(newEv);
    return newEv;
  }
}

// User Authentication & Management
export async function getUserByEmail(email) {
  if (isNeonConnected && sql) {
    const rows = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
    return rows[0] || null;
  }
  return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id) {
  if (isNeonConnected && sql) {
    const rows = await sql`SELECT id, name, email, role, phone, status, created_at FROM users WHERE id = ${id}`;
    return rows[0] || null;
  }
  const u = memoryUsers.find(user => user.id === id);
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

export async function getCoordinators() {
  if (isNeonConnected && sql) {
    return await sql`SELECT id, name, email, role, phone, status, created_at FROM users ORDER BY created_at DESC`;
  }
  return memoryUsers.map(({ password, ...u }) => u);
}

export async function createCoordinator({ name, email, password, role = 'coordinator', phone }) {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('A user with this email address already exists');
  }

  const id = 'usr-' + Math.random().toString(36).substring(2, 9);
  const newUser = {
    id,
    name,
    email,
    password: password || 'coord123',
    role: role || 'coordinator',
    phone: phone || '',
    status: 'active',
    created_at: new Date().toISOString()
  };

  if (isNeonConnected && sql) {
    const rows = await sql`
      INSERT INTO users (id, name, email, password, role, phone, status)
      VALUES (${newUser.id}, ${newUser.name}, ${newUser.email}, ${newUser.password}, ${newUser.role}, ${newUser.phone}, ${newUser.status})
      RETURNING id, name, email, role, phone, status, created_at
    `;
    return rows[0];
  } else {
    memoryUsers.unshift(newUser);
    const { password: _, ...safe } = newUser;
    return safe;
  }
}

export async function deleteCoordinator(id) {
  if (isNeonConnected && sql) {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return true;
  }
  memoryUsers = memoryUsers.filter(u => u.id !== id);
  return true;
}

// Verify & Scan Ticket Pass
export async function verifyAndScanTicket(ticketCode, verifiedBy = null) {
  const code = ticketCode.trim().toUpperCase();
  let booking = null;

  if (isNeonConnected && sql) {
    const rows = await sql`
      SELECT b.*, e.title as event_title, e.event_date, e.event_time, e.venue, e.location, e.image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE UPPER(b.ticket_code) = ${code} OR b.id = ${ticketCode}
    `;
    booking = rows[0];
  } else {
    booking = memoryBookings.find(b => b.ticket_code.toUpperCase() === code || b.id === ticketCode);
  }

  if (!booking) {
    return { valid: false, message: 'Invalid coupon code. Voucher not found in database.' };
  }

  if (booking.status === 'redeemed' || booking.status === 'used') {
    return {
      valid: false,
      alreadyRedeemed: true,
      message: `Coupon was already redeemed on ${booking.redeemed_at ? new Date(booking.redeemed_at).toLocaleString('en-IN') : 'prior date'}${booking.verified_by_name ? ` by ${booking.verified_by_name}` : ''}.`,
      booking
    };
  }

  // Mark as redeemed with staff audit details
  const now = new Date().toISOString();
  const vId = verifiedBy?.id || null;
  const vName = verifiedBy?.name || 'Staff Member';
  const vEmail = verifiedBy?.email || null;

  if (isNeonConnected && sql) {
    await sql`
      UPDATE bookings 
      SET status = 'redeemed',
          redeemed_at = ${now},
          verified_by_id = ${vId},
          verified_by_name = ${vName},
          verified_by_email = ${vEmail}
      WHERE id = ${booking.id}
    `;
    booking.status = 'redeemed';
    booking.redeemed_at = now;
    booking.verified_by_id = vId;
    booking.verified_by_name = vName;
    booking.verified_by_email = vEmail;
  } else {
    booking.status = 'redeemed';
    booking.redeemed_at = now;
    booking.verified_by_id = vId;
    booking.verified_by_name = vName;
    booking.verified_by_email = vEmail;
  }

  return {
    valid: true,
    message: 'Coupon verified & successfully marked as REDEEMED!',
    booking: {
      ...booking,
      status: 'redeemed',
      redeemed_at: now,
      verified_by_id: vId,
      verified_by_name: vName,
      verified_by_email: vEmail
    }
  };
}

// Update coupon offer
export async function updateEvent(id, eventData) {
  if (isNeonConnected && sql) {
    try {
      const result = await sql`
        UPDATE events
        SET 
          title = COALESCE(${eventData.title}, title),
          subtitle = COALESCE(${eventData.subtitle}, subtitle),
          description = COALESCE(${eventData.description}, description),
          category = COALESCE(${eventData.category}, category),
          offer_type = COALESCE(${eventData.offer_type}, offer_type),
          badge = COALESCE(${eventData.badge}, badge),
          venue = COALESCE(${eventData.venue}, venue),
          location = COALESCE(${eventData.location}, location),
          event_date = COALESCE(${eventData.event_date ? new Date(eventData.event_date) : null}, event_date),
          price = COALESCE(${eventData.price ? Number(eventData.price) : null}, price),
          original_price = COALESCE(${eventData.original_price ? Number(eventData.original_price) : null}, original_price),
          total_seats = COALESCE(${eventData.total_seats ? Number(eventData.total_seats) : null}, total_seats),
          image_url = COALESCE(${eventData.image_url}, image_url)
        WHERE id = ${id}
        RETURNING *
      `;
      return result[0];
    } catch (colErr) {
      console.warn('Update fallback with base columns:', colErr.message);
      const result = await sql`
        UPDATE events
        SET 
          title = COALESCE(${eventData.title}, title),
          description = COALESCE(${eventData.description}, description),
          category = COALESCE(${eventData.category}, category),
          venue = COALESCE(${eventData.venue}, venue),
          location = COALESCE(${eventData.location}, location),
          price = COALESCE(${eventData.price ? Number(eventData.price) : null}, price),
          image_url = COALESCE(${eventData.image_url}, image_url)
        WHERE id = ${id}
        RETURNING *
      `;
      return result[0];
    }
  }

  const idx = memoryEvents.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('Coupon not found');
  memoryEvents[idx] = {
    ...memoryEvents[idx],
    ...eventData,
    price: eventData.price !== undefined ? Number(eventData.price) : memoryEvents[idx].price
  };
  return memoryEvents[idx];
}

// Delete coupon offer
export async function deleteEvent(id) {
  if (isNeonConnected && sql) {
    await sql`DELETE FROM events WHERE id = ${id}`;
    return true;
  }
  memoryEvents = memoryEvents.filter(e => e.id !== id);
  return true;
}

// Analytics / Revenue Reports
export async function getDashboardStats() {
  const allEvents = await getEvents();
  const allBookings = await getBookings();
  const allUsers = await getCoordinators();

  const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const totalCouponsIssued = allBookings.length;
  const totalOffersActive = allEvents.length;
  const totalCoordinators = allUsers.filter(u => u.role === 'coordinator').length;
  const totalRedeemed = allBookings.filter(b => b.status === 'redeemed').length;

  return {
    totalRevenue,
    totalCouponsIssued,
    totalOffersActive,
    totalCoordinators,
    totalRedeemed,
    recentBookings: allBookings.slice(0, 10),
    offers: allEvents
  };
}
