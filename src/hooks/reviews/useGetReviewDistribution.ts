import { getReviewDistribution } from "@/services/review.client";
import { ReviewDistribution } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

export default function useGetReviewDistribution(userId: number) {
  return useQuery<ReviewDistribution | null>({
    queryKey: [userId, "ReviewDistribution"],
    enabled: !!userId,
    queryFn: () => getReviewDistribution(userId),
    staleTime: 30 * 60 * 1000,
  });
}
