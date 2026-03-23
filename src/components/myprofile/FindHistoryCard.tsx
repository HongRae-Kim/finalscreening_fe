"use client";

import lolLogo from "@/assets/images/games/lol/lol-logo.png";
import overwatchLogo from "@/assets/images/games/overwatch/overwatch-logo.png";
import valorantLogo from "@/assets/images/games/valorant/valorant-logo.png";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import formatRelativeTime from "@/utils/formatRelativeTime";
import { ChevronDown, ChevronUp, Crown } from "lucide-react";
import IntroduceBubble from "../profile/IntroduceBubble";
import HorizontalCardContainer from "../common/container/HorizontalCardContainer";
import StateBadge from "../common/StateBadge";
import Avatar from "../common/Avatar";
import { BoxButton } from "../common/button/BoxButton";
import { twMerge } from "tailwind-merge";
import { MyPartySummary, QUEUE_TYPES_LABEL } from "@/types/party";
import { PostStatus } from "@/types/post";
import { useGetPartyDetail } from "@/hooks/useGetPartyDetail";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/menuStore";
import { deletePost } from "@/services/posts.client";
import { useGetRequestReviews } from "@/hooks/reviews/useGetRequestReviews";
import { showToast } from "@/lib/toast";
import { ConfirmModal } from "../common/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { useReviewStore } from "@/stores/reviewStore";

type GameName = "lol" | "overwatch" | "valorant";

const GAME_LOGO_MAP: Record<GameName, StaticImageData> = {
  lol: lolLogo,
  overwatch: overwatchLogo,
  valorant: valorantLogo,
};

export default function FindHistoryCard({
  PartyData,
  currentUserId,
}: {
  PartyData: MyPartySummary;
  currentUserId: number;
}) {
  const router = useRouter();
  const qc = useQueryClient();

  const { currentGame } = useMenuStore();
  const { setInitialData } = useReviewStore();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const { postId, postTitle, queueType, status, myRole, joinedAt } = PartyData;

  const { data: detailParty, isLoading: detailPartyIsLoading } =
    useGetPartyDetail(postId);

  const gameLogoSrc = GAME_LOGO_MAP["lol"];

  const members =
    detailParty?.members.sort((a, b) => a.partyMemberId - b.partyMemberId) ??
    [];
  const leader = members.filter((m) => m.role === "LEADER")[0];

  const { data: RequestReviewsData, isLoading: RequestReviewsIsLoading } =
    useGetRequestReviews();

  const currentRequestReview = RequestReviewsData
    ? RequestReviewsData?.filter((r) => r.partyId === detailParty?.partyId)
    : null;

  if (detailPartyIsLoading || RequestReviewsIsLoading) return null;

  return (
    <div>
      <HorizontalCardContainer
        className={twMerge(
          "w-full cursor-pointer text-left",
          isOpen && "rounded-b-none",
        )}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="flex w-full flex-col items-start justify-between gap-3 text-left min-[1230px]:flex-row min-[1230px]:items-center"
        >
          <div className="flex w-full items-center gap-3 min-[1230px]:w-auto">
            <Image
              src={gameLogoSrc}
              alt="lol logo"
              className="h-9 w-9 shrink-0 rounded-md object-cover"
            />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 min-[1230px]:w-50">
              <div className="flex min-w-0 items-center gap-2">
                <Avatar
                  type="profile"
                  src={leader.profileImage}
                  alt="leader profile image"
                  width={32}
                  height={32}
                  size="xs"
                />
                <span className="text-content-primary min-w-0 truncate text-sm">
                  {leader.nickname}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-accent text-sm font-semibold">
                  {QUEUE_TYPES_LABEL[queueType]}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 min-[1230px]:flex-1">
            <IntroduceBubble
              content={postTitle}
              size="sm"
              className="line-clamp-2 min-[1230px]:line-clamp-none min-[1230px]:truncate"
            />
          </div>

          <div className="text-content-secondary min-[1230px]lg:justify-end flex w-full items-center justify-between gap-3 text-xs min-[1230px]:w-auto">
            <StateBadge state={status as PostStatus} className="w-20 text-xs" />

            <div className="flex w-17 shrink-0 cursor-pointer items-center justify-end gap-1">
              <span>{formatRelativeTime(joinedAt)}</span>
              <span className="text-base">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
          </div>
        </button>
      </HorizontalCardContainer>
      {isOpen && (
        <>
          <HorizontalCardContainer
            className={isOpen && "rounded-t-none border-t-0"}
          >
            <div className="space-y-4">
              <p className="text-sm font-bold">함께 플레이 한 유저</p>
              {members &&
                members.map((m, index) => (
                  <div
                    key={`member${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {m.profileImage ? (
                        <Avatar src={m.profileImage} type="profile" size="xs" />
                      ) : (
                        <Avatar src="" type="profile" size="xs" />
                      )}

                      <span>{m.nickname}</span>
                      {m.role === "LEADER" && (
                        <Crown size={18} className="text-accent" />
                      )}
                    </div>
                    {currentUserId !== m.userId &&
                      status === "CLOSED" &&
                      (!currentRequestReview ||
                      currentRequestReview.length === 0 ? (
                        <span className="text-accent text-xs">작성 완료</span>
                      ) : (
                        <BoxButton
                          text="리뷰 작성"
                          size="xs"
                          tone="color"
                          className="text-xs"
                          onClick={() => {
                            setInitialData({
                              nickName: m.nickname,
                              profileImage: m.profileImage,
                            });
                            router.push(
                              `/myprofile/reviews/post/${PartyData.partyId}?revieweeId=${m.userId}`,
                            );
                          }}
                        />
                      ))}
                  </div>
                ))}
            </div>{" "}
            {leader.userId === currentUserId && (
              <div className="mt-3 flex justify-end gap-2">
                <BoxButton
                  text="수정"
                  tone="black"
                  size="xs"
                  onClick={() => {
                    if (status === "CLOSED") {
                      showToast.error(
                        "게임을 완료한 모집글은 수정할 수 없습니다.",
                      );
                      return;
                    }

                    router.push(`/${currentGame}/modify/${postId}`);
                  }}
                />
                <BoxButton
                  text="삭제"
                  tone="negative"
                  size="xs"
                  onClick={async () => {
                    if (status === "CLOSED") {
                      showToast.error(
                        "게임을 완료한 모집글은 삭제할 수 없습니다.",
                      );
                      return;
                    }
                    setConfirmModalOpen(true);
                  }}
                />
                <ConfirmModal
                  open={confirmModalOpen}
                  onOpenChange={setConfirmModalOpen}
                  title="정말 삭제하시겠습니까?"
                  description="삭제하면 다시 복구할 수 없습니다."
                  confirmText="삭제"
                  onConfirm={async () => {
                    await deletePost(postId);
                    await qc.invalidateQueries({
                      queryKey: [postId, "party"],
                    });

                    router.refresh();
                    router.push(`/myprofile/find-history`);
                  }}
                />
              </div>
            )}
          </HorizontalCardContainer>
        </>
      )}
    </div>
  );
}
