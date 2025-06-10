import Navigation from "@/components/Navigation";
import MatchCard from "@/components/MatchCard";
import { useDatabase } from "@/hooks/useDatabase";
const Matches = () => {
  const {
    games,
    loading
  } = useDatabase();
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>;
  }
  const upcomingMatches = games.filter(match => match.status === "upcoming");
  const completedMatches = games.filter(match => match.status === "completed");
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Matches
          </h1>
          <p className="text-xl text-gray-600">Follow GG Masters FC's journey through the season</p>
        </div>

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map(match => <MatchCard key={match.id} match={{
            id: match.id,
            opponent: match.opponent,
            date: match.date,
            venue: match.venue || "TBD",
            homeScore: match.home_score || undefined,
            awayScore: match.away_score || undefined,
            status: match.status === "cancelled" ? "cancelled" : match.status,
            isHome: match.is_home,
            motm: match.players?.name
          }} />)}
            </div>
          </div>}

        {/* Recent Results */}
        {completedMatches.length > 0 && <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMatches.map(match => <MatchCard key={match.id} match={{
            id: match.id,
            opponent: match.opponent,
            date: match.date,
            venue: match.venue || "TBD",
            homeScore: match.home_score || undefined,
            awayScore: match.away_score || undefined,
            status: match.status === "cancelled" ? "cancelled" : match.status,
            isHome: match.is_home,
            motm: match.players?.name
          }} />)}
            </div>
          </div>}

        {games.length === 0 && <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No matches found. Check back soon!</p>
          </div>}
      </div>
    </div>;
};
export default Matches;