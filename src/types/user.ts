export type User = {
  email: string;
  password: string;
  nickname: string;
  comment: string;
  profile_image: string;
};

export type MiniProfile = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  comment: string;
  reviewSummary: {
    totalCount: number;
    goodCount: number;
    normalCount: number;
    badCount: number;
    goodRate: number;
    normalRate: number;
    badRate: number;
  };
  isBlockedByMe: boolean;
};
