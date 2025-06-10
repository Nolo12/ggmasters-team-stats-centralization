
-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  motm_awards INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  opponent TEXT NOT NULL,
  venue TEXT,
  is_home BOOLEAN DEFAULT true,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  motm_player_id UUID REFERENCES public.players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'team-update' CHECK (category IN ('match-result', 'player-news', 'team-update')),
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_statistics table for individual player performances per game
CREATE TABLE public.game_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the admin user (password: 123456)
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('msixty@ggmasters.com', crypt('123456', gen_salt('bf')), 'Admin User');

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public team website)
CREATE POLICY "Allow public read access to players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public read access to games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Allow public read access to news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow public read access to game_statistics" ON public.game_statistics FOR SELECT USING (true);

-- Create policies for admin write access (you'll need to implement auth logic)
CREATE POLICY "Allow admin write access to players" ON public.players 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write access to games" ON public.games 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write access to news" ON public.news 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write access to game_statistics" ON public.game_statistics 
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to update player stats from game statistics
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update player totals when game statistics change
  UPDATE public.players 
  SET 
    goals = (SELECT COALESCE(SUM(goals), 0) FROM public.game_statistics WHERE player_id = NEW.player_id),
    assists = (SELECT COALESCE(SUM(assists), 0) FROM public.game_statistics WHERE player_id = NEW.player_id),
    yellow_cards = (SELECT COALESCE(SUM(yellow_cards), 0) FROM public.game_statistics WHERE player_id = NEW.player_id),
    red_cards = (SELECT COALESCE(SUM(red_cards), 0) FROM public.game_statistics WHERE player_id = NEW.player_id),
    matches_played = (SELECT COUNT(*) FROM public.game_statistics WHERE player_id = NEW.player_id),
    motm_awards = (SELECT COUNT(*) FROM public.games WHERE motm_player_id = NEW.player_id),
    updated_at = NOW()
  WHERE id = NEW.player_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update player stats
CREATE TRIGGER update_player_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.game_statistics
  FOR EACH ROW EXECUTE FUNCTION update_player_stats();

-- Enable realtime for all tables
ALTER TABLE public.players REPLICA IDENTITY FULL;
ALTER TABLE public.games REPLICA IDENTITY FULL;
ALTER TABLE public.news REPLICA IDENTITY FULL;
ALTER TABLE public.game_statistics REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_statistics;
