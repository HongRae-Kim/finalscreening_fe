"use client";

import { useMenuStore, useMyProfileMenuStore } from "@/stores/menuStore";
import MyProfileMenuTab from "./MyProfileMenuTab";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function MyProfileNav() {
  const { setMenu: setGnbMenu } = useMenuStore();
  const { currentMenu } = useMyProfileMenuStore();

  useEffect(() => {
    setGnbMenu("");
  }, []);

  return (
    <nav className="max-md:bg-bg-primary flex min-w-55 flex-col gap-11 max-md:flex-row max-md:justify-center">
      <h1 className="text-content-main text-5xl font-bold max-md:hidden">
        마이 프로필
      </h1>
      <ul className="flex flex-col gap-5.5 max-md:flex-row max-md:gap-4">
        <MyProfileMenuTab
          path={`account`}
          text="계정 관리"
          isActive={currentMenu === "account"}
        />
        <MyProfileMenuTab
          path={`link`}
          text="게임 아이디 연동"
          isActive={currentMenu === "link"}
        />
        <MyProfileMenuTab
          path={`reviews`}
          text="리뷰 조회"
          isActive={currentMenu === "reviews"}
        />
        <MyProfileMenuTab
          path={`find-history`}
          text="모집 참여 내역"
          isActive={currentMenu === "find-history"}
        />
        <MyProfileMenuTab
          path={`ban`}
          text="차단 목록"
          isActive={currentMenu === "ban"}
        />
      </ul>
    </nav>
  );
}
