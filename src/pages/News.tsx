
import Navigation from "@/components/Navigation";
import NewsCard from "@/components/NewsCard";
import { useDatabase } from "@/hooks/useDatabase";

const News = () => {
  const { news, loading } = useDatabase();

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

  const featuredNews = news.filter(article => article.featured);
  const regularNews = news.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest News
          </h1>
          <p className="text-xl text-gray-600">
            Stay updated with Thunder FC's latest stories and updates
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Stories</h2>
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
            <p className="text-gray-600 text-lg">No news articles found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
