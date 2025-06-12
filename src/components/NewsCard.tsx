
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: "match-result" | "player-news" | "team-update";
  featured: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "match-result":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "player-news":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "team-update":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "match-result":
        return "Match Result";
      case "player-news":
        return "Player News";
      case "team-update":
        return "Team Update";
      default:
        return "News";
    }
  };

  return (
    <Card className="bg-gray-800/80 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(article.category)}>
            {getCategoryLabel(article.category)}
          </Badge>
          {article.featured && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>
          )}
        </div>
        <CardTitle className="text-xl text-gray-100 line-clamp-2">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{article.date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
