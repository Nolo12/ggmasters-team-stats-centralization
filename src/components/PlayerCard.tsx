
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  motmAwards: number;
  matchesPlayed: number;
}

interface PlayerCardProps {
  player: Player;
  rank?: number;
}

const PlayerCard = ({ player, rank }: PlayerCardProps) => {
  const isTopRank = rank && rank <= 3;
  
  return (
    <Card className={`transition-all duration-300 hover:-translate-y-1 bg-gray-800/80 border-gray-700 hover:shadow-xl ${
      isTopRank ? 'hover:shadow-cyan-500/20 ring-1 ring-cyan-500/30' : 'hover:shadow-purple-500/10'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{player.name}</h3>
            <p className="text-sm text-gray-400">{player.position}</p>
          </div>
          {rank && (
            <div className={`text-2xl font-bold ${
              rank === 1 ? 'text-yellow-400' :
              rank === 2 ? 'text-gray-300' :
              rank === 3 ? 'text-orange-400' : 'text-cyan-400'
            }`}>
              #{rank}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{player.goals}</div>
            <div className="text-xs text-gray-400">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{player.assists}</div>
            <div className="text-xs text-gray-400">Assists</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300">{player.motmAwards} MOTM</span>
          </div>
          <div className="flex gap-2">
            {player.yellowCards > 0 && (
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                {player.yellowCards} Yellow
              </Badge>
            )}
            {player.redCards > 0 && (
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                {player.redCards} Red
              </Badge>
            )}
          </div>
        </div>
        
        {player.matchesPlayed > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Users className="h-3 w-3" />
              <span>{player.matchesPlayed} matches played</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
