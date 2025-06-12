
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useDatabase } from "@/hooks/useDatabase";

const Index = () => {
  const { stats, loading, getRecentMatches } = useDatabase();
  const recentMatches = getRecentMatches();

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

  const getResultBadge = (result: 'W' | 'D' | 'L') => {
    const colors = {
      W: 'bg-green-100 text-green-800 border-green-200',
      D: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      L: 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[result]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            GG Masters FC
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to the official home of GG Masters FC. Follow our journey, meet our players, and stay updated with the latest news and match results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/matches">View Matches</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/players">Meet the Squad</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Season Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalMatches}</div>
                <div className="text-sm text-gray-600">Matches Played</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.wins}</div>
                <div className="text-sm text-gray-600">Wins</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.draws}</div>
                <div className="text-sm text-gray-600">Draws</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.losses}</div>
                <div className="text-sm text-gray-600">Losses</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">{stats.goalsFor}</div>
                <div className="text-sm text-gray-600">Goals For</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-red-600 mb-2">{stats.goalsAgainst}</div>
                <div className="text-sm text-gray-600">Goals Against</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600 mb-2">{stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}</div>
                <div className="text-sm text-gray-600">Goal Difference</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-amber-600 mb-2">{stats.points}</div>
                <div className="text-sm text-gray-600">Points</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Recent Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className={getResultBadge(match.result)}>
                        {match.result === 'W' ? 'WIN' : match.result === 'D' ? 'DRAW' : 'LOSS'}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg">vs {match.opponent}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">GG Masters FC</div>
                        <div className="text-3xl font-bold">{match.ourScore}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">-</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700">{match.opponent}</div>
                        <div className="text-3xl font-bold">{match.theirScore}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.is_home ? 'Home' : 'Away'} • {match.venue || 'TBD'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/matches">View All Matches</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Follow our latest matches and see how we're performing this season.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/matches">View Matches</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Our Squad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Meet our talented players and see their stats and achievements.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/players">View Players</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stay updated with the latest team news, player updates, and match reports.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/news">Read News</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
