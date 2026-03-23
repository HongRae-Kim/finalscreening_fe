"use client";

import { useEffect, useState } from "react";
import MyReviewFilterToggle, {
  MessageDirection,
} from "@/components/review/myprofile/MyReviewFilterToggle";
import { useMenuStore, useMyProfileMenuStore } from "@/stores/menuStore";
import { useGetUserReviewList } from "@/hooks/reviews/useGetUserReviewList";
import LoadingBouncy from "@/components/common/loading/LoadingBouncy";
import useGetReviewDistribution from "@/hooks/reviews/useGetReviewDistribution";
import ReviewList from "@/components/review/myprofile/ReviewList";
import useGetMyWrittenReviews from "@/hooks/reviews/useGetMyWrittenReviews";

export default function MyProfileReviewContainer({
  userId,
}: {
  userId: number;
}) {
  const [status, setStatus] = useState<MessageDirection>("received");
  const { setMenu } = useMenuStore();
  const { setMenu: setProfileMenu } = useMyProfileMenuStore();

  useEffect(() => {
    setMenu("profile");
    setProfileMenu("reviews");
  }, [setMenu, setProfileMenu]);

  const { data: reviewDistributionData, isLoading: distLoading } =
    useGetReviewDistribution(userId);

  const { data: receivedReviewData, isLoading: receivedLoading } =
    useGetUserReviewList(userId);

  const { data: writtenReviewData, isLoading: writtenLoading } =
    useGetMyWrittenReviews();

  const isLoading =
    distLoading || (status === "received" ? receivedLoading : writtenLoading);

  const reviewData =
    status === "received"
      ? (receivedReviewData ?? [])
      : (writtenReviewData ?? []);

  return (
    <div className="max-md:w-110">
      <MyReviewFilterToggle
        value={status}
        onChange={setStatus}
        className="mb-7.5"
      />

      {isLoading ? (
        <LoadingBouncy />
      ) : (
        <ReviewList
          status={status}
          review={reviewData}
          distribution={reviewDistributionData!}
        />
      )}
    </div>
  );
}
