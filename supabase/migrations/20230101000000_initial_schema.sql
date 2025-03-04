
-- Create cattle table
CREATE TABLE IF NOT EXISTS public.cattle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag_number TEXT NOT NULL,
  temperature NUMERIC DEFAULT 38.5,
  weight NUMERIC DEFAULT 500,
  health_status TEXT DEFAULT 'Healthy',
  location TEXT DEFAULT 'Feeding',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create GPS tracking table
CREATE TABLE IF NOT EXISTS public.gps_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cattle_id UUID REFERENCES public.cattle(id),
  battery_level INTEGER DEFAULT 100,
  signal_strength INTEGER DEFAULT 100,
  lat NUMERIC,
  lng NUMERIC,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create feed distribution table
CREATE TABLE IF NOT EXISTS public.feed_distribution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_type TEXT NOT NULL,
  percentage INTEGER DEFAULT 0,
  details TEXT
);

-- Create feeding schedule table
CREATE TABLE IF NOT EXISTS public.feeding_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_type TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  notes TEXT
);

-- Create sensor readings table if using IoT sensors
CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cattle_id UUID REFERENCES public.cattle(id),
  temperature NUMERIC,
  humidity NUMERIC,
  battery_level INTEGER,
  signal_strength INTEGER,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert sample feed distribution data
INSERT INTO public.feed_distribution (feed_type, percentage, details)
VALUES 
  ('Hay', 40, 'Rich in fiber, essential for digestion'),
  ('Grain', 25, 'Energy source for growth'),
  ('Silage', 20, 'Fermented feed for better nutrition'),
  ('Supplements', 15, 'Additional nutrients for health');

-- Insert sample feeding schedule
INSERT INTO public.feeding_schedule (feed_type, time_of_day, amount, notes)
VALUES 
  ('Hay', 'Morning', 5, 'Fresh hay delivery'),
  ('Grain', 'Noon', 3, 'Mixed with supplements'),
  ('Silage', 'Evening', 4, 'Before resting period');
