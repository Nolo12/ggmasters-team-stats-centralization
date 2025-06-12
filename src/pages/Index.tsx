
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useDatabase } from "@/hooks/useDatabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, User, AlertTriangle, Target, Eye } from "lucide-react";
import AdminLogin from "@/components/AdminLogin";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { players, games, news, stats, loading, teamBranding } = useDatabase();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin login if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={() => navigate('/admin')} />;
  }

  // Get top performers by MOTM
  const topPerformers = players
    .filter(p => p.motm_awards > 0)
    .sort((a, b) => b.motm_awards - a.motm_awards)
    .slice(0, 10);

  // Get disciplinary records
  const disciplinaryRecords = players
    .filter(p => p.yellow_cards > 0 || p.red_cards > 0)
    .sort((a, b) => (b.yellow_cards + b.red_cards * 2) - (a.yellow_cards + a.red_cards * 2))
    .slice(0, 7);

  // Get top goal scorers
  const topGoalScorers = players
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  // Get next upcoming match
  const upcomingMatches = games
    .filter(game => game.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get recent news
  const recentNews = news
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 4);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-cyan-500/25">
              {teamBranding?.logo_url ? (
                <img 
                  src={teamBranding.logo_url} 
                  alt="Team Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              ) : (
                <Trophy className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {teamBranding?.team_name || 'GG Masters FC'}
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Welcome to the official home of {teamBranding?.team_name || 'GG Masters FC'}. Follow our journey, celebrate our victories, and be part of our community.
          </p>
          
          {/* Admin Login Button */}
          <Button
            onClick={() => setShowAdminLogin(true)}
            variant="outline"
            className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Admin Login
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Season Overview */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-cyan-500" />
                  Season Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{stats.totalMatches}</div>
                    <div className="text-sm text-gray-400">Matches</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
                    <div className="text-sm text-gray-400">Wins</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{stats.draws}</div>
                    <div className="text-sm text-gray-400">Draws</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
                    <div className="text-sm text-gray-400">Losses</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{stats.goalsFor}</div>
                    <div className="text-sm text-gray-400">Goals For</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{stats.goalsAgainst}</div>
                    <div className="text-sm text-gray-400">Goals Against</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className={`text-2xl font-bold ${stats.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.goalDifference >= 0 ? '+' : ''}{stats.goalDifference}
                    </div>
                    <div className="text-sm text-gray-400">Goal Diff</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{stats.points}</div>
                    <div className="text-sm text-gray-400">Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Goal Scorers */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  🔥 Top Goal Scorers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topGoalScorers.length > 0 ? (
                  <div className="space-y-3">
                    {topGoalScorers.map((player, index) => (
                      <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 ring-1 ring-yellow-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
                      }`}>
                        <div className="flex items-center gap-3">
                          {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{player.goals}</div>
                          <div className="text-xs text-gray-400">goals</div>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => navigate('/players?filter=goals')}
                      variant="outline"
                      className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No goal scorers yet this season.</p>
                )}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  🌟 Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.map((player, index) => (
                      <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        index < 3 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 ring-1 ring-purple-500/30 animate-pulse' : 'bg-gray-700/50 hover:bg-gray-700'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-300 text-black' :
                            index === 2 ? 'bg-orange-400 text-black' : 'bg-gray-600 text-white'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">{player.motm_awards}</div>
                          <div className="text-xs text-gray-400">MOTM</div>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => navigate('/players?filter=motm')}
                      variant="outline"
                      className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No MOTM awards yet this season.</p>
                )}
              </CardContent>
            </Card>

            {/* Disciplinary Records */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  🚨 Disciplinary Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {disciplinaryRecords.length > 0 ? (
                  <div className="space-y-3">
                    {disciplinaryRecords.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {player.yellow_cards > 0 && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {player.yellow_cards} Yellow
                            </Badge>
                          )}
                          {player.red_cards > 0 && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              {player.red_cards} Red
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => navigate('/players?filter=disciplinary')}
                      variant="outline"
                      className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All Cards
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Clean disciplinary record this season!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  📅 Upcoming Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(match.date)}
                        </div>
                        <div className="text-white font-semibold mb-2">
                          vs {match.opponent}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MapPin className="h-4 w-4" />
                          {match.is_home ? 'Home' : 'Away'} - {match.venue}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No upcoming matches scheduled.</p>
                )}
              </CardContent>
            </Card>

            {/* Latest News */}
            <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  📰 Latest News
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentNews.length > 0 ? (
                  <div className="space-y-4">
                    {recentNews.map((article) => (
                      <div key={article.id} className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${
                            article.category === 'match-result' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            article.category === 'player-news' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }`}>
                            {article.category === 'match-result' ? 'Match' :
                             article.category === 'player-news' ? 'Player' : 'Team'}
                          </Badge>
                          {article.featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No news available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
