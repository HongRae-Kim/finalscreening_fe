"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { useRouter } from "next/navigation";
import { BoxButton } from "@/components/common/button/BoxButton";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="m-auto flex min-h-dvh w-(--content-area) max-w-full items-center">
      <section className="ml-40 flex flex-col gap-9">
        {/* 로고 / 타이틀 */}
        <Image src={logo} alt="match-my-duo logo" width={200} />

        {/* 메시지 */}
        <div className="text-content-primary flex flex-col gap-5 text-5xl font-bold">
          <p>이 길은 막다른 길!</p>
          <p>다시 듀오를 찾으러 가볼까요?</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4">
          <BoxButton
            size="lg"
            tone="color"
            text="홈으로 돌아가기"
            onClick={() => router.push("/")}
            className="py-5 text-xl"
          ></BoxButton>

          <BoxButton
            size="lg"
            tone="black"
            text="이전 페이지"
            onClick={() => router.back()}
            className="py-5 text-xl"
          ></BoxButton>
        </div>
      </section>
    </main>
  );
}
