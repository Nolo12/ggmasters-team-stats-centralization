
import { useState, useEffect } from "react";

// Mock data - in a real app, this would come from a database
const mockMatches = [
  {
    id: "1",
    opponent: "City United",
    date: "2024-06-05",
    venue: "Thunder Stadium",
    homeScore: 3,
    awayScore: 1,
    status: "completed" as const,
    isHome: true,
    motm: "Marcus Johnson"
  },
  {
    id: "2",
    opponent: "Rangers FC",
    date: "2024-05-28",
    venue: "Rangers Ground",
    homeScore: 1,
    awayScore: 2,
    status: "completed" as const,
    isHome: false,
    motm: "David Rodriguez"
  },
  {
    id: "3",
    opponent: "Athletic Club",
    date: "2024-05-20",
    venue: "Thunder Stadium",
    homeScore: 4,
    awayScore: 0,
    status: "completed" as const,
    isHome: true,
    motm: "Sarah Williams"
  }
];

const mockPlayers = [
  {
    id: "1",
    name: "Marcus Johnson",
    position: "Forward",
    goals: 12,
    assists: 6,
    yellowCards: 2,
    redCards: 0,
    motmAwards: 3,
    matchesPlayed: 15
  },
  {
    id: "2",
    name: "Sarah Williams",
    position: "Midfielder",
    goals: 8,
    assists: 10,
    yellowCards: 1,
    redCards: 0,
    motmAwards: 2,
    matchesPlayed: 16
  },
  {
    id: "3",
    name: "David Rodriguez",
    position: "Defender",
    goals: 3,
    assists: 4,
    yellowCards: 4,
    redCards: 1,
    motmAwards: 1,
    matchesPlayed: 14
  },
  {
    id: "4",
    name: "Emma Thompson",
    position: "Goalkeeper",
    goals: 0,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    motmAwards: 2,
    matchesPlayed: 16
  }
];

const mockNews = [
  {
    id: "1",
    title: "Thunder FC Dominates 4-0 Victory Against Athletic Club",
    excerpt: "An outstanding team performance led Thunder FC to a commanding 4-0 victory at home, with Sarah Williams earning Player of the Match honors.",
    content: "Full match report content here...",
    author: "Mike Stevens",
    date: "2024-05-21",
    category: "match-result" as const,
    featured: true
  },
  {
    id: "2",
    title: "Marcus Johnson Reaches Double-Digit Goals This Season",
    excerpt: "Star forward Marcus Johnson has now scored 12 goals this season, making him our top scorer and a key player for the team's success.",
    content: "Player profile content here...",
    author: "Lisa Parker",
    date: "2024-05-19",
    category: "player-news" as const,
    featured: false
  }
];

export const useTeamData = () => {
  const [matches] = useState(mockMatches);
  const [players] = useState(mockPlayers);
  const [news] = useState(mockNews);

  const stats = {
    totalMatches: matches.length,
    wins: matches.filter(m => {
      if (m.status !== "completed" || m.homeScore === undefined || m.awayScore === undefined) return false;
      const ourScore = m.isHome ? m.homeScore : m.awayScore;
      const theirScore = m.isHome ? m.awayScore : m.homeScore;
      return ourScore > theirScore;
    }).length,
    totalGoals: players.reduce((sum, player) => sum + player.goals, 0),
    totalPlayers: players.length
  };

  return {
    matches,
    players,
    news,
    stats
  };
};
