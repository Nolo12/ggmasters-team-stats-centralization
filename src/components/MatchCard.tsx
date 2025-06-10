
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Match {
  id: string;
  opponent: string;
  date: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
  status: "completed" | "upcoming" | "cancelled";
  isHome: boolean;
  motm?: string;
}

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResult = () => {
    if (match.status !== "completed" || match.homeScore === undefined || match.awayScore === undefined) {
      return null;
    }
    
    const ourScore = match.isHome ? match.homeScore : match.awayScore;
    const theirScore = match.isHome ? match.awayScore : match.homeScore;
    
    if (ourScore > theirScore) return "Win";
    if (ourScore < theirScore) return "Loss";
    return "Draw";
  };

  const result = getResult();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={`${getStatusColor(match.status)} capitalize`}>
            {match.status}
          </Badge>
          {result && (
            <Badge 
              className={`${
                result === "Win" 
                  ? "bg-green-100 text-green-800" 
                  : result === "Loss" 
                  ? "bg-red-100 text-red-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {result}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {match.isHome ? "Thunder FC" : match.opponent} vs {match.isHome ? match.opponent : "Thunder FC"}
          </div>
          {match.status === "completed" && match.homeScore !== undefined && match.awayScore !== undefined && (
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {match.isHome ? match.homeScore : match.awayScore} - {match.isHome ? match.awayScore : match.homeScore}
            </div>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{match.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{match.venue}</span>
          </div>
          {match.motm && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 text-yellow-500">⭐</div>
              <span>MOTM: {match.motm}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
