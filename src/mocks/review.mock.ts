import { ReviewDistribution } from "@/types/review";

export const ReviewDistributionMock: ReviewDistribution = {
  userId: 88,
  nickname: "탑신병자",
  totalReviews: 100,
  distribution: {
    GOOD: 75,
    NORMAL: 20,
    BAD: 5,
  },
  ratios: {
    GOOD: 75.0,
    NORMAL: 20.0,
    BAD: 5.0,
  },
};
