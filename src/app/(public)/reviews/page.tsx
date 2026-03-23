"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import Dropdown from "@/components/common/Dropdown";
import { useEffect, useMemo, useState } from "react";
import { useMenuStore } from "@/stores/menuStore";
import useGetAllReviews from "@/hooks/reviews/useGetAllReviews";
import LoadingBouncy from "@/components/common/loading/LoadingBouncy";
import ReviewRow from "@/components/review/ReviewRow";
import Link from "next/link";

const items = [
  { value: "ALL", label: "리뷰 전체" },
  { value: "GOOD", label: "좋아요" },
  { value: "NORMAL", label: "보통" },
  { value: "BAD", label: "싫어요" },
];

type ReviewFilter = "ALL" | "GOOD" | "NORMAL" | "BAD";

export default function ReviewsPage() {
  const { setMenu } = useMenuStore();

  const [reviewType, setReviewType] = useState<ReviewFilter>("ALL");

  const {
    data: reviewData,
    isLoading,
    isFetching,
    isPending,
  } = useGetAllReviews();

  useEffect(() => {
    setMenu("reviews");
  }, []);

  const filteredReviews = useMemo(() => {
    if (!reviewData) return [];
    if (reviewType === "ALL") return reviewData;
    return reviewData.filter((r) => r.emoji === reviewType);
  }, [reviewData, reviewType]);

  if (!reviewData || isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingBouncy />
      </div>
    );

  return (
    <section className="mt-17.5 flex h-full w-full flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <Dropdown
          placeholder="리뷰 전체"
          items={items}
          value={reviewType}
          onValueChange={(v) => setReviewType(v as ReviewFilter)}
          name="reviewType"
          className="w-50 rounded-xl"
        />
        <div className="flex w-[390px] items-center gap-4 max-md:justify-end">
          <p className="text-content-secondary text-sm max-md:hidden">
            최근 함께한 유저에게 리뷰를 남기려면
          </p>
          <div className="h-px flex-1 bg-slate-500 max-md:hidden" />
          <Link href="/myprofile/find-history">
            <BoxButton
              tone="gradient_positive"
              text="리뷰 작성하러 가기"
              className="h-10 w-34 text-sm font-semibold"
            />
          </Link>
        </div>
      </div>
      {isLoading || isPending ? (
        <div className="flex h-full items-center justify-center">
          <LoadingBouncy />
        </div>
      ) : (
        <div className="border-border-primary mt-8 w-full overflow-hidden rounded-xl border text-base">
          {/* Header */}
          <div className="text-content-secondary bg-bg-primary hidden h-13 grid-cols-[120px_200px_1fr_120px] items-center px-5 lg:grid">
            <span>평가</span>
            <span>유저 닉네임</span>
            <span>리뷰 내용</span>
            <span className="text-right">등록시간</span>
          </div>

          {/* Body */}
          <div>
            {filteredReviews && filteredReviews.length ? (
              filteredReviews.map((review, index) => (
                <ReviewRow key={index} review={review} />
              ))
            ) : (
              <div className="border-border-primary flex h-19 items-center justify-center border-t px-5 text-sm">
                <span className="text-content-secondary">
                  리뷰 데이터가 없습니다
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
