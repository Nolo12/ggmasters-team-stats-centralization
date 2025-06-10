
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
        return "bg-green-100 text-green-800";
      case "player-news":
        return "bg-blue-100 text-blue-800";
      case "team-update":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(article.category)}>
            {getCategoryLabel(article.category)}
          </Badge>
          {article.featured && (
            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
          )}
        </div>
        <CardTitle className="text-xl text-gray-900 line-clamp-2">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
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
