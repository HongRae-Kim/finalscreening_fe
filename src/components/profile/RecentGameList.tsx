"use client";

import { useGetRecentMatch } from "@/hooks/useGetRecentMatch";
import { QUEUE_NAME, queueId } from "@/types/party";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Avatar from "../common/Avatar";
import { useEffect, useState } from "react";
import { BoxButton } from "../common/button/BoxButton";

const VIEW_STEP = 5;

export default function RecentGameList({
  gameAccountId,
}: {
  gameAccountId: number;
}) {
  const [count, setCount] = useState(VIEW_STEP);

  useEffect(() => {
    setCount(VIEW_STEP);
  }, [gameAccountId]);

  const {
    data: MatchData,
    isLoading,
    isFetching,
  } = useGetRecentMatch({
    gameAccountId: gameAccountId ?? 0,
    count,
  });

  if (isLoading && !MatchData) {
    return <p className="text-content-secondary">불러오는 중...</p>;
  }

  const hasMore = !!MatchData && MatchData.length === count;

  const onClickMore = () => {
    setCount((c) => c + VIEW_STEP);
  };

  return (
    <>
      {MatchData && MatchData.length > 0 ? (
        <div className="text-content-primary flex flex-col justify-center gap-2 text-base">
          {MatchData.map((c) => (
            <div
              key={c.matchId}
              className={twMerge(
                "bg-negative/10 border-negative flex w-full justify-between rounded-xl border px-6 py-3",
                "max-[960px]:flex-col max-[960px]:gap-3",
                c.win && "bg-positive/10 border-positive",
              )}
            >
              <div className="flex w-120 justify-between gap-10.5 max-lg:w-110">
                {/* 게임 모드, 시간 */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <span
                    className={twMerge(
                      "text-negative text-base",
                      c.win && "text-positive",
                    )}
                  >
                    {QUEUE_NAME[c.queueId as queueId] ?? "알수없음"}
                  </span>
                  <span className="text-content-secondary text-sm font-medium">
                    {c.gameDurationFormatted}
                  </span>
                </div>

                {/* 챔피언, 룬, 스펠 */}
                <div className="flex shrink-0 items-center justify-center gap-1">
                  <div className="relative inline-flex">
                    <Avatar
                      src={c.championImageUrl}
                      type="champion"
                      size="lg"
                    />
                    <div className="absolute right-0 bottom-0 rounded-full bg-slate-800 px-2 py-1 text-sm text-white">
                      {c.level}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <div className="flex flex-col gap-1">
                      {c.perkImageUrls.map((p, index) => (
                        <Image
                          key={`perkImage ${index}`}
                          src={p}
                          alt="perk Image"
                          width={30}
                          height={30}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      {c.spell1ImageUrl ? (
                        <Image
                          src={c.spell1ImageUrl}
                          alt="spell image"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-7.5 w-7.5 rounded-full" />
                      )}
                      {c.spell2ImageUrl ? (
                        <Image
                          src={c.spell2ImageUrl}
                          alt="spell image"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-7.5 w-7.5 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>

                {/* KDA */}
                <div className="flex shrink-0 flex-col items-center justify-center">
                  <p>
                    {c.kills} /<span className="text-negative">{c.deaths}</span>
                    /{c.assists}
                  </p>
                  <p className="text-content-secondary text-sm font-medium">
                    {c.kda.toFixed(2)}
                  </p>
                </div>

                <span className="text-content-secondary flex shrink-0 items-center justify-center text-sm font-medium">
                  CS {c.cs}
                </span>
              </div>

              {/* 데스크탑: 빌드 */}
              <div className="flex shrink-0 items-center gap-1 max-[960px]:hidden">
                {c.itemImageUrls?.map((item, index) =>
                  item ? (
                    <Image
                      key={`item${index}`}
                      src={item}
                      alt="item image"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div
                      key={`item${index}`}
                      className="h-9 w-9 bg-slate-800"
                    />
                  ),
                )}
              </div>

              {/* 데스크탑: 시작시간 */}
              <div className="flex shrink-0 items-center justify-center gap-10.5 max-[960px]:hidden">
                <span className="text-content-secondary text-sm">
                  {c.gameStartTimeFormatted}
                </span>

                <div
                  className={twMerge(
                    "text-negative bg-negative/10 border-negative inline-flex h-8 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium",
                    c.win && "text-positive border-positive bg-positive/10",
                  )}
                >
                  <span>{c.win ? "승리" : "패배"}</span>
                </div>
              </div>

              <div className="hidden w-full items-center justify-between gap-3 max-[960px]:flex">
                {/* 빌드 */}
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  {c.itemImageUrls?.map((item, index) =>
                    item ? (
                      <Image
                        key={`item${index}`}
                        src={item}
                        alt="item image"
                        width={36}
                        height={36}
                      />
                    ) : (
                      <div
                        key={`item${index}`}
                        className="h-9 w-9 bg-slate-800"
                      />
                    ),
                  )}
                </div>

                {/* 시작시간 + 승패 */}
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-content-secondary text-xs">
                    {c.gameStartTimeFormatted}
                  </span>

                  <div
                    className={twMerge(
                      "text-negative bg-negative/10 border-negative inline-flex h-7 items-center justify-center rounded-xl border px-3 text-xs font-medium",
                      c.win && "text-positive border-positive bg-positive/10",
                    )}
                  >
                    <span>{c.win ? "승리" : "패배"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <BoxButton
              type="button"
              onClick={onClickMore}
              disabled={isFetching}
              text={isFetching ? "불러오는 중..." : "더보기"}
            />
          )}
        </div>
      ) : (
        <p className="text-content-secondary">최근 게임 내역이 없습니다</p>
      )}
    </>
  );
}
