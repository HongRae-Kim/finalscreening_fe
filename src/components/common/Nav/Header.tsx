"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useMenuStore } from "@/stores/menuStore";
import HeaderMenuTab from "./HeaderMenuTab";
import GameSelectDropdown from "./GameSelectDropdown";
import ThemeToggleBtn from "./ThemeToggleBtn";
import ProfilePopover from "./ProfilePopover";
import { BoxButton } from "../button/BoxButton";
import { MyProfile } from "@/types/profile";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  type: "compact" | "full";
  userData: MyProfile | null;
}

export default function Header({ type, userData }: HeaderProps) {
  const { currentGame, currentMenu, setMenu } = useMenuStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setOpen(false);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-bg-primary fixed top-0 left-0 z-50 flex h-(--header-h) w-full shrink-0 justify-center px-(--global-padding)">
      <div className="flex h-full w-(--content-area) items-center justify-between">
        {type === "compact" ? (
          <Link href={`/`}>
            <Image
              src={logo}
              alt="logo"
              width={140}
              className="h-auto object-contain"
              priority
            />
          </Link>
        ) : (
          <div className="flex items-center gap-13">
            <Link href={`/`}>
              <Image
                src={logo}
                alt="logo"
                width={140}
                className="h-auto object-contain"
                priority
              />
            </Link>

            <ul className="flex gap-4 max-[790px]:hidden">
              <HeaderMenuTab
                text="듀오 찾기"
                path={`${currentGame}/find`}
                isActive={currentMenu === "find"}
              />
              <HeaderMenuTab
                text="유저 검색"
                path="search"
                isActive={currentMenu === "search"}
              />
              <HeaderMenuTab
                text="유저 리뷰"
                path="reviews"
                isActive={currentMenu === "reviews"}
              />
              <HeaderMenuTab
                text="채팅"
                path="chat"
                isActive={currentMenu === "chat"}
              />
            </ul>
          </div>
        )}
        <div className="flex items-center gap-4">
          {type === "full" && (
            <>
              <div className="max-md:hidden">
                <GameSelectDropdown />
              </div>
              <button className="hidden cursor-pointer">
                <Bell
                  size={25}
                  className="fill-bg-tertiary text-bg-tertiary hover:fill-bg-quaternary hover:text-bg-quaternary"
                />
              </button>
            </>
          )}

          <ThemeToggleBtn />

          {userData ? (
            <ProfilePopover
              currentMenu={currentMenu}
              profileImage={userData.profileImage ?? undefined}
            />
          ) : (
            <Link href="/login">
              <BoxButton text="로그인" tone="color" size="sm" />
            </Link>
          )}
          {type === "full" && (
            <button
              className="hover:text-accent flex cursor-pointer items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Menu size={24} />
            </button>
          )}

          <AnimatePresence>
            {open && (
              <motion.ul
                key="mobile-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                }}
                className="bg-bg-primary fixed top-(--header-h) left-0 z-10 flex w-full flex-col gap-2 p-(--global-padding) shadow-md dark:bg-neutral-900"
              >
                <GameSelectDropdown mobile />
                <HeaderMenuTab
                  text="듀오 찾기"
                  path={`${currentGame}/find`}
                  isActive={currentMenu === "find"}
                />
                <HeaderMenuTab
                  text="유저 검색"
                  path="search"
                  isActive={currentMenu === "search"}
                />
                <HeaderMenuTab
                  text="유저 리뷰"
                  path="reviews"
                  isActive={currentMenu === "reviews"}
                />
                <HeaderMenuTab
                  text="채팅"
                  path="chat"
                  isActive={currentMenu === "chat"}
                />
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
