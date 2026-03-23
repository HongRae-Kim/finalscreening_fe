import { getPartyDetail } from "@/services/party.client";
import { useQuery } from "@tanstack/react-query";

export function useGetPartyDetail(postId: number) {
  return useQuery({
    queryKey: [postId, "party"],
    queryFn: () => getPartyDetail(postId),
    enabled: !!postId,
  });
}
