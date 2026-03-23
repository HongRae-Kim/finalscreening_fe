"use client";

import FormModalContainer from "../../common/container/FormModalContainer";
import * as Dialog from "@radix-ui/react-dialog";
import FindCreateForm from "./FindCreateForm";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";
import { GameAccount } from "@/types/game-account";

export default function FindCreateFormContainer({
  type,
  initialPost,
  gameAccountData,
}: {
  type: "create" | "modify";
  initialPost?: Post;
  gameAccountData?: GameAccount[];
}) {
  const router = useRouter();

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-90 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 z-90 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none max-md:w-[85vw]">
          <FormModalContainer className="text-content-primary w-142 max-md:w-118">
            <Dialog.Title className="mb-7.5 text-2xl font-bold">
              모집글 {type === "create" ? "작성" : "수정"}
            </Dialog.Title>
            <FindCreateForm
              initialPost={initialPost}
              type={type}
              gameAccountData={gameAccountData}
            />
            <Dialog.Description className="sr-only">
              모집할 내용을 작성해주세요.
            </Dialog.Description>
          </FormModalContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
