"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface HeaderMenuTabProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  path: string;
  isActive?: boolean;
}

export default function HeaderMenuTab({
  text,
  path,
  isActive,
  ...props
}: HeaderMenuTabProps) {
  return (
    <Link href={`/${path}`} {...props}>
      <li
        className={twMerge(
          "flex items-stretch",
          isActive && "border-accent border-b-2",
        )}
      >
        <span
          className={twMerge(
            "text-content-primary p-3 text-base font-semibold",
            isActive && "text-accent",
          )}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
