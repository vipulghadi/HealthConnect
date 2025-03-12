-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID REFERENCES users(id) NOT NULL PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID REFERENCES users(id) NOT NULL PRIMARY KEY,
  specialty TEXT,
  license_number TEXT,
  location TEXT,
  bio TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  rating DECIMAL(3, 2),
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('in-person', 'video')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_recommendations table
CREATE TABLE IF NOT EXISTS doctor_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Patients can read their own data
CREATE POLICY "Patients can read their own data"
  ON patients FOR SELECT
  USING (auth.uid() = id);

-- Patients can update their own data
CREATE POLICY "Patients can update their own data"
  ON patients FOR UPDATE
  USING (auth.uid() = id);

-- Doctors can read their own data
CREATE POLICY "Doctors can read their own data"
  ON doctors FOR SELECT
  USING (auth.uid() = id);

-- Doctors can update their own data
CREATE POLICY "Doctors can update their own data"
  ON doctors FOR UPDATE
  USING (auth.uid() = id);

-- Patients can read doctor data
CREATE POLICY "Patients can read doctor data"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

-- Doctors can manage their availability
CREATE POLICY "Doctors can manage their availability"
  ON availability FOR ALL
  USING (auth.uid() = doctor_id);

-- Anyone can read doctor availability
CREATE POLICY "Anyone can read doctor availability"
  ON availability FOR SELECT
  USING (true);

-- Patients can create appointments
CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Patients can read their own appointments
CREATE POLICY "Patients can read their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

-- Doctors can read their appointments
CREATE POLICY "Doctors can read their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = doctor_id);

-- Patients can update their appointments
CREATE POLICY "Patients can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id);

-- Doctors can update appointment status and notes
CREATE POLICY "Doctors can update appointment status and notes"
  ON appointments FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Users can manage their own chat messages
CREATE POLICY "Users can manage their own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid() = user_id);

-- Patients can read their doctor recommendations
CREATE POLICY "Patients can read their doctor recommendations"
  ON doctor_recommendations FOR SELECT
  USING (auth.uid() = patient_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table doctors;
alter publication supabase_realtime add table availability;
alter publication supabase_realtime add table appointments;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table doctor_recommendations;
