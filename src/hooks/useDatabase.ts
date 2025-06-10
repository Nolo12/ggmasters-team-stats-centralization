
import { useState, useEffect } from "react";
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

export const useDatabase = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
    
    // Subscribe to changes with proper cleanup
    const playersChannel = supabase
      .channel('players-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'players' },
        () => fetchPlayers()
      )
      .subscribe();

    const gamesChannel = supabase
      .channel('games-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'games' },
        () => fetchGames()
      )
      .subscribe();

    const newsChannel = supabase
      .channel('news-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'news' },
        () => fetchNews()
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(newsChannel);
    };
  }, []); // Empty dependency array to run only once

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPlayers(), fetchGames(), fetchNews()]);
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
    
    // Type-safe transformation
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
    
    // Type-safe transformation
    const typedNews: NewsArticle[] = (data || []).map(article => ({
      ...article,
      category: article.category as "match-result" | "player-news" | "team-update"
    }));
    
    setNews(typedNews);
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

  const stats = {
    totalMatches: games.length,
    wins: games.filter(g => {
      if (g.status !== "completed" || g.home_score === null || g.away_score === null) return false;
      const ourScore = g.is_home ? g.home_score : g.away_score;
      const theirScore = g.is_home ? g.away_score : g.home_score;
      return ourScore > theirScore;
    }).length,
    totalGoals: players.reduce((sum, player) => sum + player.goals, 0),
    totalPlayers: players.length
  };

  return {
    players,
    games,
    news,
    stats,
    loading,
    addPlayer,
    updatePlayer,
    addGame,
    updateGame,
    addNews,
    refetch: fetchAllData
  };
};
