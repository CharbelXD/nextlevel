/*
  # Gym Website Database Schema

  1. New Tables
    - `memberships`
      - `id` (uuid, primary key)
      - `name` (text) - Membership tier name
      - `price` (numeric) - Monthly price
      - `features` (text[]) - Array of features included
      - `popular` (boolean) - Flag for featured plan
      - `created_at` (timestamptz)
    
    - `classes`
      - `id` (uuid, primary key)
      - `name` (text) - Class name
      - `description` (text) - Class description
      - `instructor` (text) - Instructor name
      - `schedule` (text) - Schedule information
      - `difficulty` (text) - Beginner, Intermediate, Advanced
      - `image_url` (text) - Class image URL
      - `created_at` (timestamptz)
    
    - `news`
      - `id` (uuid, primary key)
      - `title` (text) - News title
      - `excerpt` (text) - Short excerpt
      - `content` (text) - Full content
      - `image_url` (text) - News image URL
      - `published_at` (timestamptz) - Publication date
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (no auth required for viewing)
*/

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memberships"
  ON memberships FOR SELECT
  TO anon
  USING (true);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  schedule text NOT NULL,
  difficulty text NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view classes"
  ON classes FOR SELECT
  TO anon
  USING (true);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text DEFAULT '',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news"
  ON news FOR SELECT
  TO anon
  USING (true);

-- Insert sample memberships
INSERT INTO memberships (name, price, features, popular) VALUES
  ('Basic', 29.99, ARRAY['Access to gym floor', 'Locker room access', 'Free fitness assessment'], false),
  ('Premium', 49.99, ARRAY['All Basic features', 'Unlimited group classes', 'Access to pool & sauna', '1 personal training session/month'], true),
  ('Elite', 79.99, ARRAY['All Premium features', '4 personal training sessions/month', 'Nutrition consultation', 'Priority class booking', 'Guest passes (2/month)'], false);

-- Insert sample classes
INSERT INTO classes (name, description, instructor, schedule, difficulty, image_url) VALUES
  ('HIIT Cardio', 'High-intensity interval training to boost your metabolism and burn fat fast', 'Sarah Johnson', 'Mon, Wed, Fri - 6:00 AM', 'Intermediate', 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg'),
  ('Yoga Flow', 'Dynamic yoga sequences to improve flexibility, balance, and mindfulness', 'Mike Chen', 'Tue, Thu - 7:00 AM', 'Beginner', 'https://images.pexels.com/photos/3822354/pexels-photo-3822354.jpeg'),
  ('Strength Training', 'Build muscle and increase strength with guided weightlifting sessions', 'David Martinez', 'Mon, Wed, Fri - 5:00 PM', 'Advanced', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg'),
  ('Spin Class', 'High-energy cycling workouts with motivating music and instructors', 'Emma Wilson', 'Tue, Thu, Sat - 6:30 AM', 'Intermediate', 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg');

-- Insert sample news
INSERT INTO news (title, excerpt, content, image_url, published_at) VALUES
  ('New Equipment Arrival', 'State-of-the-art machines now available', 'We are excited to announce the arrival of brand new Hammer Strength equipment. Our members can now enjoy the latest in fitness technology with equipment designed for maximum performance and safety.', 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg', now() - interval '2 days'),
  ('Summer Membership Special', 'Limited time offer: 50% off first month', 'Join us this summer and get 50% off your first month! This is the perfect time to start your fitness journey with our expert trainers and world-class facilities.', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg', now() - interval '5 days'),
  ('Meet Our New Trainer', 'Welcome Jessica to the team', 'We are thrilled to introduce Jessica Roberts, our newest certified personal trainer specializing in functional fitness and athletic performance. Book your session today!', 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg', now() - interval '7 days');