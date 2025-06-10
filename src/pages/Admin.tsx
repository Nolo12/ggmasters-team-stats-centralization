
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useTeamData } from "@/hooks/useTeamData";
import { Settings, Plus, Edit, Save, X, Trophy, Users, Calendar, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { matches, players, news } = useTeamData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("matches");

  // Match form state
  const [matchForm, setMatchForm] = useState({
    opponent: "",
    date: "",
    venue: "",
    homeScore: "",
    awayScore: "",
    isHome: true,
    motm: ""
  });

  // Player form state
  const [playerForm, setPlayerForm] = useState({
    name: "",
    position: "",
    goals: "",
    assists: "",
    yellowCards: "",
    redCards: "",
    motmAwards: "",
    matchesPlayed: ""
  });

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "team-update",
    featured: false
  });

  const handleMatchSubmit = () => {
    console.log("Submitting match:", matchForm);
    toast({
      title: "Match Added",
      description: "Match has been successfully added to the database.",
    });
    // Reset form
    setMatchForm({
      opponent: "",
      date: "",
      venue: "",
      homeScore: "",
      awayScore: "",
      isHome: true,
      motm: ""
    });
  };

  const handlePlayerSubmit = () => {
    console.log("Submitting player:", playerForm);
    toast({
      title: "Player Added",
      description: "Player has been successfully added to the squad.",
    });
    // Reset form
    setPlayerForm({
      name: "",
      position: "",
      goals: "",
      assists: "",
      yellowCards: "",
      redCards: "",
      motmAwards: "",
      matchesPlayed: ""
    });
  };

  const handleNewsSubmit = () => {
    console.log("Submitting news:", newsForm);
    toast({
      title: "Article Published",
      description: "News article has been successfully published.",
    });
    // Reset form
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "team-update",
      featured: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Settings className="text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage team data, statistics, and content</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{matches.length}</div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{players.length}</div>
              <div className="text-sm text-gray-600">Squad Players</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Newspaper className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{news.length}</div>
              <div className="text-sm text-gray-600">News Articles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {players.reduce((sum, p) => sum + p.goals, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Match Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Match
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Opponent team"
                    value={matchForm.opponent}
                    onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})}
                  />
                  <Input
                    type="date"
                    value={matchForm.date}
                    onChange={(e) => setMatchForm({...matchForm, date: e.target.value})}
                  />
                  <Input
                    placeholder="Venue"
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm({...matchForm, venue: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Home score"
                      value={matchForm.homeScore}
                      onChange={(e) => setMatchForm({...matchForm, homeScore: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Away score"
                      value={matchForm.awayScore}
                      onChange={(e) => setMatchForm({...matchForm, awayScore: e.target.value})}
                    />
                  </div>
                  <Select 
                    value={matchForm.isHome.toString()} 
                    onValueChange={(value) => setMatchForm({...matchForm, isHome: value === "true"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Home or Away" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Home Match</SelectItem>
                      <SelectItem value="false">Away Match</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Man of the Match"
                    value={matchForm.motm}
                    onChange={(e) => setMatchForm({...matchForm, motm: e.target.value})}
                  />
                  <Button onClick={handleMatchSubmit} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Match
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Matches */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matches.slice(0, 5).map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{match.opponent}</div>
                          <div className="text-sm text-gray-500">{match.date}</div>
                        </div>
                        <div className="text-right">
                          {match.homeScore !== undefined && match.awayScore !== undefined && (
                            <div className="font-bold">
                              {match.isHome ? match.homeScore : match.awayScore} - {match.isHome ? match.awayScore : match.homeScore}
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {match.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Player Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Player
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Player name"
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                  />
                  <Select 
                    value={playerForm.position} 
                    onValueChange={(value) => setPlayerForm({...playerForm, position: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Goals"
                      value={playerForm.goals}
                      onChange={(e) => setPlayerForm({...playerForm, goals: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Assists"
                      value={playerForm.assists}
                      onChange={(e) => setPlayerForm({...playerForm, assists: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Yellow cards"
                      value={playerForm.yellowCards}
                      onChange={(e) => setPlayerForm({...playerForm, yellowCards: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Red cards"
                      value={playerForm.redCards}
                      onChange={(e) => setPlayerForm({...playerForm, redCards: e.target.value})}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="MOTM awards"
                    value={playerForm.motmAwards}
                    onChange={(e) => setPlayerForm({...playerForm, motmAwards: e.target.value})}
                  />
                  <Button onClick={handlePlayerSubmit} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </CardContent>
              </Card>

              {/* Current Squad */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Squad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.position}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{player.goals}G / {player.assists}A</div>
                          <div className="text-gray-500">{player.motmAwards} MOTM</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add News Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Publish News Article
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Article title"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Article excerpt"
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Full article content"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                    rows={6}
                  />
                  <Input
                    placeholder="Author name"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  />
                  <Select 
                    value={newsForm.category} 
                    onValueChange={(value) => setNewsForm({...newsForm, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match-result">Match Result</SelectItem>
                      <SelectItem value="player-news">Player News</SelectItem>
                      <SelectItem value="team-update">Team Update</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newsForm.featured}
                      onChange={(e) => setNewsForm({...newsForm, featured: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured article
                    </label>
                  </div>
                  <Button onClick={handleNewsSubmit} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Publish Article
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Articles */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {news.map((article) => (
                      <div key={article.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium mb-1">{article.title}</div>
                        <div className="text-sm text-gray-500 mb-2">{article.excerpt}</div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{article.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Goal Scorers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players
                      .sort((a, b) => b.goals - a.goals)
                      .slice(0, 5)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600">#{index + 1}</span>
                            <span>{player.name}</span>
                          </div>
                          <span className="font-bold">{player.goals}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most MOTM Awards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players
                      .sort((a, b) => b.motmAwards - a.motmAwards)
                      .slice(0, 5)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-yellow-600">#{index + 1}</span>
                            <span>{player.name}</span>
                          </div>
                          <span className="font-bold">{player.motmAwards}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Assist Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players
                      .sort((a, b) => b.assists - a.assists)
                      .slice(0, 5)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">#{index + 1}</span>
                            <span>{player.name}</span>
                          </div>
                          <span className="font-bold">{player.assists}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
