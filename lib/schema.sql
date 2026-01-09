-- FortyLaunch Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Opportunities (Clients/Deals)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  logo_short TEXT,
  amount DECIMAL,
  stage TEXT DEFAULT 'Qualification',
  probability INT DEFAULT 0,
  sentiment TEXT DEFAULT 'Neutral',
  next_action TEXT,
  next_action_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactions (Communications Log)
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  type TEXT, -- phone_call, email, video_meeting, in_person_meeting, slack_message, voice_note
  summary TEXT,
  sentiment TEXT,
  date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Draft', -- Draft, Pending Signature, Signed
  value DECIMAL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE,
  time TIME,
  type TEXT DEFAULT 'Meeting', -- Meeting, Call, Task, Deadline
  status TEXT DEFAULT 'Pending', -- Pending, Completed, Incomplete, Revise
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (for demo - tighten for production)
CREATE POLICY "Allow all access to opportunities" ON opportunities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to interactions" ON interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to calendar_events" ON calendar_events FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to opportunities
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
