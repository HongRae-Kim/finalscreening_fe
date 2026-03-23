import ReviewCreateFormContainer from "@/components/review/ReviewCreateFormContainer";
import { getMyProfile } from "@/services/users";

export default async function ReviewPostCreatePage() {
  const myProfileData = await getMyProfile();
  const currentUserId = myProfileData?.id;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <ReviewCreateFormContainer type="create" currentUserId={currentUserId} />
    </div>
  );
}
