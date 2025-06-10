
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
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.position}</p>
          </div>
          {rank && (
            <div className="text-2xl font-bold text-blue-600">#{rank}</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{player.goals}</div>
            <div className="text-xs text-gray-600">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{player.assists}</div>
            <div className="text-xs text-gray-600">Assists</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{player.motmAwards} MOTM</span>
          </div>
          <div className="flex gap-2">
            {player.yellowCards > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {player.yellowCards} Yellow
              </Badge>
            )}
            {player.redCards > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {player.redCards} Red
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
