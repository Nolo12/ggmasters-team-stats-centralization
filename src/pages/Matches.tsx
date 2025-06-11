
import Navigation from "@/components/Navigation";
import MatchCard from "@/components/MatchCard";
import { useDatabase } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Matches = () => {
  const { games, loading } = useDatabase();

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

  // Sort games by date (newest first)
  const sortedGames = [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const upcomingMatches = sortedGames.filter(match => match.status === "upcoming");
  const completedMatches = sortedGames.filter(match => match.status === "completed");

  const getMatchResult = (game: any) => {
    if (game.status !== 'completed' || game.home_score === null || game.away_score === null) return null;
    
    const ourScore = game.is_home ? game.home_score : game.away_score;
    const theirScore = game.is_home ? game.away_score : game.home_score;
    
    if (ourScore > theirScore) return 'W';
    if (ourScore < theirScore) return 'L';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Matches
          </h1>
          <p className="text-xl text-gray-600">
            Follow GG Masters FC's journey through the season
          </p>
        </div>

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📅 Upcoming Fixtures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    opponent: match.opponent,
                    date: match.date,
                    venue: match.venue || "TBD",
                    homeScore: match.home_score || undefined,
                    awayScore: match.away_score || undefined,
                    status: match.status === "cancelled" ? "cancelled" : match.status,
                    isHome: match.is_home,
                    motm: match.players?.name
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {completedMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📊 Match Results
              <span className="text-sm font-normal text-gray-600">(Latest first)</span>
            </h2>
            
            {/* Quick Results Overview */}
            <Card className="mb-6 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {completedMatches.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {completedMatches.filter(game => getMatchResult(game) === 'W').length}
                    </div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {completedMatches.filter(game => getMatchResult(game) === 'D').length}
                    </div>
                    <div className="text-sm text-gray-600">Draws</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {completedMatches.filter(game => getMatchResult(game) === 'L').length}
                    </div>
                    <div className="text-sm text-gray-600">Losses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    id: match.id,
                    opponent: match.opponent,
                    date: match.date,
                    venue: match.venue || "TBD",
                    homeScore: match.home_score || undefined,
                    awayScore: match.away_score || undefined,
                    status: match.status === "cancelled" ? "cancelled" : match.status,
                    isHome: match.is_home,
                    motm: match.players?.name
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No matches found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
