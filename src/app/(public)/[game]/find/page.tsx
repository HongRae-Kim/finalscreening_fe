import FindPageContent from "@/components/find/FindPageContent";
import { GetPosts } from "@/services/posts";
import { getGameAccount, getMyProfile } from "@/services/users";

export default async function page() {
  const { posts: postData } = await GetPosts();
  const loginData = await getMyProfile();
  const gameAccountData = await getGameAccount();

  return (
    <FindPageContent
      postData={postData ?? null}
      loginData={loginData ?? null}
      gameAccountData={gameAccountData ?? null}
    />
  );
}
