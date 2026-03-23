import FindHistoryContainer from "@/components/myprofile/FindHistoryContainer";
import { getMyProfile } from "@/services/users";

export default async function FindHistoryPage() {
  const loginData = await getMyProfile();
  return (
    <div className="flex h-full flex-col gap-5 max-md:w-full max-md:items-center [&_h3]:text-xl [&_h3]:font-semibold">
      <h2 className="text-4xl font-bold max-md:hidden">모집 참여 내역</h2>
      <FindHistoryContainer loginData={loginData!} />
    </div>
  );
}
