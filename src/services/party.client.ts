import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import {
  MyPartyListResponse,
  PartyCandidatesResponse,
  PartyMembersResponse,
  PostPartyDetail,
} from "@/types/party";

export async function getMyParties() {
  const res = await ClientApi(`/api/v1/users/me/parties`, {
    method: "GET",
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    showToast.error("참여한 파티 목록을 조회할 수 없습니다.");
    return null;
  }

  return (await res.json()) as MyPartyListResponse;
}

export async function getPartyDetail(postId: number) {
  const res = await ClientApi(`/api/v1/posts/${postId}/party`, {
    method: "GET",
  });

  if (!res.ok) {
    showToast.error("파티 세부 정보를 불러올 수 없습니다.");
    return null;
  }

  const json = (await res.json()) as PostPartyDetail;

  json.members.sort((a, b) => a.partyMemberId - b.partyMemberId);

  return json;
}

export async function getPartyMembers(partyId: number | null) {
  const res = await ClientApi(`/api/v1/parties/${partyId}/members`, {
    method: "GET",
  });

  if (!res.ok) {
    showToast.error("참여한 파티원 목록을 조회할 수 없습니다.");
    return null;
  }

  const json = (await res.json()) as PartyMembersResponse;

  json.data.members.sort((a, b) => a.partyMemberId - b.partyMemberId);

  return json;
}

export async function getCandidates(postId: number) {
  const res = await ClientApi(`/api/v1/posts/${postId}/candidates`, {
    method: "GET",
  });

  if (!res.ok) {
    console.error(`postId: ${postId} 지원자 리스트를 불러올 수 없습니다.`);
    return null;
  }

  return (await res.json()) as PartyCandidatesResponse;
}

export async function inviteMember({
  partyId,
  targetUserIds,
}: {
  partyId: number;
  targetUserIds: number[];
}) {
  const res = await ClientApi(`/api/v1/parties/${partyId}/members`, {
    method: "POST",
    body: JSON.stringify({ targetUserIds: [...targetUserIds] }),
  });

  if (!res.ok) {
    showToast.error("멤버를 초대할 수 없습니다.");
    return;
  }

  showToast.success("멤버를 초대했습니다.");
  return;
}

export async function kickOutMember({
  partyId,
  memberId,
}: {
  partyId: number;
  memberId: number;
}) {
  const res = await ClientApi(
    `/api/v1/parties/${partyId}/members/${memberId}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    showToast.error("멤버를 추방할 수 없습니다.");
    return;
  }

  showToast.success("멤버를 추방했습니다.");
  return;
}

export async function closeParty(partyId: number) {
  const res = await ClientApi(`/api/v1/parties/${partyId}/close`, {
    method: "PATCH",
  });

  if (!res.ok) {
    showToast.error("파티를 종료할 수 없습니다.");
    return;
  }

  showToast.success("파티를 종료했습니다.");

  return;
}

export async function leaveParty(partyId: number) {
  const res = await ClientApi(`/api/v1/parties/${partyId}/me`, {
    method: "DELETE",
  });

  if (!res.ok) {
    showToast.error("파티 탈퇴에 실패했습니다.");
    return;
  }

  showToast.success("파티에서 탈퇴했습니다.");

  return;
}
