import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getMyParties } from "@/services/party.client";
import type { MyPartyListResponse } from "@/types/party";

export function useMyParties(currentUserId?: number) {
  return useQuery<MyPartyListResponse | null>({
    queryKey: ["me", "parties"],
    queryFn: getMyParties,
    enabled: currentUserId ? !!currentUserId : false,
  });
}
