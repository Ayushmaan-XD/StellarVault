-- Create tables for StellarVault application

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends Supabase auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'astronaut' CHECK (role IN ('admin', 'astronaut', 'ground-control')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Create containers table
CREATE TABLE IF NOT EXISTS containers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  containerId TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL,
  width NUMERIC NOT NULL CHECK (width >= 0),
  depth NUMERIC NOT NULL CHECK (depth >= 0),
  height NUMERIC NOT NULL CHECK (height >= 0),
  maxWeight NUMERIC NOT NULL CHECK (maxWeight >= 0),
  currentWeight NUMERIC NOT NULL DEFAULT 0 CHECK (currentWeight >= 0),
  itemCount INTEGER NOT NULL DEFAULT 0 CHECK (itemCount >= 0),
  utilization NUMERIC NOT NULL DEFAULT 0 CHECK (utilization >= 0 AND utilization <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itemId TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  width NUMERIC NOT NULL CHECK (width >= 0),
  depth NUMERIC NOT NULL CHECK (depth >= 0),
  height NUMERIC NOT NULL CHECK (height >= 0),
  mass NUMERIC NOT NULL CHECK (mass >= 0),
  priority INTEGER NOT NULL CHECK (priority >= 0 AND priority <= 100),
  expiryDate TIMESTAMP WITH TIME ZONE,
  usageLimit INTEGER NOT NULL CHECK (usageLimit >= 0),
  usesLeft INTEGER NOT NULL CHECK (usesLeft >= 0),
  preferredZone TEXT NOT NULL,
  containerId TEXT NOT NULL REFERENCES containers(containerId) ON DELETE RESTRICT,
  position JSONB,
  isWaste BOOLEAN NOT NULL DEFAULT FALSE,
  wasteReason TEXT CHECK (wasteReason IN ('Expired', 'Out of Uses', 'Damaged')),
  createdBy UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  userName TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('add', 'remove', 'update', 'retrieve', 'move', 'waste')),
  itemId TEXT NOT NULL,
  itemName TEXT NOT NULL,
  containerId TEXT NOT NULL,
  details TEXT DEFAULT '',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_containers_updated_at
BEFORE UPDATE ON containers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies (can do everything)
CREATE POLICY "Admins can do everything on containers"
  ON containers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can do everything on items"
  ON items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can do everything on activities"
  ON activities FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- General read policies
CREATE POLICY "Everyone can view containers"
  ON containers FOR SELECT
  USING (true);

CREATE POLICY "Everyone can view items"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Everyone can view activities"
  ON activities FOR SELECT
  USING (true);

-- Astronaut and ground-control policies
CREATE POLICY "Astronauts and ground-control can insert items"
  ON items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND (profiles.role = 'astronaut' OR profiles.role = 'ground-control')
  ));

CREATE POLICY "Astronauts and ground-control can update items"
  ON items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND (profiles.role = 'astronaut' OR profiles.role = 'ground-control')
  ));

CREATE POLICY "Ground-control can insert containers"
  ON containers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'ground-control'
  ));

CREATE POLICY "Ground-control can update containers"
  ON containers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'ground-control'
  ));

-- Activity logging policies
CREATE POLICY "Users can insert their own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid()::text = userId::text);
