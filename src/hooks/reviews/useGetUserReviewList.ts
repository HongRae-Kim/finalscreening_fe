import { useQuery } from "@tanstack/react-query";
import { Review } from "@/types/review";
import { getUserReviewList } from "@/services/review.client";

export function useGetUserReviewList(userId: number) {
  return useQuery<Review[] | null>({
    queryKey: [userId, "receivedReviews"],
    enabled: !!userId,
    queryFn: () => getUserReviewList(userId),
    staleTime: 30 * 60 * 1000,
  });
}
