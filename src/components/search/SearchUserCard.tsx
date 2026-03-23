"use client";

import { SearchUser } from "@/types/userList";
import { ChevronRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import IntroduceBubble from "../profile/IntroduceBubble";
import Avatar from "../common/Avatar";
import HorizontalCardContainer from "../common/container/HorizontalCardContainer";

export default function SearchUserCard({ userData }: { userData: SearchUser }) {
  return (
    <Link href={`/profile/${userData.userId}`}>
      <HorizontalCardContainer className="hover:border-accent/50 grid h-19 w-full grid-cols-[120px_1fr_auto_40px] items-center gap-8 transition-all duration-150 hover:cursor-pointer max-md:flex max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex items-center gap-2 max-md:gap-3">
          <Avatar
            size="xs"
            type="profile"
            src={userData.profileImageUrl ?? ""}
            className="max-md:size-10"
          />
          <p className="max-md:text-sm">{userData.nickname}</p>
        </div>

        <IntroduceBubble
          type="message"
          content={userData.bio ?? "아직 자기소개를 작성하지 않았어요."}
          className="h-11 w-full overflow-hidden max-md:h-9 max-md:text-sm"
        />

        {userData.gameAccount.linked ? (
          <div className="border-accent/50 bg-accent/10 flex h-8 items-center justify-center gap-1 rounded-xl border px-4 py-2 whitespace-nowrap max-md:h-7 max-md:px-3">
            <LinkIcon className="text-accent" size={14} />
            <span className="text-content-primary text-sm max-md:text-xs">
              {userData.gameAccount.gameName}
            </span>
            <span className="text-content-secondary text-xs max-md:text-[10px]">
              #{userData.gameAccount.tagLine}
            </span>
          </div>
        ) : (
          <div className="border-border-primary text-content-primary bg-bg-secondary flex h-8 items-center justify-center gap-1 rounded-xl border px-4 py-2 whitespace-nowrap max-md:h-7 max-md:px-3">
            <LinkIcon size={14} />
            <span className="text-sm max-md:text-xs">연동 데이터 없음</span>
          </div>
        )}

        <ChevronRight
          size={30}
          className="text-content-secondary max-md:hidden"
        />
      </HorizontalCardContainer>
    </Link>
  );
}
