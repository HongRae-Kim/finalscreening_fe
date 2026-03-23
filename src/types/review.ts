import { EmojiType } from "./emoji";

export type ReviewDistribution = {
  userId: number;
  nickname: string;
  totalReviews: number;
  distribution: {
    GOOD: number;
    NORMAL: number;
    BAD: number;
  };
  ratios: {
    GOOD: number;
    NORMAL: number;
    BAD: number;
  };
};

export type Review = {
  reviewId: number;
  revieweeId: number;
  reviewerId: number;
  reviewerNickname: string;
  revieweeNickname: string;
  emoji: EmojiType;
  content: string;
  createdAt: string;
  revieweeProfileImage?: string | null;
};

export type RequestReviewsResponse = {
  reviewRequestId: number;
  partyId: number;
  status: string;
  createdAt: string;
  expiresAt: string;
};
