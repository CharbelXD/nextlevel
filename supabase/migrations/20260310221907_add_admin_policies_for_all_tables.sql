/*
  # Add Admin Policies for All Tables

  1. Changes
    - Add INSERT, UPDATE, and DELETE policies for authenticated users on all tables
    - This allows admin users to manage content through the admin panel
  
  2. Tables Updated
    - news: Add INSERT, UPDATE, DELETE policies
    - classes: Add INSERT, UPDATE, DELETE policies
    - class_schedule: Add INSERT, UPDATE, DELETE policies
    - memberships: Add INSERT, UPDATE, DELETE policies
    - personal_trainers: Add INSERT, UPDATE, DELETE policies
  
  3. Security
    - Only authenticated users can INSERT, UPDATE, DELETE
    - Anonymous users can still SELECT (view) content
*/

-- News table policies
CREATE POLICY "Authenticated users can insert news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news"
  ON news FOR DELETE
  TO authenticated
  USING (true);

-- Classes table policies
CREATE POLICY "Authenticated users can insert classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete classes"
  ON classes FOR DELETE
  TO authenticated
  USING (true);

-- Class schedule table policies
CREATE POLICY "Authenticated users can insert schedules"
  ON class_schedule FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update schedules"
  ON class_schedule FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete schedules"
  ON class_schedule FOR DELETE
  TO authenticated
  USING (true);

-- Memberships table policies
CREATE POLICY "Authenticated users can insert memberships"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update memberships"
  ON memberships FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete memberships"
  ON memberships FOR DELETE
  TO authenticated
  USING (true);

-- Personal trainers table policies
CREATE POLICY "Authenticated users can insert trainers"
  ON personal_trainers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trainers"
  ON personal_trainers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete trainers"
  ON personal_trainers FOR DELETE
  TO authenticated
  USING (true);
