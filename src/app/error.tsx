"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { useRouter } from "next/navigation";
import { BoxButton } from "@/components/common/button/BoxButton";

export default function NotFound({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="bg-bg-secondary m-auto flex min-h-dvh w-(--content-area) max-w-full items-center">
      <section className="ml-40 flex flex-col gap-9">
        {/* 로고 / 타이틀 */}
        <Image src={logo} alt="match-my-duo logo" width={200} />

        {/* 메시지 */}
        <div className="text-content-primary flex flex-col gap-5 text-5xl font-bold">
          <p>문제가 발생했습니다</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4">
          <BoxButton
            size="lg"
            tone="color"
            text="다시 시도하기"
            onClick={reset}
            className="py-5 text-xl"
          ></BoxButton>
        </div>
      </section>
    </main>
  );
}
