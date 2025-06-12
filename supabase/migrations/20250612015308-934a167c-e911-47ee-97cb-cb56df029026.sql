
-- Create or replace the trigger function to update team statistics
CREATE OR REPLACE FUNCTION public.update_team_statistics()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
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

  -- Update or insert team statistics (ensure there's always a record)
  INSERT INTO public.team_statistics (id, matches_played, wins, draws, losses, goals_for, goals_against, goal_difference, points)
  VALUES (gen_random_uuid(), total_matches, total_wins, total_draws, total_losses, total_goals_for, total_goals_against, calculated_goal_difference, calculated_points)
  ON CONFLICT (id) DO UPDATE SET
    matches_played = EXCLUDED.matches_played,
    wins = EXCLUDED.wins,
    draws = EXCLUDED.draws,
    losses = EXCLUDED.losses,
    goals_for = EXCLUDED.goals_for,
    goals_against = EXCLUDED.goals_against,
    goal_difference = EXCLUDED.goal_difference,
    points = EXCLUDED.points,
    updated_at = NOW();

  -- If no records exist, create one
  IF NOT EXISTS (SELECT 1 FROM public.team_statistics) THEN
    INSERT INTO public.team_statistics (matches_played, wins, draws, losses, goals_for, goals_against, goal_difference, points)
    VALUES (total_matches, total_wins, total_draws, total_losses, total_goals_for, total_goals_against, calculated_goal_difference, calculated_points);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger to automatically update team statistics when games are modified
DROP TRIGGER IF EXISTS trigger_update_team_statistics ON public.games;
CREATE TRIGGER trigger_update_team_statistics
  AFTER INSERT OR UPDATE OR DELETE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_statistics();

-- Ensure we have at least one team statistics record
INSERT INTO public.team_statistics (matches_played, wins, draws, losses, goals_for, goals_against, goal_difference, points)
SELECT 0, 0, 0, 0, 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM public.team_statistics);
