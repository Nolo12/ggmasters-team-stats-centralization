

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

      channelsRef.current = [playersChannel, gamesChannel, newsChannel, teamStatsChannel, brandingChannel];
      isSubscribedRef.current = true;
    }

    return () => {
      if (channelsRef.current.length > 0) {
        channelsRef.current.forEach(channel => {
          supabase.removeChannel(channel);
        });
        channelsRef.current = [];
        isSubscribedRef.current = false;
      }
    };
  }, []);

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
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('goals', { ascending: false });
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error("Error fetching players:", error);
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive",
      });
    }
  };

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          players:motm_player_id(name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const typedGames: Game[] = (data || []).map(game => ({
        ...game,
        status: game.status as "upcoming" | "completed" | "cancelled"
      }));
      
      setGames(typedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to fetch games",
        variant: "destructive",
      });
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      const typedNews: NewsArticle[] = (data || []).map(article => ({
        ...article,
        category: article.category as "match-result" | "player-news" | "team-update"
      }));
      
      setNews(typedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    }
  };

  const fetchTeamStats = async () => {
    try {
      const { data, error } = await supabase
        .from('team_statistics')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      setTeamStats(data);
    } catch (error) {
      console.error("Error fetching team stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team statistics",
        variant: "destructive",
      });
    }
  };

  const fetchTeamBranding = async () => {
    try {
      const { data, error } = await supabase
        .from('team_branding')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      setTeamBranding(data);
    } catch (error) {
      console.error("Error fetching team branding:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team branding",
        variant: "destructive",
      });
    }
  };

  const addPlayer = async (playerData: Omit<Player, 'id' | 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'motm_awards' | 'matches_played'>) => {
    try {
      const { error } = await supabase
        .from('players')
        .insert([playerData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Player added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding player:", error);
      toast({
        title: "Error",
        description: "Failed to add player",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Player updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating player:", error);
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
      return false;
    }
  };

  const addGame = async (gameData: Omit<Game, 'id'>) => {
    try {
      const { error } = await supabase
        .from('games')
        .insert([gameData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Game added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding game:", error);
      toast({
        title: "Error",
        description: "Failed to add game",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateGame = async (id: string, updates: Partial<Game>) => {
    try {
      const { error } = await supabase
        .from('games')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Force refresh team stats after game update to ensure sync
      await fetchTeamStats();
      
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating game:", error);
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      });
      return false;
    }
  };

  const addNews = async (newsData: Omit<NewsArticle, 'id' | 'published_at'>) => {
    try {
      const { error } = await supabase
        .from('news')
        .insert([newsData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "News article added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding news:", error);
      toast({
        title: "Error",
        description: "Failed to add news article",
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadTeamLogo = async (file: File) => {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPEG, PNG, and WebP images are allowed",
          variant: "destructive",
        });
        return false;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return false;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('team_logos')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('team_logos')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('team_branding')
        .update({ logo_url: data.publicUrl })
        .eq('id', teamBranding?.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: "Team logo updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get recent matches (last 3 completed matches)
  const getRecentMatches = () => {
    return games
      .filter(game => game.status === 'completed' && game.home_score !== null && game.away_score !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(game => {
        const ourScore = game.is_home ? game.home_score : game.away_score;
        const theirScore = game.is_home ? game.away_score : game.home_score;
        
        let result: 'W' | 'D' | 'L';
        if (ourScore! > theirScore!) result = 'W';
        else if (ourScore! < theirScore!) result = 'L';
        else result = 'D';
        
        return {
          id: game.id,
          opponent: game.opponent,
          score: `${ourScore}-${theirScore}`,
          result,
          date: game.date
        };
      });
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
    refetch: fetchAllData,
    getRecentMatches
  };
};

