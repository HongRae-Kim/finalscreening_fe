"use client";

import Image from "next/image";
import LolLogo from "@/assets/images/games/lol/lol-logo.png";
import OverwatchLogo from "@/assets/images/games/overwatch/overwatch-logo.png";
import ValorantLogo from "@/assets/images/games/valorant/valorant-logo.png";
import { BoxButton } from "@/components/common/button/BoxButton";
import { twMerge } from "tailwind-merge";
import HorizontalCardContainer from "@/components/common/container/HorizontalCardContainer";
import formatDateToDot from "@/utils/formatDateToDot";
import { GameAccount } from "@/types/game-account";
import { UnlinkGameAccount } from "@/services/game-account/link.client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LinkGameIdFormModal from "./LinkGameIdFormModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface GameIdItemProps {
  gameAccountData: GameAccount;
  className?: string;
}

type gameType = "LEAGUE_OF_LEGENDS" | "OVERWATCH" | "VALORANT";

const gameIcons: Record<gameType, string> = {
  LEAGUE_OF_LEGENDS: LolLogo.src,
  OVERWATCH: OverwatchLogo.src,
  VALORANT: ValorantLogo.src,
};

export default function LinkedGameIdCard({
  gameAccountData,
  className,
}: GameIdItemProps) {
  const router = useRouter();
  const { gameAccountId, gameType, gameNickname, gameTag, updatedAt } =
    gameAccountData;
  const [isOpen, setIsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <HorizontalCardContainer
      className={twMerge(
        "flex w-full items-center justify-between border-none max-md:px-4 max-md:py-3",
        className,
      )}
    >
      {/* Left: Icon + Texts */}
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 overflow-hidden rounded-xl bg-black p-4 max-md:h-16 max-md:w-16">
          <Image
            src={gameIcons[gameType as gameType]}
            alt={`${gameType} icon`}
            width={50}
            height={50}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-semibold max-md:text-lg">
            {gameType === "LEAGUE_OF_LEGENDS"
              ? "리그 오브 레전드"
              : gameType === "VALORANT"
                ? "발로란트"
                : "오버워치"}
          </span>
          <span className="text-content-secondary text-base max-md:text-sm">
            {gameNickname} #{gameTag}
          </span>
        </div>
      </div>

      {/* Right: Date + Button */}
      <div className="flex flex-col items-center gap-1">
        <div className="space-x-1.5">
          <BoxButton
            tone="black"
            text="수정"
            className="h-9 py-2 text-sm"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          />
          <BoxButton
            tone="negative"
            text="해제"
            className="h-9 py-2 text-sm"
            size="sm"
            onClick={() => {
              setConfirmModalOpen(true);
            }}
          />
        </div>
        <span className="text-content-secondary text-sm max-md:text-xs">
          연동 날짜: {formatDateToDot(updatedAt)}
        </span>
        <ConfirmModal
          open={confirmModalOpen}
          onOpenChange={setConfirmModalOpen}
          title="정말 해제하시겠습니까?"
          description="연동된 계정은 3개월 단위로 변경할 수 있습니다."
          confirmText="해제"
          onConfirm={async () => {
            await UnlinkGameAccount(String(gameAccountId));
            router.replace("/myprofile/link");
          }}
        />
      </div>
      <LinkGameIdFormModal
        mode="modify"
        initialData={gameAccountData}
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      />
    </HorizontalCardContainer>
  );
}
