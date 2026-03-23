import { Review, ReviewDistribution } from "@/types/review";
import ReviewCard from "./ReviewCard";
import ReviewPercent from "../ReviewPercent";
import { MessageDirection } from "./MyReviewFilterToggle";
import { twMerge } from "tailwind-merge";

export default function ReviewList({
  status,
  review,
  distribution,
}: {
  status: MessageDirection;
  review: Review[] | null;
  distribution: ReviewDistribution;
}) {
  return (
    <>
      {status === "received" && review && review.length !== 0 && (
        <ReviewPercent type="default" distributionData={distribution} />
      )}
      {review && review.length !== 0 ? (
        <div
          className={twMerge(
            "flex flex-col items-center justify-center gap-7.5",
            status === "received" && "mt-13.5",
          )}
        >
          <span className="text-content-secondary text-base">
            총 {review.length}개의 리뷰
          </span>
          <div className="w-full space-y-2">
            {review.map((r, index) => (
              <ReviewCard
                key={`${status} review${index}`}
                mode={status}
                gameName="lol"
                communityName={
                  status === "received"
                    ? r.reviewerNickname
                    : r.revieweeNickname
                }
                content={r.content}
                emotion={r.emoji}
                createdAt={r.createdAt}
                profileImageURL={r.revieweeProfileImage ?? ""}
                reviewId={r.reviewId}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-content-secondary mt-13.5 text-center">
          {status === "sent" ? "작성한 " : "받은 "}리뷰 데이터가 없습니다
        </p>
      )}
    </>
  );
}
