import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import { MyProfile, UserProfile } from "@/types/profile";

export async function getUserProfile(userId: number) {
  const res = await ClientApi(`/api/v1/users/${userId}`, {
    method: "GET",
  });

  if (!res.ok) {
    showToast.error("유저 프로필 정보를 불러올 수 없습니다.");
    return null;
  }

  return (await res.json()) as UserProfile;
}

export async function getMyProfile() {
  const res = await ClientApi(`/api/v1/users/me`, {
    method: "GET",
  });

  if (!res.ok) {
    showToast.error("유저 프로필 정보를 불러올 수 없습니다.");
    return null;
  }

  return (await res.json()) as MyProfile;
}

export async function userResgin() {
  const res = await ClientApi(`/api/v1/auth/resign`, {
    method: "POST",
  });

  if (!res.ok) {
    showToast.error("회원 탈퇴에 실패했습니다.");
    return;
  }
  showToast.success("탈퇴했습니다.");
  return;
}
