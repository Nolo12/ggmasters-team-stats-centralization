
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import NewsCard from "@/components/NewsCard";
import { useTeamData } from "@/hooks/useTeamData";
import { Newspaper, Search, Calendar, User, Star } from "lucide-react";

const News = () => {
  const { news } = useTeamData();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "all" || article.category === categoryFilter)
  );

  const featuredNews = news.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Newspaper className="text-blue-600" />
            Team News
          </h1>
          <p className="text-xl text-gray-600">Stay updated with the latest team news and match reports</p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" />
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.map((article) => (
                <Card key={article.id} className="border-2 border-yellow-200 bg-yellow-50/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      <Badge className={
                        article.category === "match-result" 
                          ? "bg-green-100 text-green-800"
                          : article.category === "player-news"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }>
                        {article.category === "match-result" ? "Match Result" : 
                         article.category === "player-news" ? "Player News" : "Team Update"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
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
                    <Button className="w-full mt-4" variant="outline">
                      Read Full Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="match-result">Match Results</SelectItem>
                  <SelectItem value="player-news">Player News</SelectItem>
                  <SelectItem value="team-update">Team Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* All News */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {filteredNews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default News;
