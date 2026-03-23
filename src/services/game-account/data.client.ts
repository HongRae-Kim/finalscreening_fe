import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import {
  Champion,
  Match,
  MatchDataResponse,
  Ranks,
} from "@/types/game-account";

/* riot api로부터 데이터 불러와 db에 저장 */
export async function gameAccountRefreshAll({
  gameAccountId,
  matchCount,
}: {
  gameAccountId: number;
  matchCount?: number;
}) {
  const qs = matchCount != null ? `?matchCount=${matchCount}` : "";
  const res = await ClientApi(
    `/api/game-accounts/${gameAccountId}/refresh-all${qs}`,
    { method: "POST" },
  );

  if (!res.ok) {
    if (res.status === 400) {
      showToast.error(
        "게임 계정에 puuid가 없습니다. 먼저 게임 계정을 등록해주세요.",
      );
      return null;
    }

    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }

    showToast.error("랭크 정보 또는 매치 정보를 가져오는데 실패했습니다.");
    return null;
  }

  return (await res.json()) as MatchDataResponse;
}

export async function RanksRefresh(gameAccountId: number) {
  const res = await ClientApi(
    `/api/game-accounts/${gameAccountId}/ranks/refresh`,
    { method: "POST" },
  );

  if (!res.ok) {
    if (res.status === 400) {
      showToast.error(
        "게임 계정에 puuid가 없습니다. 먼저 게임 계정을 등록해주세요.",
      );
      return null;
    }

    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }

    showToast.error("랭크 정보를 가져오는데 실패했습니다.");
    return null;
  }

  return (await res.json()) as Ranks[];
}

export async function MatchesRefresh({
  gameAccountId,
  count,
}: {
  gameAccountId: number;
  count: number;
}) {
  const qs = count != null ? `?count=${count}` : "";
  const res = await ClientApi(
    `/api/game-accounts/${gameAccountId}/matches/refresh${qs}`,
    { method: "POST" },
  );

  if (!res.ok) {
    if (res.status === 400) {
      showToast.error(
        "게임 계정에 puuid가 없습니다. 먼저 게임 계정을 등록해주세요.",
      );
      return null;
    }

    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }

    showToast.error("랭크 정보를 가져오는데 실패했습니다.");
    return null;
  }

  return (await res.json()) as Ranks[];
}

/* db로부터 불러옴 */
export async function getRecentMatches({
  gameAccountId,
  count,
}: {
  gameAccountId: number;
  count?: number;
}) {
  const qs = count != null ? `?count=${count}` : "";
  const res = await ClientApi(
    `/api/game-accounts/${gameAccountId}/matches${qs}`,
    { method: "GET" },
  );

  if (!res.ok) {
    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }
    return null;
  }

  return (await res.json()) as Match[];
}

export async function getFavoriteChampions(gameAccountId: number) {
  const res = await ClientApi(
    `/api/game-accounts/${gameAccountId}/champions/favorite`,
    { method: "GET" },
  );

  if (!res.ok) {
    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }
    return null;
  }

  return (await res.json()) as Champion[];
}

export async function getRanks(gameAccountId: number) {
  const res = await ClientApi(`/api/game-accounts/${gameAccountId}/ranks`, {
    method: "GET",
  });

  if (!res.ok) {
    if (res.status === 400) {
      showToast.error(
        "게임 계정에 puuid가 없습니다. 먼저 게임 계정을 등록해주세요.",
      );
      return null;
    }

    if (res.status === 404) {
      showToast.error("게임 계정을 찾을 수 없습니다.");
      return null;
    }

    showToast.error("랭크 정보를 가져오는데 실패했습니다.");
    return null;
  }

  return (await res.json()) as Ranks[];
}
