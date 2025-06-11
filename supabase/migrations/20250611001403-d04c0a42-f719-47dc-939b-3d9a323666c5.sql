
-- Add team branding table for logo storage
CREATE TABLE public.team_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  team_name TEXT DEFAULT 'GG Masters FC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default team branding
INSERT INTO public.team_branding (team_name) VALUES ('GG Masters FC');

-- Add team statistics table for tracking overall team performance
CREATE TABLE public.team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial team statistics
INSERT INTO public.team_statistics (matches_played, wins, draws, losses, goals_for, goals_against, goal_difference, points) 
VALUES (0, 0, 0, 0, 0, 0, 0, 0);

-- Function to update team statistics when game results change
CREATE OR REPLACE FUNCTION update_team_statistics()
RETURNS TRIGGER AS $$
DECLARE
  total_matches INTEGER := 0;
  total_wins INTEGER := 0;
  total_draws INTEGER := 0;
  total_losses INTEGER := 0;
  total_goals_for INTEGER := 0;
  total_goals_against INTEGER := 0;
  calculated_goal_difference INTEGER := 0;
  calculated_points INTEGER := 0;
BEGIN
  -- Calculate team statistics from completed games
  SELECT 
    COUNT(*),
    SUM(CASE 
      WHEN (is_home = true AND home_score > away_score) OR (is_home = false AND away_score > home_score) 
      THEN 1 ELSE 0 
    END),
    SUM(CASE 
      WHEN home_score = away_score 
      THEN 1 ELSE 0 
    END),
    SUM(CASE 
      WHEN (is_home = true AND home_score < away_score) OR (is_home = false AND away_score < home_score) 
      THEN 1 ELSE 0 
    END),
    SUM(CASE WHEN is_home = true THEN home_score ELSE away_score END),
    SUM(CASE WHEN is_home = true THEN away_score ELSE home_score END)
  INTO total_matches, total_wins, total_draws, total_losses, total_goals_for, total_goals_against
  FROM public.games 
  WHERE status = 'completed' AND home_score IS NOT NULL AND away_score IS NOT NULL;

  -- Calculate goal difference and points
  calculated_goal_difference := total_goals_for - total_goals_against;
  calculated_points := (total_wins * 3) + total_draws;

  -- Update team statistics
  UPDATE public.team_statistics 
  SET 
    matches_played = total_matches,
    wins = total_wins,
    draws = total_draws,
    losses = total_losses,
    goals_for = total_goals_for,
    goals_against = total_goals_against,
    goal_difference = calculated_goal_difference,
    points = calculated_points,
    updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team statistics updates
DROP TRIGGER IF EXISTS trigger_update_team_stats ON public.games;
CREATE TRIGGER trigger_update_team_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.games
  FOR EACH ROW EXECUTE FUNCTION update_team_statistics();

-- Function to automatically generate news when a game is completed
CREATE OR REPLACE FUNCTION generate_game_news()
RETURNS TRIGGER AS $$
DECLARE
  news_title TEXT;
  news_content TEXT;
  news_excerpt TEXT;
  result_text TEXT;
  our_score INTEGER;
  their_score INTEGER;
  top_scorer_name TEXT;
  top_scorer_goals INTEGER;
  yellow_cards_count INTEGER;
  red_cards_count INTEGER;
