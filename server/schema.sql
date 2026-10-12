-- Neon PostgreSQL Schema for 1ticket

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

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  event_id VARCHAR(64) REFERENCES events(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  seat_count INT NOT NULL DEFAULT 1,
  seats TEXT[],
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ticket_code VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(32) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
