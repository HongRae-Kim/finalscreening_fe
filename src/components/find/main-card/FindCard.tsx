"use client";

import { Headset } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import FindCardContainer from "@/components/common/container/FindCardContainer";
import { Post } from "@/types/post";
import { twMerge } from "tailwind-merge";
import TierSet from "@/components/profile/TierSet";
import { isTier, Rank, Tier } from "@/types/tier";
import IntroduceBubble from "@/components/profile/IntroduceBubble";
import PositionSet from "./PositionSet";
import WinRate from "@/components/profile/WinRate";
import { BoxButton } from "@/components/common/button/BoxButton";
import formatRelativeTime from "@/utils/formatRelativeTime";
import { HTMLAttributes, useState } from "react";
import MiniProfile from "@/components/profile/MiniProfile";
import * as HoverCard from "@radix-ui/react-hover-card";
import SubTitleAndData from "../SubTitleAndData";
import FindCardMemberDetail from "./FindCardMemberDetail";
import FindDetailModal from "./FindDetailModal";
import { createChatRoom } from "@/services/chats.client";
import { GameAccount } from "@/types/game-account";
import { useRouter } from "next/navigation";
import { useGetPartyDetail } from "@/hooks/useGetPartyDetail";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import useGetReviewDistribution from "@/hooks/reviews/useGetReviewDistribution";
import MostChampion from "@/components/profile/MostChampion";
import { useGetFavoriteChampions } from "@/hooks/useGetFavoriteChampions";
import { showToast } from "@/lib/toast";

interface FindCardProps extends HTMLAttributes<HTMLDivElement> {
  currentUserId: number | null;
  gameAccountData: GameAccount[] | null;
  data: Post;
}

