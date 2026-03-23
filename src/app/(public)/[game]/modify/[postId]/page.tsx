import FindCreateFormContainer from "@/components/find/post/FindCreateFormContainer";
import { GetDetailPost } from "@/services/posts";
import { getGameAccount } from "@/services/users";

export default async function ModifyPostpage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = await params;
  const initialPost = await GetDetailPost(postId);
  const gameAccountData = await getGameAccount();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <FindCreateFormContainer
        type="modify"
        initialPost={initialPost}
        gameAccountData={gameAccountData ?? []}
      />
    </div>
  );
}
