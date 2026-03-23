"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import emojiGood from "@/assets/images/emoji/emoji_good.png";
import emojiNormal from "@/assets/images/emoji/emoji_normal.png";
import emojiBad from "@/assets/images/emoji/emoji_bad.png";
import lolLogo from "@/assets/images/games/lol/lol-logo.png";
import overwatchLogo from "@/assets/images/games/overwatch/overwatch-logo.png";
import valorantLogo from "@/assets/images/games/valorant/valorant-logo.png";
import formatRelativeTime from "@/utils/formatRelativeTime";
import type { EmojiType as Emotion } from "@/types/emoji";
import IntroduceBubble from "../../profile/IntroduceBubble";
import HorizontalCardContainer from "../../common/container/HorizontalCardContainer";
import Avatar from "../../common/Avatar";
import { MessageDirection } from "./MyReviewFilterToggle";
import ClientApi from "@/lib/clientApi";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useReviewStore } from "@/stores/reviewStore";
import { showToast } from "@/lib/toast";
import { twMerge } from "tailwind-merge";
import { ConfirmModal } from "@/components/common/ConfirmModal";

type GameName = "lol" | "overwatch" | "valorant";

const EMOJI_MAP: Record<Emotion, StaticImageData> = {
  GOOD: emojiGood,
  NORMAL: emojiNormal,
  BAD: emojiBad,
};

const GAME_LOGO_MAP: Record<GameName, StaticImageData> = {
  lol: lolLogo,
  overwatch: overwatchLogo,
  valorant: valorantLogo,
};

interface ReviewCardProps {
  mode: MessageDirection;
  gameName: GameName;
  communityName: string;
  content: string;
  emotion: Emotion; // 밖에서는 이 값만 넘기면 됨
  createdAt: string; // ISO 날짜 문자열
  profileImageURL: string;
  reviewId?: number;
  className?: string;
}

export default function ReviewCard({
  mode,
  gameName,
  communityName,
  content,
  emotion,
  createdAt,
  profileImageURL,
  reviewId,
  className,
}: ReviewCardProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { setInitialData } = useReviewStore();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // 작성한 리뷰만 토글 가능
  const isToggleable = mode === "sent";

  const handleToggle = () => {
    if (!isToggleable) return; // 받은 리뷰면 클릭 무시
    setIsOpen((prev) => !prev);
  };

  const emotionSrc = EMOJI_MAP[emotion];
  const gameLogoSrc = GAME_LOGO_MAP[gameName];

  const handleDelete = async () => {
    const res = await ClientApi(`/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast.error("리뷰 삭제에 실패했습니다.");
      return;
    }

    showToast.success("리뷰를 삭제했습니다.");

    qc.invalidateQueries({
      queryKey: ["writtenReviews"],
    });
  };

  return (
    <HorizontalCardContainer className={twMerge("w-full", className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!isToggleable}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left max-lg:flex-col max-lg:items-start"
      >
        {/* 좌측 그룹 */}
        <div className="flex min-w-0 items-center gap-3 max-lg:w-full max-lg:justify-between">
          {/* 게임 아이콘 */}
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={gameLogoSrc}
              alt={`${gameName} logo`}
              className="h-9 w-9 shrink-0 rounded-md object-cover"
            />

            {/* 커뮤니티 닉네임 + 내용 */}
            <div className="flex min-w-0 items-center gap-2">
              <Avatar type="profile" src={profileImageURL} size="xs" />

              <span className="text-content-primary max-w-40 truncate text-sm">
                {communityName}
              </span>
            </div>
          </div>

          <div className="hidden max-lg:block">
            <div className="h-6 w-6 shrink-0">
              <Image
                src={emotionSrc}
                alt={`${emotion} emoji`}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 우측 그룹 */}
        <div className="min-w-0 flex-1 max-lg:w-full">
          <IntroduceBubble
            content={content}
            className="max-lg:truncate-none w-full flex-1 truncate max-lg:line-clamp-2 max-lg:min-w-0"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 max-lg:hidden">
          {/* 이모지 */}
          <div className="h-6 w-6 shrink-0">
            <Image
              src={emotionSrc}
              alt={`${emotion} emoji`}
              className="object-contain"
            />
          </div>

          {/* 시간 + 화살표 */}
          <div className="text-content-secondary flex w-24 items-center justify-end gap-1 text-xs">
            <span className="shrink-0">{formatRelativeTime(createdAt)}</span>
            {isToggleable && (
              <span className="text-base">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            )}
          </div>
        </div>

        <div className="text-content-secondary hidden w-full items-center justify-end gap-1 text-xs max-lg:flex">
          <span className="shrink-0">{formatRelativeTime(createdAt)}</span>
          {isToggleable && (
            <span className="text-base">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </div>
      </button>

      {/* 하단 수정/삭제 영역 (작성한 리뷰 + 펼쳐진 상태에서만) */}
      {isToggleable && isOpen && (
        <div className="mt-3 flex justify-end gap-2 max-lg:flex-col">
          <button
            className="cursor-pointer rounded-xl bg-slate-500 px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-slate-500/50"
            onClick={() => {
              setInitialData({
                nickName: communityName,
                profileImage: profileImageURL,
                emoji: emotion,
                content: content,
              });
              router.push(`/myprofile/reviews/modify/${reviewId}`);
            }}
          >
            수정
          </button>
          <button
            className="bg-negative hover:bg-negative/50 cursor-pointer rounded-xl px-4 py-2 text-sm text-white transition-all duration-150"
            onClick={async () => {
              setConfirmModalOpen(true);
            }}
          >
            삭제
          </button>
        </div>
      )}
      <ConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        title="정말 삭제하시겠습니까?"
        description="삭제하면 다시 복구할 수 없습니다."
        confirmText="삭제"
        onConfirm={async () => {
          await handleDelete();

          await qc.invalidateQueries({
            queryKey: ["writtenReviews"],
          });

          router.refresh();
          router.push(`/myprofile/reviews`);
        }}
      />
    </HorizontalCardContainer>
  );
}

/* 사용법 예시

import ReviewCard from "@/components/review/ReviewCard";

export default function Home() {
  return (
    <>
      // 받은 리뷰 리스트
      <ReviewCard
        mode="received"
        gameIconSrc="/lol.png"
        communityName="커뮤니티 닉네임"
        content="리뷰내용"
        emotion="good"
        createdAt="2025-12-12T00:12:00.000Z"
      />

      // 작성한 리뷰 리스트
      <ReviewCard
        mode="written"
        gameIconSrc="/lol.png"
        communityName="커뮤니티 닉네임"
        content="리뷰내용"
        emotion="bad"
        createdAt="2025-12-11T00:11:00.000Z"
      />
    </>
  );
}

*/
