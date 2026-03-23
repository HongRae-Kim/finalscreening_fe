import gameIconLol from "@/assets/images/game-icon-lol.png";
import gameIconAram from "@/assets/images/game-icon-aram.svg";
import gameIconArena from "@/assets/images/game-icon-arena.png";

export type PartyStatus = "ACTIVE" | "INACTIVE" | "CLOSED" | string;
export type PartyRole = "LEADER" | "MEMBER" | string;

export interface PartyMembersResponse {
  status: string;
  message: string;
  data: {
    partyId: number;
    currentCount: number;
    maxCount: number;
    members: PostPartyMemberDetail[];
  };
}

export interface PostPartyDetail {
  partyId: number;
  postId: number;
  status: string;
  currentCount: number;
  maxCount: number;
  createdAt: string;
  isJoined: boolean;
  members: PostPartyMemberDetail[];
}

export interface PostPartyMemberDetail {
  partyMemberId: number;
  userId: number;
  nickname: string;
  profileImage: string;
  role: PartyMemberRole;
  joinedAt: string;
}

export type PartyMemberRole = "LEADER" | "MEMBER";

export interface MyPartyListResponse {
  status: string;
  message: string;
  data: {
    parties: MyPartySummary[];
  };
}

export interface MyPartySummary {
  partyId: number;
  postId: number;
  postTitle: string;
  gameMode: string;
  queueType: QueueType;
  status: PartyStatus;
  myRole: PartyRole;
  joinedAt: string;
}

export const GAME_MODE_IDS = [
  "SUMMONERS_RIFT",
  "HOWLING_ABYSS",
  "ARENA",
] as const;
export type GameMode = (typeof GAME_MODE_IDS)[number];
export const GAME_MODE_META: Record<GameMode, { label: string; icon: any }> = {
  SUMMONERS_RIFT: {
    label: "소환사의 협곡",
    icon: gameIconLol,
  },
  HOWLING_ABYSS: {
    label: "칼바람 나락",
    icon: gameIconAram,
  },
  ARENA: {
    label: "아레나",
    icon: gameIconArena,
  },
} as const;

export const QUEUE_TYPES = ["DUO", "FLEX", "NORMAL"] as const;
export type QueueType = (typeof QUEUE_TYPES)[number];
export const QUEUE_TYPES_LABEL: Record<QueueType, string> = {
  DUO: "솔로 랭크",
  FLEX: "자유 랭크",
  NORMAL: "일반",
};
export const QUEUE_IDS = [400, 420, 430, 440, 490, 450, 900, 1700] as const;
export type queueId = (typeof QUEUE_IDS)[number];
export const QUEUE_NAME: Record<queueId, string> = {
  400: "일반 게임",
  420: "솔로 랭크",
  430: "일반 게임",
  440: "자유 랭크",
  490: "빠른 대전",
  450: "무작위 총력전",
  900: "우르프",
  1700: "아레나",
};

export const RECRUIT_COUNT_OPTIONS: Record<QueueType, readonly number[]> = {
  DUO: [2],
  FLEX: [2, 3, 5],
  NORMAL: [2, 3, 4, 5],
} as const;

export interface PartyCandidatesResponse {
  status: string;
  message: string;
  data: Candidate[];
}

export interface Candidate {
  userId: number;
  nickname: string;
  profileImage: string;
}
