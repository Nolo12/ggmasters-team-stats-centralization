
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, TrendingUp, Star, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import MatchCard from "@/components/MatchCard";
import PlayerCard from "@/components/PlayerCard";
import NewsCard from "@/components/NewsCard";
import { useTeamData } from "@/hooks/useTeamData";

const Index = () => {
  const { matches, players, news, stats } = useTeamData();
  
  const recentMatches = matches.slice(0, 3);
  const topScorers = players
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);
  const latestNews = news.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Thunder FC
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Excellence on the Field, Champions in Spirit
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold text-yellow-400">{stats.totalMatches}</div>
              <div className="text-sm text-blue-100">Matches Played</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold text-green-400">{stats.wins}</div>
              <div className="text-sm text-blue-100">Victories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold text-blue-300">{stats.totalGoals}</div>
              <div className="text-sm text-blue-100">Goals Scored</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Recent Matches */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Recent Matches
            </h2>
            <Button variant="outline" className="hover:bg-blue-50">
              View All Matches
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Top Scorers */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="text-blue-600" />
              Top Scorers
            </h2>
            <Button variant="outline" className="hover:bg-blue-50">
              View All Players
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topScorers.map((player, index) => (
              <PlayerCard key={player.id} player={player} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="text-blue-600" />
              Latest News
            </h2>
            <Button variant="outline" className="hover:bg-blue-50">
              View All News
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
