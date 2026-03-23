"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface MyProfileMenuTabProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  path: string;
  isActive?: boolean;
}

export default function MyProfileMenuTab({
  text,
  path,
  isActive,
  ...props
}: MyProfileMenuTabProps) {
  return (
    <Link href={path} {...props}>
      <li
        className={twMerge(
          "flex items-stretch",
          isActive &&
            "border-accent border-r-2 max-md:border-r-0 max-md:border-b-2",
        )}
      >
        <span
          className={twMerge(
            "text-content-primary p-2 text-xl font-medium max-md:py-4 max-md:text-sm",
            isActive && "text-accent",
          )}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
