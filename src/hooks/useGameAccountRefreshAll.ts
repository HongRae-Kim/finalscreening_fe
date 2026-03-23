import { useQuery } from "@tanstack/react-query";
import { gameAccountRefreshAll } from "@/services/game-account/data.client";
import { MatchDataResponse } from "@/types/game-account";

export function useGameAccountRefreshAll({
  gameAccountId,
  matchCount,
}: {
  gameAccountId: number;
  matchCount?: number;
}) {
  return useQuery<MatchDataResponse | null>({
    queryKey: [gameAccountId, "gameAccountAllData"],
    enabled: !!gameAccountId,
    queryFn: () =>
      gameAccountRefreshAll({
        gameAccountId: gameAccountId,
        ...((matchCount !== undefined || matchCount !== null) && {
          matchCount,
        }),
      }),
  });
}
