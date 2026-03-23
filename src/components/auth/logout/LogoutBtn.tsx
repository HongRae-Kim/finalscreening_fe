"use client";

import { useMenuStore } from "@/stores/menuStore";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useTransition } from "react";
import { twMerge } from "tailwind-merge";

interface LogoutBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function LogoutBtn({ className, ...props }: LogoutBtnProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setMenu } = useMenuStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // 핵심
    });

    startTransition(() => {
      setMenu("");
      router.push("/login");
      router.refresh(); // 캐시된 서버 컴포넌트들 새로고침
    });
  };
  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={twMerge(className)}
      {...props}
    >
      {isPending ? "로그아웃중..." : "로그아웃"}
    </button>
  );
}
