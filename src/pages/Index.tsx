
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/hooks/useDatabase";
import { Trophy, Target, Award, Users, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { stats, teamBranding, loading, getRecentMatches } = useDatabase();
  const navigate = useNavigate();
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

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-100 text-green-800';
      case 'L': return 'bg-red-100 text-red-800';
      case 'D': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {teamBranding?.logo_url && (
              <img 
                src={teamBranding.logo_url} 
                alt="Team Logo" 
                className="w-20 h-20 mr-4 object-contain"
              />
            )}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                {teamBranding?.team_name || 'GG Masters FC'}
              </h1>
              <p className="text-xl text-gray-600">
                Excellence in Every Game
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/matches")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Matches
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/players")}
            >
              <Users className="mr-2 h-5 w-5" />
              Our Squad
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/admin/login")}
            >
              Admin Login
            </Button>
          </div>
        </div>

        {/* Season Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                W: {stats.wins} D: {stats.draws} L: {stats.losses}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.goalsFor}/{stats.goalsAgainst}</div>
              <p className="text-xs text-muted-foreground">
                GD: {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.points}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMatches > 0 ? (stats.points / stats.totalMatches).toFixed(1) : '0.0'} per game
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Squad</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">Active players</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getResultColor(match.result)}>
                        {match.result}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 mb-1">
                        vs {match.opponent}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {match.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <Award className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">
                Join the Journey
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Follow GG Masters FC as we compete with passion and determination
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/matches")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                View All Matches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
