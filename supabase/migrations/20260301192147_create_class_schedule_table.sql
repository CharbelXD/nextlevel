/*
  # Create Class Schedule Table

  1. New Tables
    - `class_schedule`
      - `id` (uuid, primary key)
      - `class_id` (uuid, foreign key to classes)
      - `day_of_week` (integer 0-6, 0=Sunday, 6=Saturday)
      - `start_time` (time)
      - `end_time` (time)
      - `instructor` (text)
      - `capacity` (integer, max attendees)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `class_schedule` table
    - Add public read policy (no auth required for viewing)

  3. Sample Data
    - Insert sample schedules for existing classes
*/

CREATE TABLE IF NOT EXISTS class_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  instructor text NOT NULL,
  capacity integer NOT NULL DEFAULT 25,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view class schedules"
  ON class_schedule FOR SELECT
  TO anon
  USING (true);

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 1, '06:00:00'::time, '07:00:00'::time, 'Sarah Johnson', 25 FROM classes WHERE name = 'HIIT Cardio' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 3, '06:00:00'::time, '07:00:00'::time, 'Sarah Johnson', 25 FROM classes WHERE name = 'HIIT Cardio' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 5, '06:00:00'::time, '07:00:00'::time, 'Sarah Johnson', 25 FROM classes WHERE name = 'HIIT Cardio' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 2, '07:00:00'::time, '08:00:00'::time, 'Mike Chen', 20 FROM classes WHERE name = 'Yoga Flow' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 4, '07:00:00'::time, '08:00:00'::time, 'Mike Chen', 20 FROM classes WHERE name = 'Yoga Flow' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 1, '17:00:00'::time, '18:30:00'::time, 'David Martinez', 30 FROM classes WHERE name = 'Strength Training' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 3, '17:00:00'::time, '18:30:00'::time, 'David Martinez', 30 FROM classes WHERE name = 'Strength Training' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 5, '17:00:00'::time, '18:30:00'::time, 'David Martinez', 30 FROM classes WHERE name = 'Strength Training' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 2, '06:30:00'::time, '07:30:00'::time, 'Emma Wilson', 40 FROM classes WHERE name = 'Spin Class' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 4, '06:30:00'::time, '07:30:00'::time, 'Emma Wilson', 40 FROM classes WHERE name = 'Spin Class' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, instructor, capacity)
SELECT id, 6, '06:30:00'::time, '07:30:00'::time, 'Emma Wilson', 40 FROM classes WHERE name = 'Spin Class' LIMIT 1;