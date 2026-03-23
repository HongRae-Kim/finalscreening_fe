import { getAllReviews } from "@/services/review.client";
import { Review } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllReviews() {
  return useQuery<Review[] | null>({
    queryKey: ["all", "reviews"],
    queryFn: () => getAllReviews(),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
}
