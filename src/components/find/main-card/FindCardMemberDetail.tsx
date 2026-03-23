import FindCardContainer from "../../common/container/FindCardContainer";
import FindMemberCard from "@/components/find/main-card/FindMemberCard";
import { PostPartyMemberDetail } from "@/types/party";

export default function FindCardMemberDetail({
  isLeader,
  currentCount,
  maxCount,
  partyMembersData,
  postId,
  partyId,
}: {
  isLeader: boolean;
  currentCount: number;
  maxCount: number;
  partyMembersData: PostPartyMemberDetail[];
  postId: number;
  partyId: number;
}) {
  return (
    <FindCardContainer className="flex flex-col gap-5 border-t-0">
      <div className="flex flex-col">
        <h3 className="text-content-primary flex w-full items-center justify-between text-xl font-bold">
          인원 정보
          <span>{`${currentCount}/${maxCount}`}</span>
        </h3>
      </div>
      {partyMembersData.map((p, i) => (
        <FindMemberCard
          key={`member${i}`}
          type="default"
          PartyMemberData={p}
          isLeader={isLeader}
          postId={postId}
          partyId={partyId}
          currentCount={currentCount}
          maxCount={maxCount}
        />
      ))}
    </FindCardContainer>
  );
}
