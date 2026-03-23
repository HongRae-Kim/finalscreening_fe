import { ServerApi } from "@/lib/serverApi";
import { showToast } from "@/lib/toast";
import { Post, PostListResponse } from "@/types/post";

export async function GetPosts() {
  const res = await ServerApi(`/api/v1/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`getPosts failed(${res.status}): ${res.statusText}`);
  }

  return (await res.json()) as PostListResponse;
}

export async function GetDetailPost(postId: string) {
  const res = await ServerApi(`/api/v1/posts/${postId}`);

  if (!res.ok) {
    showToast.error("수정할 글이 없습니다.");
    return;
  }

  return (await res.json()) as Post;
}
