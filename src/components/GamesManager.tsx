
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useDatabase } from "@/hooks/useDatabase";
import { Plus, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameFormData {
  date: string;
  opponent: string;
  venue: string;
  is_home: boolean;
  home_score: number | null;
  away_score: number | null;
  status: "upcoming" | "completed" | "cancelled";
  motm_player_id: string | null;
}

const GamesManager = () => {
  const { games, players, addGame, updateGame } = useDatabase();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);

  const addForm = useForm<GameFormData>({
    defaultValues: {
      date: "",
      opponent: "",
      venue: "",
      is_home: true,
      home_score: null,
      away_score: null,
      status: "upcoming",
      motm_player_id: null,
    },
  });

  const editForm = useForm<GameFormData>({
    defaultValues: {
      date: "",
      opponent: "",
      venue: "",
      is_home: true,
      home_score: null,
      away_score: null,
      status: "upcoming",
      motm_player_id: null,
    },
  });

  const onAddGame = async (data: GameFormData) => {
    const success = await addGame(data);
    if (success) {
      setIsAddDialogOpen(false);
      addForm.reset();
    }
  };

  const onEditGame = async (data: GameFormData) => {
    if (editingGame) {
      const success = await updateGame(editingGame.id, data);
      if (success) {
        setEditingGame(null);
        editForm.reset();
      }
    }
  };

  const startEdit = (game: any) => {
    setEditingGame(game);
    editForm.setValue("date", game.date);
    editForm.setValue("opponent", game.opponent);
    editForm.setValue("venue", game.venue || "");
    editForm.setValue("is_home", game.is_home);
    editForm.setValue("home_score", game.home_score);
    editForm.setValue("away_score", game.away_score);
    editForm.setValue("status", game.status);
    editForm.setValue("motm_player_id", game.motm_player_id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Games Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Game
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Game</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddGame)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="opponent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opponent</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter opponent team name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter venue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="is_home"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Match Type</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value === "true")}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select match type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Home</SelectItem>
                              <SelectItem value="false">Away</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Game</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{new Date(game.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{game.opponent}</TableCell>
                  <TableCell>{game.venue || "TBD"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {game.is_home ? "Home" : "Away"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {game.home_score !== null && game.away_score !== null
                      ? `${game.home_score} - ${game.away_score}`
                      : "TBD"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(game.status)}>
                      {game.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(game)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingGame} onOpenChange={() => setEditingGame(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Game</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditGame)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="opponent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opponent</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="home_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="away_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="motm_player_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Man of the Match (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select MOTM player" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} - {player.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Update Game</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GamesManager;
