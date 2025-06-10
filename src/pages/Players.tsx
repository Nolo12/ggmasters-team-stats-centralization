
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import PlayerCard from "@/components/PlayerCard";
import { useTeamData } from "@/hooks/useTeamData";
import { Users, Search, Filter, Trophy, Target } from "lucide-react";

const Players = () => {
  const { players } = useTeamData();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("goals");

  const filteredPlayers = players
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (positionFilter === "all" || player.position === positionFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "goals":
          return b.goals - a.goals;
        case "assists":
          return b.assists - a.assists;
        case "motm":
          return b.motmAwards - a.motmAwards;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const positions = [...new Set(players.map(p => p.position))];
  const topScorer = players.reduce((top, player) => player.goals > top.goals ? player : top);
  const topAssister = players.reduce((top, player) => player.assists > top.assists ? player : top);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Users className="text-blue-600" />
            Team Squad
          </h1>
          <p className="text-xl text-gray-600">Meet our talented players and their statistics</p>
        </div>

        {/* Team Leaders */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Scorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topScorer.name}</div>
              <div className="text-green-100">{topScorer.goals} goals this season</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Assist Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topAssister.name}</div>
              <div className="text-blue-100">{topAssister.assists} assists this season</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map(position => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goals">Goals</SelectItem>
                  <SelectItem value="assists">Assists</SelectItem>
                  <SelectItem value="motm">MOTM Awards</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Players Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player, index) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              rank={sortBy === "goals" ? index + 1 : undefined}
            />
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Players Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Players;
