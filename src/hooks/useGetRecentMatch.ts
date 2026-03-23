import { getRecentMatches } from "@/services/game-account/data.client";
import { Match } from "@/types/game-account";
import { useQuery } from "@tanstack/react-query";

export function useGetRecentMatch({
  gameAccountId,
  count,
}: {
  gameAccountId: number;
  count: number;
}) {
  return useQuery<Match[] | null>({
    queryKey: [gameAccountId, "recentMatchData", count],
    enabled: !!gameAccountId && count > 0,
    queryFn: () => getRecentMatches({ gameAccountId, count }),
    placeholderData: (prev) => prev,
  });
}
