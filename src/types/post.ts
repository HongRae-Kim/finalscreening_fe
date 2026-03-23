import { GameMode, QueueType } from "./party";
import { Position } from "./position";

export type PostStatus = "RECRUIT" | "ACTIVE" | "CLOSED";

export interface PostListResponse {
  posts: Post[];
  nextCursor: number | string | null;
  hasNext: boolean;
}

export interface Post {
  postId: number;
  gameMode: GameMode;
  queueType: QueueType;
  myPosition: Position;
  lookingPositions: Position[];
  mic: boolean;
  recruitCount: number;
  currentParticipants: number;
  status: PostStatus;
  memo: string;
  createdAt: string; // ISO
  writer: Writer;
  participants: Participant[];
}

export interface Writer {
  userId: number | string;
  communityNickname: string;
  communityProfileImageUrl: string;
  gameAccount: {
    gameType: string;
    gameNickname: string;
    gameTag: string;
    profileIconUrl: string;
  };
  gameSummary: {
    tier: string;
    division: string;
    winRate: number;
    kda: number;
    favoriteChampions: string[];
  };
}

export interface Participant {
  userId: number | string;
  communityNickname: string;
  communityProfileImageUrl: string;
  role: string;
}

export type PostDetail = {
  postId: number;
  writer: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
    comment: string;
    gameAccount: {
      summonerName: string;
      tag: string;
      tier: string;
      winRate: number;
      kda: number;
      favoriteChampions: string[];
      mainPosition: string;
    };
  };
  gameMode: string;
  options: {
    mic: boolean;
    recruitCount: number;
    memo: string;
    myPosition: Position;
    lookingPositions: Position[];
    queueType: string;
    duoChampions: null;
  };
  statistics: {
    status: PostStatus;
    currentMemberCount: number;
    createdAt: string;
    updatedAt: string;
  };
};
