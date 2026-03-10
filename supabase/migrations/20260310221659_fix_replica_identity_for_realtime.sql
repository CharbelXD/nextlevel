/*
  # Fix Replica Identity for Realtime DELETE Operations

  1. Changes
    - Set replica identity to FULL for all tables with realtime enabled
    - This ensures DELETE operations are properly broadcasted to realtime subscribers
    - Without FULL replica identity, DELETE events don't contain enough information for subscribers
  
  2. Tables Updated
    - news
    - classes
    - class_schedule
    - memberships
    - personal_trainers
*/

-- Set replica identity to FULL for all realtime tables
ALTER TABLE news REPLICA IDENTITY FULL;
ALTER TABLE classes REPLICA IDENTITY FULL;
ALTER TABLE class_schedule REPLICA IDENTITY FULL;
ALTER TABLE memberships REPLICA IDENTITY FULL;
ALTER TABLE personal_trainers REPLICA IDENTITY FULL;
