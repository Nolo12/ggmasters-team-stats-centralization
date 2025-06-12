
import Navigation from "@/components/Navigation";
import NewsCard from "@/components/NewsCard";
import { useDatabase } from "@/hooks/useDatabase";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Newspaper } from "lucide-react";

const News = () => {
  const { news, loading } = useDatabase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const featuredNews = news.filter(article => article.featured);
  const regularNews = news.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <Newspaper className="inline h-10 w-10 text-purple-400 mr-2" />
            Latest News
          </h1>
          <p className="text-xl text-gray-300">
            Stay updated with GG Masters FC's latest stories and updates
          </p>
        </div>

        {/* Auto-Generated News Notice */}
        <Card className="mb-8 bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Automated News Updates</h3>
                <p className="text-sm text-blue-200">
                  News articles are automatically generated based on match results, player performances, 
                  and team statistics to ensure accurate and timely reporting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
              ⭐ Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {featuredNews.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={{
                    id: article.id,
                    title: article.title,
                    excerpt: article.excerpt || "",
                    content: article.content || "",
                    author: article.author,
                    date: new Date(article.published_at).toLocaleDateString(),
                    category: article.category,
                    featured: article.featured
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular News */}
        {regularNews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
              📰 All Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={{
                    id: article.id,
                    title: article.title,
                    excerpt: article.excerpt || "",
                    content: article.content || "",
                    author: article.author,
                    date: new Date(article.published_at).toLocaleDateString(),
                    category: article.category,
                    featured: article.featured
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {news.length === 0 && (
          <div className="text-center py-12">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardContent className="p-8">
                <p className="text-gray-300 text-lg mb-4">No news articles found.</p>
                <p className="text-gray-400 text-sm">
                  News will be automatically generated when match results are added through the admin dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
