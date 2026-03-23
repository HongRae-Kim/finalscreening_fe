import { EMOJI_SRC_MAP } from "@/types/emoji";
import { Review } from "@/types/review";
import Image from "next/image";
import IntroduceBubble from "../profile/IntroduceBubble";
import formatRelativeTime from "@/utils/formatRelativeTime";
import Avatar from "../common/Avatar";
import { useRouter } from "next/navigation";

export default function ReviewRow({ review }: { review: Review }) {
  const router = useRouter();
  const {
    revieweeId,
    revieweeNickname,
    emoji,
    content,
    createdAt,
    revieweeProfileImage,
  } = review;
  return (
    <div className="border-border-primary grid grid-cols-[44px_1fr] gap-x-3 gap-y-2 border-t px-5 py-3 lg:h-19 lg:grid-cols-[120px_200px_1fr_120px] lg:items-center lg:gap-0 lg:py-0">
      {/* 평가 (Emoji) */}
      <div className="lg:col-auto">
        <Image src={EMOJI_SRC_MAP[emoji]} alt={emoji} width={40} height={40} />
      </div>

      {/* 유저 닉네임 */}
      <div className="flex items-center justify-between lg:justify-start lg:gap-2">
        <div
          className="group flex items-center gap-2 hover:cursor-pointer"
          onClick={() => router.push(`/profile/${revieweeId}`)}
        >
          <Avatar src={revieweeProfileImage ?? ""} size="xs" type="profile" />
          <span className="text-content-primary group-hover:text-accent text-sm">
            {revieweeNickname}
          </span>
        </div>

        <span className="text-content-secondary text-right text-xs lg:hidden">
          {formatRelativeTime(createdAt)}
        </span>
      </div>

      {/* 리뷰 내용 */}
      <div className="col-span-2 lg:col-span-1">
        <IntroduceBubble
          content={content}
          className="line-clamp-2 lg:line-clamp-none lg:truncate"
        />
      </div>

      {/* Time */}
      <span className="text-content-secondary hidden text-right text-sm lg:block">
        {formatRelativeTime(createdAt)}
      </span>
    </div>
  );
}
