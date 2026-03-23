"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import { Link2Off } from "lucide-react";
import { useState } from "react";
import LinkGameIdFormModal from "./LinkGameIdFormModal";

export default function LinkGameIdBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-bg-primary flex flex-col items-center gap-8 rounded-xl py-14">
      <div className="bg-accent/10 flex h-20 w-20 items-center justify-center rounded-full">
        <Link2Off size={36} className="text-accent" strokeWidth={3} />
      </div>
      <div className="space-y-2">
        <p className="text-center text-[32px] font-semibold max-md:text-2xl">
          연동된 게임 아이디가 없습니다
        </p>
        <p className="text-content-secondary text-center text-xl max-md:text-base">
          게임 아이디를 연동해서 프로필을 완성하고 듀오를 구해보세요
        </p>
      </div>
      <BoxButton
        text="게임 아이디 연동하기"
        size="lg"
        tone="gradient_positive"
        onClick={() => setIsOpen(true)}
        className="max-md:h-13 max-md:text-base"
      />
      <LinkGameIdFormModal
        mode="link"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      />
    </div>
  );
}