export default function FindCard({
  currentUserId,
  gameAccountData,
  data,
  ...props
}: FindCardProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFindDetailModal, setIsOpenFindDetailModal] = useState(false);
  const { createdAt, lookingPositions, memo, mic, myPosition, postId, writer } =
    data;
  const { userId, communityNickname, gameAccount, gameSummary } = writer;
  const { gameNickname, gameTag, profileIconUrl } = gameAccount;
  const { division, kda, tier, winRate } = gameSummary;

  const { data: partyData, isLoading: partyDataIsLoading } =
    useGetPartyDetail(postId);

  const partyMembers = partyData?.members;

  const { data: userData, isLoading: userDataIsLoading } = useGetUserProfile(
    Number(userId),
  );

  const { data: reviewDistributionData, isLoading: distLoading } =
    useGetReviewDistribution(Number(userId));

  const { data: championData, isLoading: championDataIsLoading } =
    useGetFavoriteChampions(userData?.gameAccountId ?? 0);

  const isLoading =
    partyDataIsLoading ||
    userDataIsLoading ||
    distLoading ||
    championDataIsLoading;

  if (isLoading) return null;

  const validTier = isTier(tier) ? tier : "UNRANKED";

  return (
    <>
      <div
        className="flex h-fit min-w-full cursor-pointer flex-col"
        onClick={(e) => {
          setIsOpenFindDetailModal(true);
        }}
        {...props}
      >
        <FindCardContainer className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="relative flex items-center gap-3">
              <HoverCard.Root openDelay={0} closeDelay={150}>
                <HoverCard.Trigger asChild>
                  <Avatar
                    type="profile"
                    src={profileIconUrl}
                    size="md"
                    className="cursor-pointer"
                  />
                </HoverCard.Trigger>
                <HoverCard.Content
                  side="top"
                  align="center"
                  className="animate-fadeIn pb-3"
                >
                  <MiniProfile
                    className="z-10"
                    userData={userData!}
                    reviewDistributionData={reviewDistributionData!}
                    currentUserId={currentUserId}
                  />
                </HoverCard.Content>
              </HoverCard.Root>

              <div>
                <div
                  className="group flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${userId}`);
                  }}
                >
                  <h3 className="group-hover:text-accent text-lg transition-all duration-150">
                    {gameNickname}
                  </h3>
                  <h3 className="text-content-secondary text-sm">#{gameTag}</h3>
                  <Headset
                    size={18}
                    strokeWidth={3}
                    className={twMerge(
                      "text-content-secondary",
                      mic && "text-accent",
                    )}
                  />
                </div>
                <h4 className="text-accent/50 text-sm">{communityNickname}</h4>
              </div>
            </div>
            <TierSet
              tier={validTier as Tier}
              rank={division as Rank}
              type="mini"
              className="inline-flex w-fit text-xs [&>img]:w-12.5"
            />
          </div>

          <div className="flex flex-col gap-1 px-5">
            <IntroduceBubble content={memo} type="message" />
            <span className="text-content-secondary text-right text-xs">
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between px-5">
            <PositionSet
              type="my"
              data={myPosition}
              isActive={true}
              size="default"
            />
            <PositionSet
              type="find"
              data={lookingPositions}
              isActive={false}
              size="default"
            />

            <div className="flex flex-col items-center justify-center gap-2 font-semibold">
              <p className="text-sm">선호 챔피언</p>
              {championData && championData.length > 0 ? (
                <MostChampion data={championData!} />
              ) : (
                <span className="text-content-secondary text-sm">
                  선호 챔피언 데이터가 없습니다
                </span>
              )}
            </div>
          </div>

          <div className="flex h-16.5 justify-between gap-10">
            <div className="flex w-full flex-col gap-2">
              <SubTitleAndData title="승률" data={`${winRate ?? 0}%`} />
              {winRate ? (
                <WinRate type="horizontal" winRate={winRate} win={0} lose={0} />
              ) : (
                <p className="text-content-secondary text-center text-sm">
                  승률 데이터가 없습니다
                </p>
              )}
            </div>
            <SubTitleAndData
              title="KDA"
              data={kda ? kda.toString() : "0"}
              className="w-27.5"
            />
          </div>

          <div
            className="bg-accent/10 border-accent/50 hover:border-border-primary flex cursor-pointer flex-col gap-3.5 rounded-xl border px-4 py-2 transition-all duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <SubTitleAndData
              title="인원"
              data={`${partyData?.currentCount}/${partyData?.maxCount}`}
            />
            <div className="flex justify-between">
              <div className="flex items-center gap-5">
                {Array.from({ length: partyData?.currentCount! }).map(
                  (_, i) => (
                    <svg
                      key={`filledMember${i}`}
                      width="17"
                      height="20"
                      viewBox="0 0 17 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9668 10.7694C13.4008 9.67298 14.3258 7.94452 14.3258 6C14.3258 2.68629 11.6395 0 8.32584 0C5.01213 0 2.32584 2.68629 2.32584 6C2.32584 7.94452 3.25085 9.67298 4.68485 10.7694C3.67937 11.2142 2.75434 11.8436 1.96188 12.636C1.34995 13.248 0.835182 13.939 0.42761 14.6851C-0.324507 16.0619 -0.0177813 17.4657 0.829231 18.4584C1.64464 19.414 2.95086 20 4.32584 20H12.3258C13.7008 20 15.007 19.414 15.8224 18.4584C16.6695 17.4657 16.9762 16.0619 16.2241 14.6851C15.8165 13.939 15.3017 13.248 14.6898 12.636C13.8973 11.8436 12.9723 11.2142 11.9668 10.7694Z"
                        fill="#2FD3B1"
                      />
                    </svg>
                  ),
                )}
                {Array.from({
                  length: partyData?.maxCount! - partyData?.currentCount!,
                }).map((_, i) => (
                  <svg
                    key={`emptyMember${i}`}
                    width="17"
                    height="20"
                    viewBox="0 0 17 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.32584 2C6.1167 2 4.32584 3.79086 4.32584 6C4.32584 8.20914 6.1167 10 8.32584 10C10.535 10 12.3258 8.20914 12.3258 6C12.3258 3.79086 10.535 2 8.32584 2ZM11.9668 10.7694C13.4008 9.67298 14.3258 7.94452 14.3258 6C14.3258 2.68629 11.6395 0 8.32584 0C5.01213 0 2.32584 2.68629 2.32584 6C2.32584 7.94452 3.25085 9.67298 4.68485 10.7694C3.67937 11.2142 2.75434 11.8436 1.96188 12.636C1.34995 13.248 0.835182 13.939 0.42761 14.6851C-0.324507 16.0619 -0.0177813 17.4657 0.829231 18.4584C1.64464 19.414 2.95086 20 4.32584 20H12.3258C13.7008 20 15.007 19.414 15.8224 18.4584C16.6695 17.4657 16.9762 16.0619 16.2241 14.6851C15.8165 13.939 15.3017 13.248 14.6898 12.636C13.8973 11.8436 12.9723 11.2142 11.9668 10.7694ZM8.32584 12C6.46932 12 4.68885 12.7375 3.37609 14.0503C2.90009 14.5263 2.49977 15.0637 2.18279 15.6439C1.87583 16.2058 1.97485 16.7198 2.35064 17.1602C2.75804 17.6376 3.49168 18 4.32584 18H12.3258C13.16 18 13.8936 17.6376 14.301 17.1602C14.6768 16.7198 14.7758 16.2058 14.4689 15.6439C14.1519 15.0637 13.7516 14.5263 13.2756 14.0503C11.9628 12.7375 10.1824 12 8.32584 12Z"
                      fill="#62748E"
                    />
                  </svg>
                ))}
              </div>
              <BoxButton
                size="xs"
                tone="color"
                text="참여하기"
                onClick={async (e) => {
                  e.stopPropagation();

                  // 로그인 필요 (작성자/참여자 모두 인증 사용자)
                  if (!currentUserId) {
                    showToast.error("로그인이 필요한 기능입니다.");

                    return;
                  }

                  // 게임 아이디 연동 필요
                  if (!gameAccountData || gameAccountData.length === 0) {
                    showToast.error(
                      "게임 아이디 연동 후 이용할 수 있는 기능입니다.",
                    );
                    router.push(`/myprofile/link`);
                    return;
                  }

                  try {
                    // Swagger: POST /api/v1/chats  body: { postId }
                    // 이미 존재하면 기존 채팅방 반환(멱등)
                    const res = await createChatRoom({ postId });

                    // 채팅 페이지로 이동하면서 방을 바로 열 수 있도록 roomId 전달
                    router.push(`/chat?roomId=${res.chatRoomId}`);
                  } catch (err) {
                    showToast.error(
                      "채팅방 생성에 실패했습니다. 다시 시도해주세요.",
                    );
                  }
                }}
              />
            </div>
          </div>
        </FindCardContainer>

        {isOpen && (
          <FindCardMemberDetail
            isLeader={currentUserId === userId}
            currentCount={partyData?.currentCount!}
            maxCount={partyData?.maxCount!}
            partyMembersData={partyMembers!}
            postId={postId}
            partyId={Number(partyData?.partyId)}
          />
        )}
      </div>
      <FindDetailModal
        postData={data}
        isLeader={currentUserId === userId}
        isOpen={isOpenFindDetailModal}
        onOpenChange={(open: boolean) => {
          setIsOpenFindDetailModal(open);
        }}
        gameAccount={gameAccount}
      />
    </>
  );
}
