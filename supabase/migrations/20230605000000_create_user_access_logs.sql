-- Create user_access_logs table
CREATE TABLE user_access_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  access_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE user_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can insert their own access logs" ON user_access_logs FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own access logs" ON user_access_logs FOR SELECT
USING (auth.uid()::text = user_id::text);

