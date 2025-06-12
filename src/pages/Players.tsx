import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PlayerCard from "@/components/PlayerCard";
import { useDatabase } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Trophy, AlertTriangle } from "lucide-react";

const Players = () => {
  const { players, loading } = useDatabase();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'default' | 'motm' | 'disciplinary' | 'goals'>('default');

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'motm') {
      setSortBy('motm');
      // Auto-scroll to top after a short delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (filter === 'disciplinary') {
      setSortBy('disciplinary');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (filter === 'goals') {
      setSortBy('goals');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const getSortedPlayers = () => {
    const sortedPlayers = [...players];
    
    switch (sortBy) {
      case 'motm':
        return sortedPlayers.sort((a, b) => b.motm_awards - a.motm_awards);
      case 'disciplinary':
        return sortedPlayers.sort((a, b) => 
          (b.yellow_cards + b.red_cards * 2) - (a.yellow_cards + a.red_cards * 2)
        );
      case 'goals':
        return sortedPlayers.sort((a, b) => b.goals - a.goals);
      default:
        return sortedPlayers.sort((a, b) => b.goals - a.goals);
    }
  };

  const getSortTitle = () => {
    switch (sortBy) {
      case 'motm':
        return '🏆 Players by MOTM Awards';
      case 'disciplinary':
        return '🚨 Players by Disciplinary Record';
      case 'goals':
        return '⚽ Players by Goals Scored';
      default:
        return 'Our Squad';
    }
  };

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

  const sortedPlayers = getSortedPlayers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {getSortTitle()}
          </h1>
          <p className="text-xl text-gray-300">Meet the talented players of GG Masters FC</p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={() => setSortBy('default')}
            variant={sortBy === 'default' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              sortBy === 'default' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Trophy className="h-4 w-4" />
            All Players
          </Button>
          <Button
            onClick={() => setSortBy('goals')}
            variant={sortBy === 'goals' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              sortBy === 'goals' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ⚽ Top Scorers
          </Button>
          <Button
            onClick={() => setSortBy('motm')}
            variant={sortBy === 'motm' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              sortBy === 'motm' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🏆 MOTM Leaders
          </Button>
          <Button
            onClick={() => setSortBy('disciplinary')}
            variant={sortBy === 'disciplinary' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              sortBy === 'disciplinary' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Disciplinary
          </Button>
        </div>

        {/* Player Cards */}
        {sortedPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className={`${index < 3 && sortBy !== 'default' ? 'animate-pulse' : ''}`}>
                <PlayerCard 
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
                  rank={sortBy !== 'default' ? index + 1 : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No players found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
