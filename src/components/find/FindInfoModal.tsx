"use client";

import { PostStatus } from "@/types/post";
import FindCardContainer from "../common/container/FindCardContainer";
import StateBadge from "../common/StateBadge";
import { BoxButton } from "../common/button/BoxButton";
import FindLinkButton from "./FindLinkButton";
import {
  closeParty,
  getPartyMembers,
  leaveParty,
} from "@/services/party.client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingBouncy from "../common/loading/LoadingBouncy";
import FindMemberCard from "./main-card/FindMemberCard";
import { useMyParties } from "@/hooks/useMyParties";
import { Unlink } from "lucide-react";
import { QUEUE_TYPES_LABEL } from "@/types/party";
import { MyProfile } from "@/types/profile";

export default function FindInfoModal({
  currentUserData,
}: {
  currentUserData: MyProfile | null;
}) {
  const qc = useQueryClient();

  const { data, isLoading, error, refetch } = useMyParties(currentUserData?.id);

  const currentPartyData =
    data?.data.parties.filter(
      (party) => party.status === "RECRUIT" || party.status === "ACTIVE",
    )[0] ?? null;

  const currentPartyId = currentPartyData?.partyId;

  const postId = currentPartyData?.postId;

  const {
    data: partyMembersResponse,
    isLoading: partyMembersLoading,
    error: partyMembersError,
    refetch: partyMembersRefetch,
  } = useQuery({
    queryKey: [currentPartyId, "PartyMembers"],
    queryFn: () => getPartyMembers(currentPartyId ?? null),
    enabled: !!currentPartyId,
  });

  const partyMembersData = partyMembersResponse?.data;

  return (
    <FindCardContainer className="flex h-123 w-110 flex-col items-center justify-between p-7.5">
      {!currentPartyData ? (
        <div className="flex h-full flex-col items-center justify-center gap-8">
          <Unlink size={100} className="text-bg-tertiary" />
          <p className="text-content-secondary text-lg font-bold">
            참여중인 파티가 없습니다
          </p>
        </div>
      ) : isLoading && partyMembersLoading ? (
        <div className="flex h-full items-center">
          <LoadingBouncy />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xl">
                <h5 className="text-content-primary flex items-center gap-2 font-bold">
                  모집 정보
                  {currentPartyData?.myRole === "LEADER" && (
                    <StateBadge
                      state={currentPartyData.status as PostStatus}
                      className="px-3 py-1.5"
                    />
                  )}
                </h5>
                <span className="font-semibold">{`${partyMembersData?.currentCount}/${partyMembersData?.maxCount}`}</span>
              </div>
              <FindLinkButton
                gameMode={QUEUE_TYPES_LABEL[currentPartyData.queueType] ?? ""}
                postTitle={currentPartyData?.postTitle ?? ""}
              />
            </div>

            {Array.from({ length: partyMembersData?.maxCount ?? 0 }).map(
              (_, i) => (
                <FindMemberCard
                  type="modal"
                  key={`member${i}`}
                  postId={postId!}
                  partyId={currentPartyId!}
                  PartyMemberData={partyMembersData?.members[i] ?? null}
                  isLeader={currentPartyData?.myRole === "LEADER"}
                  currentCount={partyMembersData?.currentCount!}
                  maxCount={partyMembersData?.maxCount!}
                />
              ),
            )}
          </div>
          <BoxButton
            size="sm_long"
            tone="gradient_negative"
            text={
              currentPartyData?.myRole === "LEADER"
                ? "파티 종료"
                : "파티 나가기"
            }
            onClick={async () => {
              if (currentPartyData?.myRole === "LEADER") {
                await closeParty(currentPartyData?.partyId!);
              } else {
                await leaveParty(currentPartyData?.partyId!);
              }
              await qc.invalidateQueries({
                queryKey: ["me", "parties"],
              });
              await qc.invalidateQueries({
                queryKey: ["posts"],
              });
            }}
          />
        </>
      )}
    </FindCardContainer>
  );
}