BEGIN
  -- Only generate news for completed games with scores
  IF NEW.status = 'completed' AND NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    
    -- Determine our score and result
    IF NEW.is_home THEN
      our_score := NEW.home_score;
      their_score := NEW.away_score;
    ELSE
      our_score := NEW.away_score;
      their_score := NEW.home_score;
    END IF;
    
    -- Determine result
    IF our_score > their_score THEN
      result_text := 'Victory';
    ELSIF our_score < their_score THEN
      result_text := 'Defeat';
    ELSE
      result_text := 'Draw';
    END IF;
    
    -- Get top scorer for this game
    SELECT p.name, gs.goals INTO top_scorer_name, top_scorer_goals
    FROM public.game_statistics gs
    JOIN public.players p ON gs.player_id = p.id
    WHERE gs.game_id = NEW.id AND gs.goals > 0
    ORDER BY gs.goals DESC
    LIMIT 1;
    
    -- Get disciplinary stats for this game
    SELECT 
      COALESCE(SUM(yellow_cards), 0),
      COALESCE(SUM(red_cards), 0)
    INTO yellow_cards_count, red_cards_count
    FROM public.game_statistics
    WHERE game_id = NEW.id;
    
    -- Generate news title
    news_title := 'GG Masters FC ' || our_score || '-' || their_score || ' ' || NEW.opponent || ': ' || result_text;
    
    -- Generate news excerpt
    news_excerpt := 'GG Masters FC ' || 
      CASE 
        WHEN our_score > their_score THEN 'secured a ' || our_score || '-' || their_score || ' victory against '
        WHEN our_score < their_score THEN 'fell to a ' || our_score || '-' || their_score || ' defeat against '
        ELSE 'drew ' || our_score || '-' || their_score || ' with '
      END || NEW.opponent || '.';
    
    -- Generate detailed news content
    news_content := 'GG Masters FC ' || 
      CASE 
        WHEN our_score > their_score THEN 'delivered an impressive performance to beat '
        WHEN our_score < their_score THEN 'fought hard but ultimately lost to '
        ELSE 'battled to a draw against '
      END || NEW.opponent || ' with a final score of ' || our_score || '-' || their_score || 
      CASE WHEN NEW.is_home THEN ' at ' || COALESCE(NEW.venue, 'home') ELSE ' away at ' || COALESCE(NEW.venue, 'unknown venue') END || 
      ' on ' || TO_CHAR(NEW.date::DATE, 'FMDD Month YYYY') || '.';
    
    -- Add top scorer info if available
    IF top_scorer_name IS NOT NULL AND top_scorer_goals > 0 THEN
      news_content := news_content || ' ' || top_scorer_name || ' was the standout performer, scoring ' || 
        top_scorer_goals || CASE WHEN top_scorer_goals = 1 THEN ' goal' ELSE ' goals' END || '.';
    END IF;
    
    -- Add disciplinary info if relevant
    IF yellow_cards_count > 0 OR red_cards_count > 0 THEN
      news_content := news_content || ' The match saw ';
      IF yellow_cards_count > 0 THEN
        news_content := news_content || yellow_cards_count || ' yellow card' || CASE WHEN yellow_cards_count = 1 THEN '' ELSE 's' END;
      END IF;
      IF red_cards_count > 0 THEN
        IF yellow_cards_count > 0 THEN
          news_content := news_content || ' and ';
        END IF;
        news_content := news_content || red_cards_count || ' red card' || CASE WHEN red_cards_count = 1 THEN '' ELSE 's' END;
      END IF;
      news_content := news_content || ' shown.';
    END IF;
    
    -- Add MOTM info
    IF NEW.motm_player_id IS NOT NULL THEN
      SELECT name INTO top_scorer_name FROM public.players WHERE id = NEW.motm_player_id;
      IF top_scorer_name IS NOT NULL THEN
        news_content := news_content || ' ' || top_scorer_name || ' was named Man of the Match.';
      END IF;
    END IF;
    
    -- Check if there's already a news article for this game, update it if found
    IF EXISTS (SELECT 1 FROM public.news WHERE title = news_title AND category = 'match-result') THEN
      UPDATE public.news
      SET 
        excerpt = news_excerpt,
        content = news_content,
        published_at = NOW()
      WHERE title = news_title AND category = 'match-result';
    ELSE
      -- Insert the news article if not found
      INSERT INTO public.news (title, excerpt, content, author, category, featured, published_at)
      VALUES (
        news_title,
        news_excerpt,
        news_content,
        'System',
        'match-result',
        CASE WHEN our_score > their_score THEN true ELSE false END,
        NOW()
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic news generation (fixed to work with both INSERT and UPDATE)
DROP TRIGGER IF EXISTS trigger_generate_game_news ON public.games;
CREATE TRIGGER trigger_generate_game_news
  AFTER INSERT OR UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION generate_game_news();

-- Enable realtime for all tables
ALTER TABLE public.team_branding REPLICA IDENTITY FULL;
ALTER TABLE public.team_statistics REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_branding;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_statistics;

-- Create storage bucket for team logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team_logos', 'Team Logos', true);

-- Create policy to allow anyone to read team logos
CREATE POLICY "Allow public read access to team logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team_logos');

-- Create policy to allow authenticated users to upload team logos
CREATE POLICY "Allow authenticated users to upload team logos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'team_logos');

-- Create policy to allow authenticated users to update team logos
CREATE POLICY "Allow authenticated users to update team logos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'team_logos');

-- Create policy to allow authenticated users to delete team logos
CREATE POLICY "Allow authenticated users to delete team logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'team_logos');
