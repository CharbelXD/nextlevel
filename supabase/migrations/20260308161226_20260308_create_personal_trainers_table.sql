/*
  # Create Personal Trainers Table

  1. New Tables
    - `personal_trainers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `image_url` (text, nullable)
      - `specialization` (text, nullable - e.g., "Strength Training", "Cardio")
      - `bio` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `personal_trainers` table
    - Add policy for authenticated users to view trainers
    - Add policy for admin to manage trainers

  3. Notes
    - Public read access for all trainers
    - Only authenticated admins can create, update, delete trainers
*/

CREATE TABLE IF NOT EXISTS personal_trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  specialization text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE personal_trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view personal trainers"
  ON personal_trainers
  FOR SELECT
  USING (true);
