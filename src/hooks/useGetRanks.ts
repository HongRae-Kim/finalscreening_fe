import { getRanks } from "@/services/game-account/data.client";
import { Ranks } from "@/types/game-account";
import { useQuery } from "@tanstack/react-query";

export function useGetRanks(gameAccountId: number) {
  return useQuery<Ranks[] | null>({
    queryKey: [gameAccountId, "RanksData"],
    enabled: !!gameAccountId,
    queryFn: () => getRanks(gameAccountId),
    staleTime: 60 * 60 * 1000,
  });
}
