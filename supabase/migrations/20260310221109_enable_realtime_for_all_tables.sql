/*
  # Enable Realtime for All Tables

  1. Changes
    - Enable realtime replication for all tables (news, classes, class_schedule, memberships, personal_trainers)
    - This allows frontend components to receive live updates when data changes
  
  2. Security
    - No changes to RLS policies
    - Maintains existing security model
*/

-- Enable realtime for news table
ALTER PUBLICATION supabase_realtime ADD TABLE news;

-- Enable realtime for classes table
ALTER PUBLICATION supabase_realtime ADD TABLE classes;

-- Enable realtime for class_schedule table
ALTER PUBLICATION supabase_realtime ADD TABLE class_schedule;

-- Enable realtime for memberships table
ALTER PUBLICATION supabase_realtime ADD TABLE memberships;

-- Enable realtime for personal_trainers table
ALTER PUBLICATION supabase_realtime ADD TABLE personal_trainers;
