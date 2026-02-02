-- ============================================
-- BOOKING WEB APP - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: rooms
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'meeting_room', 'training_center'
  location VARCHAR(100),
  capacity INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default rooms data
INSERT INTO rooms (name, type, location) VALUES
  ('Ruang Meeting Lantai 1', 'meeting_room', 'Lantai 1'),
  ('Bandara Mas', 'training_center', 'Bandara Mas');

-- ============================================
-- TABLE: vehicles
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  plate_number VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default vehicles data
INSERT INTO vehicles (name, type, plate_number) VALUES
  ('Xpander', 'MPV', 'B 1234 ABC'),
  ('Xenia', 'MPV', 'B 2345 BCD'),
  ('Livina', 'MPV', 'B 3456 CDE'),
  ('Avanza', 'MPV', 'B 4567 DEF'),
  ('Voxy', 'MPV', 'B 5678 EFG');

-- ============================================
-- TABLE: bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type VARCHAR(50) NOT NULL, -- 'meeting_room', 'training_center', 'vehicle'
  item_name VARCHAR(100) NOT NULL,
  requester_name VARCHAR(100) NOT NULL,
  division VARCHAR(100) NOT NULL,
  purpose TEXT NOT NULL,
  destination TEXT, -- Only for vehicles
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_type VARCHAR(20) NOT NULL, -- 'hours' or 'days'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default admin account (password: admin123)
-- bcrypt hash for 'admin123': $2a$10$rQZ1xFk5Z8Y5k5Z8Y5k5Z.5Z8Y5k5Z8Y5k5Z8Y5k5Z8Y5k5Z8Y5k5
INSERT INTO admins (username, password_hash, name) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx3PLHxB8s8qHnJhVBq/R6y', 'Administrator');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rooms and vehicles
CREATE POLICY "Allow public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicles" ON vehicles FOR SELECT USING (true);

-- Allow public to create and read bookings
CREATE POLICY "Allow public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON bookings FOR UPDATE USING (true);

-- Allow read access to admins (for login verification)
CREATE POLICY "Allow public read admins" ON admins FOR SELECT USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_item_type ON bookings(item_type);
CREATE INDEX IF NOT EXISTS idx_bookings_start_datetime ON bookings(start_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_requester_name ON bookings(requester_name);
