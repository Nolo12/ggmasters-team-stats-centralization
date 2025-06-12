
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useDatabase } from "@/hooks/useDatabase";
import { Plus, Edit } from "lucide-react";

interface PlayerFormData {
  name: string;
  position: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  motm_awards: number;
}

const PlayersManager = () => {
  const { players, addPlayer, updatePlayer } = useDatabase();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  const addForm = useForm<Omit<PlayerFormData, 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'motm_awards'>>({
    defaultValues: { name: "", position: "" },
  });

  const editForm = useForm<PlayerFormData>({
    defaultValues: { 
      name: "", 
      position: "", 
      goals: 0, 
      assists: 0, 
      yellow_cards: 0, 
      red_cards: 0, 
      motm_awards: 0 
    },
  });

  const onAddPlayer = async (data: Omit<PlayerFormData, 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'motm_awards'>) => {
    const success = await addPlayer(data);
    if (success) {
      setIsAddDialogOpen(false);
      addForm.reset();
    }
  };

  const onEditPlayer = async (data: PlayerFormData) => {
    if (editingPlayer) {
      const success = await updatePlayer(editingPlayer.id, data);
      if (success) {
        setEditingPlayer(null);
        editForm.reset();
      }
    }
  };

  const startEdit = (player: any) => {
    setEditingPlayer(player);
    editForm.setValue("name", player.name);
    editForm.setValue("position", player.position);
    editForm.setValue("goals", player.goals);
    editForm.setValue("assists", player.assists);
    editForm.setValue("yellow_cards", player.yellow_cards);
    editForm.setValue("red_cards", player.red_cards);
    editForm.setValue("motm_awards", player.motm_awards);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Players Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Plus className="h-4 w-4" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Player</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddPlayer)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Player Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter player name" 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Position</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Forward, Midfielder, Defender, Goalkeeper" 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Add Player
                  </Button>
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
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Position</TableHead>
                <TableHead className="text-gray-300">Goals</TableHead>
                <TableHead className="text-gray-300">Assists</TableHead>
                <TableHead className="text-gray-300">Yellow Cards</TableHead>
                <TableHead className="text-gray-300">Red Cards</TableHead>
                <TableHead className="text-gray-300">MOTM Awards</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="text-white">{player.name}</TableCell>
                  <TableCell className="text-gray-300">{player.position}</TableCell>
                  <TableCell className="text-green-400 font-semibold">{player.goals}</TableCell>
                  <TableCell className="text-blue-400 font-semibold">{player.assists}</TableCell>
                  <TableCell className="text-yellow-400 font-semibold">{player.yellow_cards}</TableCell>
                  <TableCell className="text-red-400 font-semibold">{player.red_cards}</TableCell>
                  <TableCell className="text-purple-400 font-semibold">{player.motm_awards}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(player)}
                      className="flex items-center gap-1 border-gray-600 text-gray-300 hover:bg-gray-700"
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
        <Dialog open={!!editingPlayer} onOpenChange={() => setEditingPlayer(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Player</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditPlayer)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Player Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Position</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={editForm.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Goals</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="assists"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Assists</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="motm_awards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">MOTM Awards</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="yellow_cards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Yellow Cards</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="red_cards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Red Cards</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Update Player
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PlayersManager;
