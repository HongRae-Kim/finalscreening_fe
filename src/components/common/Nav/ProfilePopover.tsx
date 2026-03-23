import { twMerge } from "tailwind-merge";
import LogoutBtn from "@/components/auth/logout/LogoutBtn";
import Avatar from "../Avatar";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";

export default function ProfilePopover({
  currentMenu,
  profileImage,
}: {
  currentMenu: string;
  profileImage: string | undefined;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="cursor-pointer">
          <Avatar
            src={profileImage}
            type="profile"
            size="sm"
            className={twMerge(
              "hover:border-accent hover:border-2",
              currentMenu === "profile" && "border-accent border-2",
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade bg-bg-primary border-border-primary z-99 rounded-xl border p-2 will-change-[transform,opacity]"
          sideOffset={10}
        >
          <div className="[&>:is(a,button)]:hover:bg-bg-secondary flex flex-col gap-1 text-sm [&>:is(a,button)]:cursor-pointer [&>:is(a,button)]:rounded-xl [&>:is(a,button)]:px-3 [&>:is(a,button)]:py-2">
            <Popover.Close asChild>
              <Link href={`/myprofile`}>계정 관리</Link>
            </Popover.Close>
            <Popover.Close asChild>
              <Link href={`/myprofile/link`}>게임 아이디 연동</Link>
            </Popover.Close>
            <Popover.Close asChild>
              <Link href={`/myprofile/reviews`}>리뷰 조회</Link>
            </Popover.Close>
            <Popover.Close asChild>
              <Link href={`/myprofile/find-history`}>모집 참여 내역</Link>
            </Popover.Close>
            <Popover.Close asChild>
              <Link href={`/myprofile/ban`}>차단 목록</Link>
            </Popover.Close>
            <hr aria-hidden="true" className="text-bg-tertiary w-full" />
            <LogoutBtn className="text-left" />
          </div>
          <Popover.Arrow
            className="fill-border-primary"
            width={14}
            height={8}
          />
          <Popover.Arrow
            className="fill-bg-primary -mt-px mr-px"
            width={12}
            height={7}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
