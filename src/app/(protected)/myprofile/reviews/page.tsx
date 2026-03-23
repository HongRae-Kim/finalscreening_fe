import MyProfileReviewContainer from "@/components/review/myprofile/MyProfileReviewContainer";
import { getMyProfile } from "@/services/users";

export default async function ReviewsPage() {
  const loginData = await getMyProfile();
  return (
    <div className="flex flex-col gap-11 [&_h3]:text-xl [&_h3]:font-semibold">
      <h2 className="text-4xl font-bold max-md:hidden">리뷰 조회</h2>
      <MyProfileReviewContainer userId={loginData?.id!} />
    </div>
  );
}
