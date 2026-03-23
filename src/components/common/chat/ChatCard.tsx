"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

import formatRelativeTime from "@/utils/formatRelativeTime";
import Avatar from "@/components/common/Avatar";

export type ChatCardMenuItem = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
};

export type ChatCardProps = {
  avatarSrc: string;
  avatarAlt?: string;
  nickname: string;
  createdAt: string;
  message: string;
  subMessage?: string;
  unreadCount?: number;
  onClick?: () => void;
  menuItems?: ChatCardMenuItem[];
  className?: string;
  isSelected?: boolean;
};

export default function ChatCard({
  avatarSrc,
  avatarAlt = "avatar",
  nickname,
  createdAt,
  message,
  subMessage,
  unreadCount,
  onClick,
  menuItems,
  className,
  isSelected = false,
}: ChatCardProps) {
  const hasMenu = !!menuItems && menuItems.length > 0;

  console.log("hasMenu:", hasMenu, "menuItems:", menuItems);

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      className={[
        /* base */
        "h-25.25 w-full min-w-0",
        "flex items-center gap-3 p-4",
        "rounded-xl border",
        "text-content-main",
        onClick ? "cursor-pointer" : "",

        // border는 공통
        "border border-(--color-border-primary)",

        // background
        isSelected
          ? "border-accent bg-accent/10"
          : "bg-bg-primary hover:bg-accent/10",

        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 프로필 이미지 */}
      <Avatar
        type="profile"
        size="md"
        src={avatarSrc ?? ""}
        className="shrink-0"
      />

      {/* 텍스트 영역 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* 상단 */}
        <div className="flex w-full min-w-0 items-center gap-2">
          <p className="truncate font-semibold">{nickname}</p>
          <span className="text-content-secondary shrink-0 text-[0.875rem]">
            · {formatRelativeTime(createdAt)}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {typeof unreadCount === "number" && unreadCount > 0 && (
              <span className="bg-accent text-bg-primary flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[0.75rem] font-semibold">
                {unreadCount}
              </span>
            )}

            {hasMenu && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label="more"
                    onClick={(e) => e.stopPropagation()}
                    className="text-content-secondary hover:text-content-main hover:bg-bg-tertiary rounded-md p-1"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                    className="min-w-40 rounded-lg border border-(--color-border-primary) bg-(--color-bg-secondary) p-1 shadow-lg"
                  >
                    {menuItems!.map((item) => (
                      <DropdownMenu.Item
                        key={item.label}
                        disabled={item.disabled}
                        onSelect={item.onSelect}
                        className="text-content-primary rounded-md px-3 py-2 text-[0.875rem] outline-none select-none data-disabled:opacity-50 data-highlighted:bg-(--color-bg-tertiary)"
                      >
                        {item.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>

        {/* 메인 메시지 */}
        <p className="text-content-primary truncate text-[0.9375rem]">
          {message}
        </p>

        {/* 서브 메시지 */}
        {subMessage && (
          <p className="text-content-secondary truncate text-[0.875rem]">
            {subMessage}
          </p>
        )}
      </div>
    </article>
  );
}
