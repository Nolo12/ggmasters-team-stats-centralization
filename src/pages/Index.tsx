
import Navigation from "@/components/Navigation";
import MatchCard from "@/components/MatchCard";
import PlayerCard from "@/components/PlayerCard";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/hooks/useDatabase";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";

const Index = () => {
  const { players, games, news, stats, loading } = useDatabase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const recentMatches = games.slice(0, 3);
  const topPlayers = players.slice(0, 4);
  const featuredNews = news.filter(article => article.featured).slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Thunder FC
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Excellence on the field, unity in our hearts. Follow our journey as we strive for greatness in every match.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Latest Matches
            </Button>
            <Button size="lg" variant="outline">
              View Squad
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.wins}</div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalGoals}</div>
            <div className="text-sm text-gray-600">Goals</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</div>
            <div className="text-sm text-gray-600">Players</div>
          </div>
        </div>

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recent Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    opponent: match.opponent,
                    date: match.date,
                    venue: match.venue || "TBD",
                    homeScore: match.home_score || undefined,
                    awayScore: match.away_score || undefined,
                    status: match.status,
                    isHome: match.is_home,
                    motm: match.players?.name
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Top Players */}
        {topPlayers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlayers.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={{
                    id: player.id,
                    name: player.name,
                    position: player.position,
                    goals: player.goals,
                    assists: player.assists,
                    yellowCards: player.yellow_cards,
                    redCards: player.red_cards,
                    motmAwards: player.motm_awards,
                    matchesPlayed: player.matches_played
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest News</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={{
                    id: article.id,
                    title: article.title,
                    excerpt: article.excerpt || "",
                    content: article.content || "",
                    author: article.author,
                    date: new Date(article.published_at).toLocaleDateString(),
                    category: article.category,
                    featured: article.featured
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
