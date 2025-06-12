
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, Calendar, MapPin, Star, AlertTriangle, Shield, Newspaper, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useDatabase } from "@/hooks/useDatabase";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { stats, loading, getRecentMatches, players, games, news } = useDatabase();
  const recentMatches = getRecentMatches();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get top performers by MOTM awards
  const topPerformers = [...players]
    .filter(player => player.motm_awards > 0)
    .sort((a, b) => b.motm_awards - a.motm_awards)
    .slice(0, 5);

  // Get disciplinary records
  const disciplinaryRecords = [...players]
    .filter(player => player.yellow_cards > 0 || player.red_cards > 0)
    .sort((a, b) => (b.yellow_cards + b.red_cards * 2) - (a.yellow_cards + a.red_cards * 2))
    .slice(0, 7);

  // Get upcoming matches
  const upcomingMatches = games
    .filter(game => game.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get recent news
  const recentNews = news.slice(0, 4);

  const getResultBadge = (result: 'W' | 'D' | 'L') => {
    const colors = {
      W: 'bg-green-500/20 text-green-400 border-green-500/30',
      D: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      L: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[result]}`;
  };

  const getRankingBadge = (rank: number) => {
    const colors = {
      1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900',
      2: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900',
      3: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
    };
    return colors[rank as keyof typeof colors] || 'bg-gray-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              GG Masters FC
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Welcome to the official home of GG Masters FC. Follow our journey, meet our players, and stay updated with the latest news and match results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25">
              <Link to="/matches">View Matches</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              <Link to="/players">Meet the Squad</Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Season Overview */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Season Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalMatches}</div>
                <div className="text-sm text-gray-400">Matches Played</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.wins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.draws}</div>
                <div className="text-sm text-gray-400">Draws</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{stats.losses}</div>
                <div className="text-sm text-gray-400">Losses</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">{stats.goalsFor}</div>
                <div className="text-sm text-gray-400">Goals For</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">{stats.goalsAgainst}</div>
                <div className="text-sm text-gray-400">Goals Against</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">{stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}</div>
                <div className="text-sm text-gray-400">Goal Difference</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-amber-400 mb-2">{stats.points}</div>
                <div className="text-sm text-gray-400">Points</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      {topPerformers.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <Star className="inline h-8 w-8 text-yellow-400 mr-2" />
              Top Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {topPerformers.map((player, index) => (
                <Card key={player.id} className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                  {index < 3 && (
                    <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRankingBadge(index + 1)} animate-pulse`}>
                      {index + 1}
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-semibold text-white mb-2">{player.name}</div>
                    <div className="text-sm text-gray-400 mb-3">{player.position}</div>
                    <div className="flex items-center justify-center space-x-1">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-2xl font-bold text-yellow-400">{player.motm_awards}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">MOTM Awards</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disciplinary Records Section */}
      {disciplinaryRecords.length > 0 && (
        <section className="py-16 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <AlertTriangle className="inline h-8 w-8 text-red-400 mr-2" />
              Disciplinary Records
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {disciplinaryRecords.map((player) => (
                <Card key={player.id} className="bg-gray-800/80 border-gray-700 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold text-white mb-1">{player.name}</div>
                    <div className="text-xs text-gray-400 mb-3">{player.position}</div>
                    <div className="flex items-center space-x-3">
                      {player.yellow_cards > 0 && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          🟨 {player.yellow_cards}
                        </Badge>
                      )}
                      {player.red_cards > 0 && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          🟥 {player.red_cards}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <Calendar className="inline h-8 w-8 text-cyan-400 mr-2" />
              Upcoming Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <Card key={match.id} className="bg-gray-800/80 border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        UPCOMING
                      </Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">vs {match.opponent}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center justify-center text-lg font-bold text-cyan-400 mb-4">
                      GG Masters FC vs {match.opponent}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.is_home ? 'Home' : 'Away'} • {match.venue || 'TBD'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <section className="py-16 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Recent Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentMatches.map((match) => (
                <Card key={match.id} className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className={getResultBadge(match.result)}>
                        {match.result === 'W' ? 'WIN' : match.result === 'D' ? 'DRAW' : 'LOSS'}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white">vs {match.opponent}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">GG Masters FC</div>
                        <div className="text-3xl font-bold text-white">{match.ourScore}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-500">-</div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-300">{match.opponent}</div>
                        <div className="text-3xl font-bold text-white">{match.theirScore}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.is_home ? 'Home' : 'Away'} • {match.venue || 'TBD'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Link to="/matches">View All Matches</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Auto-Generated News Section */}
      {recentNews.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              <Newspaper className="inline h-8 w-8 text-purple-400 mr-2" />
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentNews.map((article) => (
                <Card key={article.id} className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {article.category === 'match-result' ? 'Match Result' : 
                         article.category === 'player-news' ? 'Player News' : 'Team Update'}
                      </Badge>
                      {article.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Link to="/news">View All News</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/80 border-gray-700 text-center hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Follow our latest matches and see how we're performing this season.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white hover:border-transparent">
                  <Link to="/matches">View Matches</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700 text-center hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Our Squad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Meet our talented players and see their stats and achievements.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent">
                  <Link to="/players">View Players</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700 text-center hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader>
                <Target className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Latest News</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Stay updated with the latest team news, player updates, and match reports.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent">
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
