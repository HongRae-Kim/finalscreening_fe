"use client";

import { BoxButton } from "../common/button/BoxButton";
import FormModalContainer from "../common/container/FormModalContainer";
import * as Dialog from "@radix-ui/react-dialog";
import InviteMemberCard from "./InviteMemberCard";
import { useInviteStore } from "@/stores/inviteStore";
import { getCandidates, inviteMember } from "@/services/party.client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function InviteMemberModal({
  postId,
  partyId,
  currentCount,
  maxCount,
}: {
  postId: number;
  partyId: number;
  currentCount: number;
  maxCount: number;
}) {
  const router = useRouter();
  const { isInviteOpen, setInviteOpen, selectedMemberIds } = useInviteStore();
  const qc = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [postId, "candidates"],
    queryFn: () => getCandidates(postId),
  });

  const candidates = data?.data ?? [];

  return (
    <Dialog.Root open={isInviteOpen} onOpenChange={setInviteOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none">
          <FormModalContainer className="flex flex-col gap-7.5">
            <Dialog.Title className="text-2xl font-bold">
              멤버 초대
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              파티에 초대할 멤버를 선택하세요.
            </Dialog.Description>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">초대할 멤버</legend>
              {candidates.length === 0 ? (
                <div className="m-auto flex w-full flex-col items-center justify-center gap-7">
                  <UserX size={120} className="text-bg-tertiary" />
                  <p className="text-content-secondary text-xl font-bold">
                    아직 참여를 희망하는 유저가 없습니다
                  </p>
                </div>
              ) : (
                candidates.map((c, index) => (
                  <InviteMemberCard key={`${postId}-${index}`} data={c} />
                ))
              )}
            </fieldset>
            <div className="mt-[25px] flex justify-end gap-2">
              {candidates.length !== 0 && (
                <BoxButton
                  text="초대"
                  size="sm"
                  tone="color"
                  onClick={async () => {
                    if (!selectedMemberIds || selectedMemberIds.length === 0) {
                      showToast.error("초대할 멤버를 선택해주세요.");
                      return;
                    }

                    if (selectedMemberIds.length > maxCount - currentCount) {
                      showToast.error("초대할 인원이 남은 인원보다 많습니다.");
                      return;
                    }

                    await inviteMember({
                      partyId: partyId,
                      targetUserIds: selectedMemberIds,
                    });

                    await qc.invalidateQueries({
                      queryKey: [postId, "candidates"],
                    });
                    await qc.invalidateQueries({
                      queryKey: [postId, "PartyMembers"],
                    });
                    await qc.invalidateQueries({
                      queryKey: [postId, "party"],
                    });
                    await qc.invalidateQueries({
                      queryKey: [postId, "posts"],
                    });

                    router.refresh();
                  }}
                />
              )}
              <Dialog.Close asChild>
                <BoxButton
                  text="닫기"
                  size="sm"
                  tone="black"
                  aria-label="Close"
                />
              </Dialog.Close>
            </div>
          </FormModalContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
