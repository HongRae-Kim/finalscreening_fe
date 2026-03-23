"use client";

import { UserList } from "@/types/userList";
import SearchUserCard from "./SearchUserCard";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export default function SearchUserList({
  userListData,
}: {
  userListData: UserList;
}) {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname");
  return (
    <div className="mt-12.5 flex flex-col items-center justify-items-center gap-7.5">
      <div className="text-content-secondary flex text-xl">
        <p className="text-accent">{nickname}</p>
        <p className="mr-1">에 대한</p>
        <p className="text-accent">{userListData.totalCount}명</p>
        <p>의 유저를 찾았어요</p>
      </div>
      <div className="flex flex-col gap-2">
        {userListData.users.map((user) => (
          <SearchUserCard key={user.userId} userData={user} />
        ))}
      </div>
    </div>
  );
}
