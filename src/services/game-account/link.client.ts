import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import { GameAccount } from "@/types/game-account";

type gameAccountRequestType = {
  gameType: string;
  gameNickname: string;
  gameTag: string;
};

export async function LinkGameAccount({
  gameType,
  gameNickname,
  gameTag,
}: gameAccountRequestType) {
  const payload = {
    gameType: gameType,
    gameNickname: gameNickname,
    gameTag: gameTag,
  };

  const res = await ClientApi("/api/game-accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 404) {
      showToast.error(
        "해당 게임 계정을 찾을 수 없습니다. 닉네임과 태그를 확인해주세요.",
      );
      return { ok: res.ok, data: null };
    }
    if (res.status === 409) {
      showToast.error("이미 해당 게임 아이디가 등록되어 있습니다.");
      return { ok: res.ok, data: null };
    }
    showToast.error("게임 아이디 연동에 실패했습니다.");
    return { ok: res.ok, data: null };
  }

  return { ok: res.ok, data: (await res.json()) as GameAccount };
}

export async function ModifyGameAccount(
  gameAccountId: string,
  { gameNickname, gameTag }: { gameNickname: string; gameTag: string },
) {
  const payload = {
    gameNickname: gameNickname,
    gameTag: gameTag,
  };
  const res = await ClientApi(`/api/game-accounts/${gameAccountId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    showToast.error("게임 아이디 연동 수정에 실패했습니다.");
    return;
  }

  showToast.success("연동된 게임 아이디를 수정했습니다.");
  return;
}

export async function UnlinkGameAccount(gameAccountId: string) {
  const res = await ClientApi(`/api/game-accounts/${gameAccountId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    showToast.error("게임 아이디 연동 해제에 실패했습니다.");
    return;
  }

  showToast.success("연동된 게임 아이디를 해제했습니다.");
  return;
}
