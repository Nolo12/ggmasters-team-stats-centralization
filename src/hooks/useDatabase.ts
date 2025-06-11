
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  motm_awards: number;
  matches_played: number;
}

interface Game {
  id: string;
  date: string;
  opponent: string;
  venue: string;
  is_home: boolean;
  home_score: number | null;
  away_score: number | null;
  status: "upcoming" | "completed" | "cancelled";
  motm_player_id: string | null;
  players?: { name: string };
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: string;
  category: "match-result" | "player-news" | "team-update";
  featured: boolean;
  published_at: string;
}

interface TeamStatistics {
  id: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

interface TeamBranding {
  id: string;
  logo_url: string | null;
  team_name: string;
}

export const useDatabase = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
  const [teamBranding, setTeamBranding] = useState<TeamBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    fetchAllData();
    
    // Only create subscriptions if they don't already exist
    if (!isSubscribedRef.current) {
      const playersChannel = supabase
        .channel('players-realtime-' + Math.random())
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'players' },
          () => fetchPlayers()
        )
        .subscribe();

      const gamesChannel = supabase
        .channel('games-realtime-' + Math.random())
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'games' },
          () => {
            fetchGames();
            fetchTeamStats();
          }
        )
        .subscribe();

      const newsChannel = supabase
        .channel('news-realtime-' + Math.random())
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'news' },
          () => fetchNews()
        )
        .subscribe();

      const teamStatsChannel = supabase
        .channel('team-stats-realtime-' + Math.random())
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'team_statistics' },
          () => fetchTeamStats()
        )
        .subscribe();

      const brandingChannel = supabase
        .channel('branding-realtime-' + Math.random())
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'team_branding' },
          () => fetchTeamBranding()
        )
        .subscribe();

      // Store channel references
      channelsRef.current = [playersChannel, gamesChannel, newsChannel, teamStatsChannel, brandingChannel];
      isSubscribedRef.current = true;
    }

    // Cleanup function
    return () => {
      if (channelsRef.current.length > 0) {
        channelsRef.current.forEach(channel => {
          supabase.removeChannel(channel);
        });
        channelsRef.current = [];
        isSubscribedRef.current = false;
      }
    };
  }, []); // Empty dependency array to run only once

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPlayers(), 
        fetchGames(), 
        fetchNews(), 
        fetchTeamStats(), 
        fetchTeamBranding()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('goals', { ascending: false });
    
    if (error) {
      console.error("Error fetching players:", error);
      return;
    }
    setPlayers(data || []);
  };

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        players:motm_player_id(name)
      `)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching games:", error);
      return;
    }
    
    const typedGames: Game[] = (data || []).map(game => ({
      ...game,
      status: game.status as "upcoming" | "completed" | "cancelled"
    }));
    
    setGames(typedGames);
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching news:", error);
      return;
    }
    
    const typedNews: NewsArticle[] = (data || []).map(article => ({
      ...article,
      category: article.category as "match-result" | "player-news" | "team-update"
    }));
    
    setNews(typedNews);
  };

  const fetchTeamStats = async () => {
    const { data, error } = await supabase
      .from('team_statistics')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching team stats:", error);
      return;
    }
    
    setTeamStats(data);
  };

  const fetchTeamBranding = async () => {
    const { data, error } = await supabase
      .from('team_branding')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching team branding:", error);
      return;
    }
    
    setTeamBranding(data);
  };

  const addPlayer = async (playerData: Omit<Player, 'id' | 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'motm_awards' | 'matches_played'>) => {
    const { error } = await supabase
      .from('players')
      .insert([playerData]);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add player",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Player added successfully",
    });
    return true;
  };

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    const { error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Player updated successfully",
    });
    return true;
  };

  const addGame = async (gameData: Omit<Game, 'id'>) => {
    const { error } = await supabase
      .from('games')
      .insert([gameData]);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add game",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Game added successfully",
    });
    return true;
  };

  const updateGame = async (id: string, updates: Partial<Game>) => {
    const { error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Game updated successfully",
    });
    return true;
  };

  const addNews = async (newsData: Omit<NewsArticle, 'id' | 'published_at'>) => {
    const { error } = await supabase
      .from('news')
      .insert([newsData]);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add news article",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "News article added successfully",
    });
    return true;
  };

  const uploadTeamLogo = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('team_logos')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
      return false;
    }
    
    const { data } = supabase.storage
      .from('team_logos')
      .getPublicUrl(fileName);
    
    const { error: updateError } = await supabase
      .from('team_branding')
      .update({ logo_url: data.publicUrl })
      .eq('id', teamBranding?.id);
    
    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update logo URL",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Team logo updated successfully",
    });
    return true;
  };

  const stats = {
    totalMatches: teamStats?.matches_played || 0,
    wins: teamStats?.wins || 0,
    draws: teamStats?.draws || 0,
    losses: teamStats?.losses || 0,
    totalGoals: teamStats?.goals_for || 0,
    totalPlayers: players.length,
    goalsFor: teamStats?.goals_for || 0,
    goalsAgainst: teamStats?.goals_against || 0,
    goalDifference: teamStats?.goal_difference || 0,
    points: teamStats?.points || 0
  };

  return {
    players,
    games,
    news,
    teamStats,
    teamBranding,
    stats,
    loading,
    addPlayer,
    updatePlayer,
    addGame,
    updateGame,
    addNews,
    uploadTeamLogo,
    refetch: fetchAllData
  };
};
