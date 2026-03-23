"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import FormModalContainer from "../common/container/FormModalContainer";
import ReviewCreateForm from "./ReviewCreateForm";

export default function ReviewCreateFormContainer({
  type,
  currentUserId,
}: {
  type: "create" | "modify";
  currentUserId?: number;
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
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none max-md:w-[90vw]">
          <FormModalContainer className="text-content-primary w-142 max-md:w-113">
            <Dialog.Title className="mb-7.5 text-2xl font-bold">
              리뷰 {type === "create" ? "작성" : "수정"}
            </Dialog.Title>
            <ReviewCreateForm type={type} currentUserId={currentUserId!} />
            <Dialog.Description className="sr-only">
              유저에 대한 리뷰 내용을 작성해주세요.
            </Dialog.Description>
          </FormModalContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
