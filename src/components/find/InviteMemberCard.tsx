import Avatar from "../common/Avatar";
import HorizontalCardContainer from "../common/container/HorizontalCardContainer";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useInviteStore } from "@/stores/inviteStore";
import React from "react";
import { Candidate } from "@/types/party";

function InviteMemberCard({ data }: { data: Candidate }) {
  const isChecked = useInviteStore((s) =>
    s.selectedMemberIds.includes(data.userId),
  );
  const toggleSelectMember = useInviteStore((s) => s.toggleSelectMember);

  return (
    <label htmlFor={`user${data.userId}`}>
      <input
        type="checkbox"
        name="user"
        id={`user${data.userId}`}
        value={data.userId}
        checked={isChecked}
        onChange={() => toggleSelectMember(data.userId)}
        className="sr-only"
      />
      <HorizontalCardContainer className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar type="profile" src="" size="sm" />
          <div className="flex items-center gap-1">
            <span className="text-base font-bold">{data.nickname}</span>
            <span className="text-content-secondary text-xs">·</span>
            {/* 채팅 구현 후 수정
             <span className="text-content-secondary text-xs">
              {formatRelativeTime(data.lastUpdatedAt)} 대화
            </span> */}
          </div>
        </div>
        <div
          className={twMerge(
            "bg-bg-secondary border-border-primary flex h-5 w-5 items-center justify-center rounded-full border",
            isChecked && "bg-accent border-0",
          )}
        >
          {isChecked && (
            <Check size={12} strokeWidth={3} className="text-white" />
          )}
        </div>
      </HorizontalCardContainer>
    </label>
  );
}

export default React.memo(InviteMemberCard);
