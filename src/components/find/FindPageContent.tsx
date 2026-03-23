"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import ToggleBtn from "@/components/common/button/ToggleBtn";
import Dropdown from "@/components/common/Dropdown";
import FindCard from "@/components/find/main-card/FindCard";
import PositionFilterBtns from "@/components/find/PositionFilterBtns";
import { useEffect, useMemo, useState } from "react";
import { useMenuStore } from "@/stores/menuStore";
import { Post, PostListResponse, PostStatus } from "@/types/post";
import { Unlink } from "lucide-react";
import gameIconLol from "@/assets/images/game-icon-lol.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QUEUE_TYPES, QUEUE_TYPES_LABEL, QueueType } from "@/types/party";
import { Tier, TIERS, TIERS_LABEL } from "@/types/tier";
import { MyProfile } from "@/types/profile";
import { GameAccount } from "@/types/game-account";
import { useMyParties } from "@/hooks/useMyParties";
import LoadingBouncy from "../common/loading/LoadingBouncy";
import { useQuery } from "@tanstack/react-query";
import { GetPosts } from "@/services/posts.client";
import { Position } from "@/types/position";
import { showToast } from "@/lib/toast";

export default function FindPageContent({
  postData,
  loginData,
  gameAccountData,
}: {
  postData: Post[] | null;
  loginData: MyProfile | null;
  gameAccountData: GameAccount[] | null;
}) {
  const router = useRouter();

  const { data: myPartiesData, isLoading: myPratiesDataIsLoading } =
    useMyParties(loginData?.id);
  const { currentGame, setMenu } = useMenuStore();

  const [status, setStatus] = useState<PostStatus>("RECRUIT");
  const [queueType, setQueueType] = useState<QueueType | "ALL">("ALL");
  const [tier, setTier] = useState<Tier | "ALL">("ALL");
  const [myPositions, setMyPositions] = useState<Position[]>([]);

  const filters = { status, queueType, tier, myPositions };
  const apiParams = {
    status,
    queueType: queueType === "ALL" ? null : queueType,
    tier: tier === "ALL" ? null : tier,
    myPositions: myPositions ?? null,
  };

  const initial: PostListResponse = {
    posts: postData ?? [],
    nextCursor: null,
    hasNext: false,
  };

  const isDefaultFilter =
    status === "RECRUIT" &&
    queueType === "ALL" &&
    tier === "ALL" &&
    myPositions.length === 0;

  const { data, isLoading, isPending } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => GetPosts(apiParams),
    initialData: isDefaultFilter ? initial : undefined,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });

  const posts = data?.posts ?? [];

  const currentParty =
    myPartiesData?.data.parties.filter(
      (party) => party.status === "RECRUIT",
    )[0] ?? null;

  useEffect(() => {
    setMenu("find");
  }, []);

  if (myPratiesDataIsLoading || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingBouncy />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-7.5 max-lg:gap-3">
      <ToggleBtn
        value={status}
        onChange={(next) => setStatus(next)}
        className="mt-17.5"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3 max-lg:w-full max-lg:flex-col max-lg:items-start max-lg:justify-start">
          <div className="flex justify-between max-lg:w-full">
            <PositionFilterBtns
              value={myPositions}
              onChange={(next) => setMyPositions(next)}
            />
            <BoxButton
              text="모집글 작성"
              size="sm"
              tone={"gradient_positive"}
              className="font-semibold lg:hidden"
              onClick={() => {
                if (!loginData) {
                  showToast.error("로그인이 필요한 기능입니다.");
                  return;
                }
                if (gameAccountData?.length === 0) {
                  showToast.error(
                    "게임 아이디 연동 후 이용할 수 있는 기능입니다.",
                  );
                  router.push(`/myprofile/link`);
                  return;
                }
                if (currentParty) {
                  showToast.error("현재 모집중인 파티가 있습니다.");
                  return;
                }
                router.push(`/${currentGame}/post`);
              }}
            />
          </div>

          <div className="flex gap-2 max-lg:w-full">
            <Dropdown
              name="gameMode"
              placeholder="게임 모드를 선택해주세요"
              onValueChange={() => {}}
              value="SUMMONERS_RIFT"
              items={[
                {
                  value: "SUMMONERS_RIFT",
                  label: (
                    <div className="flex w-fit items-center gap-2.5">
                      <Image
                        src={gameIconLol}
                        alt={`lol icon`}
                        width={20}
                        className="object-cover max-lg:hidden"
                      />
                      <span>소환사의 협곡</span>
                    </div>
                  ),
                },
              ]}
              className="w-50 max-lg:w-full"
            />
            <Dropdown
              name="queueType"
              placeholder="큐 타입을 선택해주세요"
              value={queueType}
              onValueChange={(v) => setQueueType(v as QueueType | "ALL")}
              items={[
                { value: "ALL", label: "전체 큐" },
                ...QUEUE_TYPES.map((t) => ({
                  value: t,
                  label: QUEUE_TYPES_LABEL[t],
                })),
              ]}
              className="w-50 max-lg:w-full"
            />
            <Dropdown
              name="tiers"
              placeholder="티어를 선택해주세요"
              value={tier}
              onValueChange={(v) => setTier(v as Tier)}
              items={[
                { value: "ALL", label: "전체 티어" },
                ...TIERS.map((t) => ({ value: t, label: TIERS_LABEL[t] })),
              ]}
              className="w-50 max-lg:w-full"
            />
          </div>
        </div>
        <div className="text-content-secondary flex items-center gap-4">
          <span className="text-sm max-[1150px]:hidden">
            나만의 듀오를 찾고 싶다면
          </span>
          <span className="font-light max-[1150px]:hidden">―</span>
          <BoxButton
            text="모집글 작성"
            size="sm"
            tone={"gradient_positive"}
            className="font-semibold max-lg:hidden"
            onClick={() => {
              if (!loginData) {
                showToast.error("로그인이 필요한 기능입니다.");
                return;
              }
              if (gameAccountData?.length === 0) {
                showToast.error(
                  "게임 아이디 연동 후 이용할 수 있는 기능입니다.",
                );
                router.push(`/myprofile/link`);
                return;
              }
              if (currentParty) {
                showToast.error("현재 모집중인 파티가 있습니다.");
                return;
              }
              router.push(`/${currentGame}/post`);
            }}
          />
        </div>
      </div>
      {isLoading || isPending ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingBouncy />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="mb-17 grid grid-cols-3 gap-7.5 max-[1400px]:grid-cols-2 max-lg:grid-cols-1">
          {posts.map((post, index) => (
            <FindCard
              key={index}
              data={post}
              gameAccountData={gameAccountData ?? null}
              currentUserId={loginData?.id ?? null}
            />
          ))}
        </div>
      ) : (
        <div className="m-auto flex w-full flex-col items-center justify-center gap-10.5">
          <Unlink size={160} className="text-bg-tertiary" />
          <p className="text-content-secondary text-[32px] font-bold">
            등록된 모집글이 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
