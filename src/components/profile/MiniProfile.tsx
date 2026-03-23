"use client";

import Avatar from "../common/Avatar";
import { BoxButton } from "../common/button/BoxButton";
import FindCardContainer from "../common/container/FindCardContainer";
import IntroduceBubble from "./IntroduceBubble";
import { twMerge } from "tailwind-merge";
import ClientApi from "@/lib/clientApi";
import { UserProfile } from "@/types/profile";
import { ReviewDistribution } from "@/types/review";
import ReviewPercent from "../review/ReviewPercent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanUsersList } from "@/services/ban.client";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

interface MiniProfileProps extends React.ComponentPropsWithoutRef<"div"> {
  userData: UserProfile;
  reviewDistributionData: ReviewDistribution;
  className?: string;
  currentUserId: number | null;
}

export default function MiniProfile({
  userData,
  reviewDistributionData,
  className,
  currentUserId,
}: MiniProfileProps) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: banList, isLoading: isBanListLoading } = useQuery({
    queryKey: ["ban"],
    queryFn: getBanUsersList,
    enabled: !!currentUserId,
  });
  const banListData = banList ?? [];
  const isUserBlocked = banListData.some((ban) => ban.userId === userData.id);

  const banMutation = useMutation({
    mutationFn: async (targetUserId: number) => {
      const res = await ClientApi(`/api/v1/users/${targetUserId}/blocks`, {
        method: "POST",
      });

      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        // 서버 응답의 에러 코드 활용
        if (data?.code === "BAN_MYSELF") {
          throw new Error("자신을 차단할 수 없습니다.");
        }
        throw new Error("유저 차단에 실패했습니다.");
      }
    },
    onSuccess: () => {
      showToast.success("유저를 차단했습니다.");
      queryClient.invalidateQueries({ queryKey: ["ban"] });
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });

  const userBanHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await banMutation.mutateAsync(userData.id);
  };

  if (!userData) return null;

  return (
    <FindCardContainer
      className={twMerge("z-99 flex flex-col gap-2", className)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <div
            className="group flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${userData.id}`);
            }}
          >
            <Avatar
              type="profile"
              src={userData.profile_image ?? ""}
              size="sm"
            />
            <h3 className="group-hover:text-accent text-sm font-bold transition-all duration-150">
              {userData.nickname}
            </h3>
          </div>
          {currentUserId && (
            <BoxButton
              size="xs"
              tone="negative"
              text={isUserBlocked ? "차단됨" : "차단하기"}
              onClick={userBanHandler}
              className={isUserBlocked ? "pointer-events-none" : ""}
              disabled={isBanListLoading || banMutation.isPending}
            />
          )}
        </div>
        <IntroduceBubble
          type="message"
          size="sm"
          content={userData.comment}
          className="w-full"
        />
      </div>
      {reviewDistributionData.totalReviews > 0 ? (
        <ReviewPercent type="mini" distributionData={reviewDistributionData} />
      ) : (
        <p className="text-content-secondary pt-2 text-center text-xs">
          리뷰 데이터가 없습니다
        </p>
      )}
    </FindCardContainer>
  );
}
