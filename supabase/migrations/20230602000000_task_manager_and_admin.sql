-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create task_categories table
CREATE TABLE task_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add category_id to tasks table
ALTER TABLE tasks ADD COLUMN category_id UUID REFERENCES task_categories(id);

-- Create task_statuses table
CREATE TABLE task_statuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add status_id to tasks table
ALTER TABLE tasks ADD COLUMN status_id UUID REFERENCES task_statuses(id);

-- Add deadline to tasks table
ALTER TABLE tasks ADD COLUMN deadline TIMESTAMP WITH TIME ZONE;

-- Create referral_rewards table
CREATE TABLE referral_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referral_id UUID REFERENCES referrals(id),
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update triggers
CREATE TRIGGER update_task_categories_modtime
BEFORE UPDATE ON task_categories
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_task_statuses_modtime
BEFORE UPDATE ON task_statuses
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_referral_rewards_modtime
BEFORE UPDATE ON referral_rewards
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS on new tables
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Anyone can view task categories" ON task_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage task categories" ON task_categories
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Anyone can view task statuses" ON task_statuses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage task statuses" ON task_statuses
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users can view their own referral rewards" ON referral_rewards FOR SELECT
  USING (auth.uid() IN (SELECT referrer_id FROM referrals WHERE id = referral_rewards.referral_id));

CREATE POLICY "System can create referral rewards" ON referral_rewards FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update existing policies for tasks
DROP POLICY "Users can create tasks" ON tasks;
CREATE POLICY "Admins can manage tasks" ON tasks
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
