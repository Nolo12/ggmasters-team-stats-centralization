
import Navigation from "@/components/Navigation";
import { useDatabase } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, TrendingUp, MapPin, Clock, Award, AlertTriangle } from "lucide-react";

const Index = () => {
  const { players, games, news, stats, teamBranding, loading } = useDatabase();

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

  // Get recent matches (latest 3 completed games)
  const recentMatches = games
    .filter(game => game.status === 'completed')
    .slice(0, 3);

  // Get upcoming fixtures (next 3 upcoming games)
  const upcomingFixtures = games
    .filter(game => game.status === 'upcoming')
    .slice(0, 3);

  // Get top MOTM performers (top 10)
  const topPerformers = players
    .filter(player => player.motm_awards > 0)
    .sort((a, b) => b.motm_awards - a.motm_awards)
    .slice(0, 10);

  // Get disciplinary records
  const yellowCardLeaders = players
    .filter(player => player.yellow_cards > 0)
    .sort((a, b) => b.yellow_cards - a.yellow_cards)
    .slice(0, 10);

  const redCardLeaders = players
    .filter(player => player.red_cards > 0)
    .sort((a, b) => b.red_cards - a.red_cards)
    .slice(0, 10);

  // Get featured news (latest 2 featured articles)
  const featuredNews = news
    .filter(article => article.featured)
    .slice(0, 2);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const getMatchResult = (game: any) => {
    if (game.status !== 'completed' || !game.home_score !== null || !game.away_score !== null) return '';
    
    const ourScore = game.is_home ? game.home_score : game.away_score;
    const theirScore = game.is_home ? game.away_score : game.home_score;
    
    if (ourScore > theirScore) return 'W';
    if (ourScore < theirScore) return 'L';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            {teamBranding?.logo_url && (
              <img 
                src={teamBranding.logo_url} 
                alt="Team Logo" 
                className="w-24 h-24 object-contain mr-4"
              />
            )}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              {teamBranding?.team_name || 'GG Masters FC'}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Excellence on the field, unity in our hearts. Follow our journey as we strive for greatness in every match.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleNavigation('/matches')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Latest Matches
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleNavigation('/players')}
            >
              <Users className="h-5 w-5 mr-2" />
              View Squad
            </Button>
          </div>
        </div>

        {/* Quick Stats Card */}
        <Card className="mb-16 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Season Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalMatches}</div>
                <div className="text-sm text-gray-600">MP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
                <div className="text-sm text-gray-600">W</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
                <div className="text-sm text-gray-600">D</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
                <div className="text-sm text-gray-600">L</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.goalsFor}</div>
                <div className="text-sm text-gray-600">GF</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.goalsAgainst}</div>
                <div className="text-sm text-gray-600">GA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
                </div>
                <div className="text-sm text-gray-600">GD</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{stats.points}</div>
                <div className="text-sm text-gray-600">Pts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Recent Matches */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Recent Matches</h2>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/matches')}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <Card key={match.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            getMatchResult(match) === 'W' ? 'bg-green-500' :
                            getMatchResult(match) === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            {getMatchResult(match)}
                          </div>
                          <div>
                            <div className="font-semibold">vs {match.opponent}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(match.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">
                          {match.is_home 
                            ? `${match.home_score} - ${match.away_score}`
                            : `${match.away_score} - ${match.home_score}`
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center text-gray-600">
                    No recent matches found
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Upcoming Fixtures Sidebar */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Fixtures</h3>
            <div className="space-y-3">
              {upcomingFixtures.length > 0 ? (
                upcomingFixtures.map((fixture) => (
                  <Card key={fixture.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-semibold text-center">vs {fixture.opponent}</div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {fixture.is_home ? (fixture.venue || 'Home') : 'Away'}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {new Date(fixture.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center text-gray-600">
                    No upcoming fixtures
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Top Performers & Disciplinary Records */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Top MOTM Performers */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Top Performers
            </h3>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                {topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-700">
                            {index + 1}
                          </div>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.motm_awards} MOTM{player.motm_awards !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 py-4">
                    No MOTM awards yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Yellow Cards */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-4 h-6 bg-yellow-400 rounded-sm"></div>
              Yellow Cards
            </h3>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                {yellowCardLeaders.length > 0 ? (
                  <div className="space-y-3">
                    {yellowCardLeaders.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-700">
                            {index + 1}
                          </div>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.yellow_cards}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 py-4">
                    Clean record!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Red Cards */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-4 h-6 bg-red-500 rounded-sm"></div>
              Red Cards
            </h3>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                {redCardLeaders.length > 0 ? (
                  <div className="space-y-3">
                    {redCardLeaders.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-700">
                            {index + 1}
                          </div>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.red_cards}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 py-4">
                    Excellent discipline!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
              <Button 
                variant="outline"
                onClick={() => handleNavigation('/news')}
              >
                View All News
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((article) => (
                <Card key={article.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {article.category.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="text-sm text-gray-500">
                        By {article.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
