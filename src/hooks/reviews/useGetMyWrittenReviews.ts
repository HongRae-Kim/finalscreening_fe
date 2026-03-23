import { getMyWrittenReviews } from "@/services/review.client";
import { Review } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

export default function useGetMyWrittenReviews() {
  return useQuery<Review[] | null>({
    queryKey: ["writtenReviews"],
    queryFn: () => getMyWrittenReviews(),
    staleTime: 30 * 60 * 1000,
  });
}
