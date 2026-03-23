import { MyProfile, UserProfile } from "@/types/profile";
import { ServerApi } from "../lib/serverApi";
import { GameAccount } from "@/types/game-account";
import { UserList } from "@/types/userList";

export async function getMyProfile() {
  const res = await ServerApi("/api/v1/users/me");

  if (!res.ok) return null;

  return (await res.json()) as MyProfile;
}

export async function getUserProfile(userId: string) {
  const res = await ServerApi(`/api/v1/users/${userId}`);

  if (!res.ok) return null;

  return (await res.json()) as UserProfile;
}

export async function getGameAccount() {
  const res = await ServerApi("/api/game-accounts");

  if (!res.ok) return null;

  return (await res.json()) as GameAccount[];
}

export async function getOtherGameAccount(gameAccountId: number) {
  const res = await ServerApi(`/api/game-accounts/${gameAccountId}`);

  if (!res.ok) return null;

  return (await res.json()) as GameAccount;
}

export async function searchUsers(nickname: string) {
  const res = await ServerApi(`/api/v1/users/search?nickname=${nickname}`);

  if (!res.ok) {
    throw new Error("백엔드 검색 API 실패");
  }

  return (await res.json()) as UserList;
}
