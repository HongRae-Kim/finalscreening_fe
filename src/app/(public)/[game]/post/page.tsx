import FindCreateFormContainer from "@/components/find/post/FindCreateFormContainer";
import { getGameAccount } from "@/services/users";

export default async function PostCreatePage() {
  const gameAccountData = await getGameAccount();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <FindCreateFormContainer
        type="create"
        gameAccountData={gameAccountData ?? []}
      />
    </div>
  );
}
