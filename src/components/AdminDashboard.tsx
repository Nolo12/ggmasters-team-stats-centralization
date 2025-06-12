
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, Trophy, LogOut } from "lucide-react";
import PlayersManager from "@/components/PlayersManager";
import GamesManager from "@/components/GamesManager";
import NewsManager from "@/components/NewsManager";
import TeamBrandingManager from "@/components/TeamBrandingManager";

const AdminDashboard = () => {
  const { stats, loading } = useDatabase();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear any session data (if using localStorage)
    localStorage.removeItem('adminSession');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
    
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GG Masters FC Admin</h1>
                <p className="text-sm text-gray-600">Team Management Dashboard</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals For/Against</CardTitle>
              <span className="text-lg">⚽</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.goalsFor}/{stats.goalsAgainst}</div>
              <p className="text-xs text-muted-foreground">
                GD: {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
              </p>
            </CardContent>
          </Card>
          
          <Card>
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Squad Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">Active players</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="games">🎮 Games</TabsTrigger>
            <TabsTrigger value="players">👥 Players</TabsTrigger>
            <TabsTrigger value="branding">🖼️ Branding</TabsTrigger>
            <TabsTrigger value="news">🗞️ News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games">
            <GamesManager />
          </TabsContent>
          
          <TabsContent value="players">
            <PlayersManager />
          </TabsContent>
          
          <TabsContent value="branding">
            <TeamBrandingManager />
          </TabsContent>
          
          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
