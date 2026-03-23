import { getFavoriteChampions } from "@/services/game-account/data.client";
import { Champion } from "@/types/game-account";
import { useQuery } from "@tanstack/react-query";

export function useGetFavoriteChampions(gameAccountId: number) {
  return useQuery<Champion[] | null>({
    queryKey: [gameAccountId, "FavoriteChampionsData"],
    enabled: !!gameAccountId,
    queryFn: () => getFavoriteChampions(gameAccountId),
    staleTime: 60 * 60 * 1000,
  });
}
