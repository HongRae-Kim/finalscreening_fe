"use client";

import HorizontalCardContainer from "../../common/container/HorizontalCardContainer";
import Avatar from "../../common/Avatar";
import FormModalContainer from "../../common/container/FormModalContainer";
import { FormLabelAndContent } from "../../common/FormLabelAndContent";
import * as Dialog from "@radix-ui/react-dialog";
import { BoxButton } from "../../common/button/BoxButton";
import { Headset } from "lucide-react";
import { twMerge } from "tailwind-merge";
import PositionSet from "./PositionSet";
import { Post } from "@/types/post";
import { GAME_MODE_META, QUEUE_TYPES_LABEL } from "@/types/party";
import { useMenuStore } from "@/stores/menuStore";
import { useRouter } from "next/navigation";
import { deletePost } from "@/services/posts.client";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";

interface FindDetailModalProps {
  postData: Post;
  isLeader: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameAccount: {
    gameNickname: string;
    gameTag: string;
    profileIconUrl: string;
  };
}

export default function FindDetailModal({
  postData,
  isLeader,
  isOpen,
  onOpenChange,
  gameAccount,
}: FindDetailModalProps) {
  const { gameNickname, gameTag, profileIconUrl } = gameAccount;
  const router = useRouter();
  const qc = useQueryClient();

  const { currentGame } = useMenuStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none max-lg:w-[85vw]">
          <FormModalContainer className="text-content-primary w-142 max-md:w-118">
            <Dialog.Title className="mb-7.5 text-2xl font-bold">
              모집글 상세 정보
            </Dialog.Title>

            <Dialog.Description className="sr-only">
              모집글 상세 정보 내용
            </Dialog.Description>

            <div className="flex flex-col gap-7.5">
              <div className="flex items-center gap-7.5">
                <FormLabelAndContent labelText="연동된 게임 아이디">
                  <HorizontalCardContainer className="flex items-center gap-3 px-4 py-2">
                    <Avatar src={profileIconUrl} type="profile" size="sm" />
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">{gameNickname}</span>
                      <span className="text-content-secondary text-sm">
                        #{gameTag}
                      </span>
                    </div>
                  </HorizontalCardContainer>
                </FormLabelAndContent>
                <FormLabelAndContent labelText="마이크" labelFor="micOption">
                  <Headset
                    size={18}
                    strokeWidth={3}
                    className={twMerge(
                      "text-content-secondary",
                      postData.mic && "text-accent",
                    )}
                  />
                </FormLabelAndContent>
              </div>

              <div className="flex gap-7.5">
                <FormLabelAndContent labelText="게임 모드" labelFor="gameMode">
                  <span className="text-sm font-normal">
                    {postData?.gameMode &&
                      GAME_MODE_META[postData?.gameMode].label}
                  </span>
                </FormLabelAndContent>
                <FormLabelAndContent labelText="큐 타입" labelFor="queueType">
                  <span className="text-sm font-normal">
                    {postData?.queueType &&
                      QUEUE_TYPES_LABEL[postData?.queueType]}
                  </span>
                </FormLabelAndContent>
              </div>

              <div className="flex gap-7.5">
                <div className="flex w-full flex-col items-center gap-4">
                  <PositionSet
                    type="my"
                    size="mini"
                    data={postData.myPosition}
                    isActive={true}
                  />
                  <PositionSet
                    type="find"
                    size="mini"
                    data={[...postData.lookingPositions]}
                    isActive={true}
                  />
                </div>

                <FormLabelAndContent
                  labelText="모집 인원"
                  labelFor="recruitCount"
                  className="w-full"
                >
                  <span className="text-sm font-normal">{`${postData.participants.length}/${postData.recruitCount}`}</span>
                </FormLabelAndContent>
              </div>

              <FormLabelAndContent labelText="모집 내용">
                <span className="text-sm font-normal">{postData.memo}</span>
              </FormLabelAndContent>
            </div>
            <div
              className={twMerge(
                "mt-7.5 flex justify-end gap-2",
                isLeader && "justify-between",
              )}
            >
              {isLeader && (
                <div className="space-x-2">
                  <BoxButton
                    text="수정"
                    size="sm"
                    tone="color"
                    onClick={() => {
                      router.push(`/${currentGame}/modify/${postData.postId}`);
                    }}
                  />
                  <BoxButton
                    text="삭제"
                    size="sm"
                    tone="negative"
                    onClick={async () => {
                      setConfirmModalOpen(true);
                    }}
                  />
                  <ConfirmModal
                    open={confirmModalOpen}
                    onOpenChange={setConfirmModalOpen}
                    title="정말 삭제하시겠습니까?"
                    description="삭제하면 다시 복구할 수 없습니다."
                    confirmText="삭제"
                    onConfirm={async () => {
                      await deletePost(postData.postId);
                      onOpenChange(false);
                      await qc.invalidateQueries({
                        queryKey: ["posts"],
                      });

                      router.refresh();
                      router.push(`/${currentGame}/find`);
                    }}
                  />
                </div>
              )}

              <Dialog.Close asChild>
                <BoxButton
                  type="button"
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
