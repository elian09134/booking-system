-- ============================================
-- BOOKING WEB APP - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: vehicles
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  plate_number VARCHAR(20),
  photo_url TEXT,
  year INT,
  brand VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default vehicles data
INSERT INTO vehicles (name, type, plate_number, brand, year) VALUES
  ('Xpander', 'MPV', 'B 1234 ABC', 'Mitsubishi', 2022),
  ('Xenia', 'MPV', 'B 2345 BCD', 'Daihatsu', 2021),
  ('Livina', 'MPV', 'B 3456 CDE', 'Nissan', 2020),
  ('Avanza', 'MPV', 'B 4567 DEF', 'Toyota', 2023),
  ('Voxy', 'MPV', 'B 5678 EFG', 'Toyota', 2022);

-- ============================================
-- TABLE: vehicle_services
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_type VARCHAR(50) NOT NULL, -- 'Regular', 'Repair', 'Tire Change', etc.
  description TEXT,
  cost NUMERIC(12, 2),
  odometer_reading INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type VARCHAR(50) NOT NULL, -- 'vehicle' (rooms removed)
  item_name VARCHAR(100) NOT NULL,
  requester_name VARCHAR(100) NOT NULL,
  division VARCHAR(100) NOT NULL,
  purpose TEXT NOT NULL,
  destination TEXT, -- Only for vehicles
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL, -- Link to specific vehicle
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
INSERT INTO admins (username, password_hash, name) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx3PLHxB8s8qHnJhVBq/R6y', 'Administrator');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Modify as needed for stricter rules)
CREATE POLICY "Allow public read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public read services" ON vehicle_services FOR SELECT USING (true);
CREATE POLICY "Allow public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public read admins" ON admins FOR SELECT USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_item_type ON bookings(item_type);
CREATE INDEX IF NOT EXISTS idx_bookings_start_datetime ON bookings(start_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_requester_name ON bookings(requester_name);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_services_vehicle_id ON vehicle_services(vehicle_id);
