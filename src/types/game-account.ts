import { Rank, Tier } from "./tier";

export type GameAccount = {
  gameAccountId: number;
  gameNickname: string;
  gameTag: string;
  gameType: string;
  puuid: string;
  profileIconId: number;
  profileIconUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type MatchDataResponse = {
  ranks: Ranks[];
  matches: Match[];
  message: string;
};

export type Ranks = {
  rankId: number;
  queueType: string;
  tier: Tier;
  rank: Rank;
  wins: number;
  losses: number;
  winRate: number;
  gameAccountId: number;
  createdAt: string;
  updatedAt: string;
};

export type Match = {
  matchId: string;
  queueId: number;
  gameStartTimestamp: number;
  gameStartTimeFormatted: string;
  gameDuration: number;
  gameDurationFormatted: string;
  win: boolean;
  championId: number;
  championName: string;
  championImageUrl: string;
  spell1Id: number;
  spell1ImageUrl: string;
  spell2Id: number;
  spell2ImageUrl: string;
  perks: string;
  perkImageUrls: string[];
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  level: number;
  items: number[];
  itemImageUrls: (string | null)[];
};

export type Champion = {
  rank: number;
  championId: number;
  championName: string;
  championImageUrl: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
};
