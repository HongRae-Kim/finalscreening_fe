import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import { QueueType } from "@/types/party";
import { Position } from "@/types/position";
import { PostListResponse, PostStatus } from "@/types/post";
import { Tier } from "@/types/tier";

export async function deletePost(postId: number) {
  const res = await ClientApi(`/api/v1/posts/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    if (res.status === 403) {
      showToast.error("자신이 작성한 게시물만 삭제할 수 있습니다.");
      return;
    }
    showToast.error("게시글 삭제에 실패했습니다.");
    return;
  }

  showToast.success("게시글을 삭제했습니다.");
  return;
}

export async function GetPosts(params: {
  cursor?: number;
  size?: number;
  status?: PostStatus;
  queueType?: QueueType | null;
  myPositions?: Position[] | null;
  tier?: Tier | "ALL" | null;
}) {
  const sp = new URLSearchParams();

  if (params.status) sp.set("status", params.status);
  if (params.queueType) sp.set("queueType", params.queueType);
  if (params.tier) sp.set("tier", params.tier);

  if (params.myPositions && params.myPositions.length > 0) {
    params.myPositions.forEach((p) => sp.append("myPositions", p));
  }

  const url = sp.toString()
    ? `/api/v1/posts?${sp.toString()}`
    : `/api/v1/posts`;

  const res = await ClientApi(url, { method: "GET", cache: "no-store" });
  if (!res.ok) return;
  return (await res.json()) as PostListResponse;
}
