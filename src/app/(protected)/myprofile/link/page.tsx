import LinkedGameIdContainer from "@/components/myprofile/link/LinkedGameIdContainer";
import { getGameAccount } from "@/services/users";

import { CircleAlert } from "lucide-react";

export default async function LinkPage() {
  const gameAccountData = await getGameAccount();
  return (
    <div className="flex w-full flex-col gap-11 max-md:w-110 [&_h3]:text-xl [&_h3]:font-semibold">
      <h2 className="text-4xl font-bold max-md:hidden">게임 아이디 연동</h2>
      <LinkedGameIdContainer gameAccountData={gameAccountData} />
      <div className="space-y-1">
        <p className="text-content-secondary flex items-center gap-1 text-base max-md:text-sm">
          <CircleAlert className="size-4.5 max-md:size-4" />
          연동된 계정은 3개월 단위로 변경할 수 있습니다.
        </p>
        <p className="text-negative flex items-center gap-1 text-base max-md:text-sm">
          <CircleAlert className="size-4.5 max-md:size-4" />
          타인의 아이디를 도용하는 경우 서비스 이용이 제한될 수 있습니다
        </p>
      </div>
    </div>
  );
}
