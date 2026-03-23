import { getPartyDetail } from "@/services/party.client";
import { getRequestReviews } from "@/services/review.client";
import { useQuery } from "@tanstack/react-query";

export function useGetRequestReviews() {
  return useQuery({
    queryKey: ["me", "requestReviews"],
    queryFn: () => getRequestReviews(),
  });
}
