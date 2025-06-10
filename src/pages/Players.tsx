
import Navigation from "@/components/Navigation";
import PlayerCard from "@/components/PlayerCard";
import { useDatabase } from "@/hooks/useDatabase";

const Players = () => {
  const { players, loading } = useDatabase();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Squad
          </h1>
          <p className="text-xl text-gray-600">
            Meet the talented players of Thunder FC
          </p>
        </div>

        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <PlayerCard 
                key={player.id} 
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No players found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
