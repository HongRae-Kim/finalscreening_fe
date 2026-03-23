"use client";

import { CircleAlert } from "lucide-react";
import TextInput from "@/components/common/TextInput";
import Dropdown from "@/components/common/Dropdown";
import { BoxButton } from "@/components/common/button/BoxButton";
import FormModalContainer from "../../common/container/FormModalContainer";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LinkGameAccount,
  ModifyGameAccount,
} from "@/services/game-account/link.client";
import { Controller, useForm } from "react-hook-form";
import AuthErrorMsg from "@/components/auth/AuthErrorMsg";
import { useRouter } from "next/navigation";
import { GameAccount } from "@/types/game-account";
import { useEffect } from "react";
import { gameAccountRefreshAll } from "@/services/game-account/data.client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";

const items = [{ value: "LEAGUE_OF_LEGENDS", label: "리그 오브 레전드" }];

type FormValues = {
  gameType: string;
  gameNickname: string;
  gameTag: string;
};

export default function LinkGameIdFormModal({
  isOpen,
  onOpenChange,
  mode,
  initialData,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "link" | "modify";
  initialData?: GameAccount;
}) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  const refreshAllMutation = useMutation({
    mutationFn: ({
      gameAccountId,
      matchCount,
    }: {
      gameAccountId: number;
      matchCount?: number;
    }) => gameAccountRefreshAll({ gameAccountId, matchCount }),
  });

  const onSubmit = async (data: FormValues) => {
    const normalizedTag = data.gameTag.replace(/^#/, "").trim();

    const payload = {
      gameType: data.gameType,
      gameNickname: data.gameNickname.trim(),
      gameTag: normalizedTag,
    };

    if (mode === "link") {
      const { ok, data: linked } = await LinkGameAccount(payload);

      if (!ok || !linked) return;

      const refreshed = await gameAccountRefreshAll({
        gameAccountId: linked.gameAccountId,
        matchCount: 100,
      });

      if (!refreshed) return;

      showToast.success("게임 아이디 연동이 완료되었습니다.");
    } else if (initialData) {
      if (initialData.updatedAt) {
        const updatedAt = new Date(initialData.updatedAt);
        const threeMonthsLater = new Date(updatedAt);

        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        if (new Date() < threeMonthsLater) {
          showToast.error("연동된 계정은 3개월 단위로 변경할 수 있습니다.");
          return;
        }
      }
      await ModifyGameAccount(String(initialData.gameAccountId), payload);

      refreshAllMutation.mutate({
        gameAccountId: initialData.gameAccountId,
        matchCount: 100,
      });
    } else showToast.error("수정할 계정을 찾을 수 없습니다.");

    reset();
    onOpenChange(false);
    router.replace("/myprofile/link");
  };

  useEffect(() => {
    if (!isOpen) return;

    reset({
      gameType: initialData?.gameType ?? items[0].value,
      gameNickname: initialData?.gameNickname ?? "",
      gameTag: initialData?.gameTag ?? "",
    });
  }, [isOpen, initialData, reset]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-90 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 z-90 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none">
          <FormModalContainer className="flex flex-col gap-7.5">
            <Dialog.Title className="text-2xl font-bold">
              게임 아이디 연동
            </Dialog.Title>

            <Dialog.Description className="sr-only">
              연동할 게임을 선택하고 닉네임, 태그를 입력해주세요.
            </Dialog.Description>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="[&>div>label]:text-content-secondary space-y-3 [&>.gameIdFormRow]:flex [&>.gameIdFormRow]:flex-col [&>.gameIdFormRow]:gap-2 [&>div>label]:text-sm"
            >
              <div className="gameIdFormRow">
                <label htmlFor="gameType">게임 종류</label>
                <Controller
                  name="gameType"
                  control={control}
                  rules={{ required: "게임 종류를 선택해주세요." }}
                  render={({ field }) => (
                    <Dropdown
                      placeholder="연동할 게임 종류를 선택해주세요"
                      items={
                        items as unknown as { value: string; label: string }[]
                      }
                      name={field.name}
                      className="w-full"
                      value={field.value}
                      onValueChange={(value: string) => field.onChange(value)}
                    />
                  )}
                />
                {errors.gameType?.message && (
                  <AuthErrorMsg message={errors.gameType?.message} />
                )}
              </div>

              <div className="gameIdFormRow">
                <label htmlFor="gameNickname">닉네임</label>
                <TextInput
                  id="gameNickname"
                  placeholder="닉네임"
                  className="h-10 text-sm"
                  {...register("gameNickname", {
                    required: "닉네임을 입력해주세요.",
                    validate: (value) =>
                      value.replace(/\s/g, "").length > 0 ||
                      "공백만 입력할 수는 없습니다.",
                    minLength: {
                      value: 2,
                      message: "닉네임은 2자 이상이어야 합니다.",
                    },
                  })}
                />
                {errors.gameNickname?.message && (
                  <AuthErrorMsg message={errors.gameNickname?.message} />
                )}
              </div>

              <div className="gameIdFormRow">
                <label htmlFor="gameTag">태그</label>
                <TextInput
                  id="gameTag"
                  placeholder="#을 뺀 태그명을 입력해주세요"
                  className="h-10 text-sm"
                  {...register("gameTag", {
                    required: "태그를 입력해주세요.",
                    validate: (value) =>
                      value.replace(/\s/g, "").length > 0 ||
                      "공백만 입력할 수는 없습니다.",
                    pattern: {
                      value: /^[A-Za-z0-9가-힣 ]+$/,
                      message: "태그는 문자/숫자만 입력할 수 있습니다.",
                    },
                  })}
                />
                {errors.gameTag?.message && (
                  <AuthErrorMsg message={errors.gameTag?.message} />
                )}
              </div>

              <div className="text-negative flex items-center gap-1 text-base max-md:text-sm">
                <CircleAlert className="size-4.5 max-md:size-4" />
                <p>
                  타인의 아이디를 도용하는 경우 서비스 이용이 제한될 수 있습니다
                </p>
              </div>

              <div className="mt-7.5 flex justify-end gap-2">
                <BoxButton
                  text={isSubmitting ? "연동 중..." : "연동"}
                  size="sm"
                  tone="color"
                  disabled={isSubmitting}
                />

                <Dialog.Close asChild>
                  <BoxButton
                    text="닫기"
                    size="sm"
                    tone="black"
                    aria-label="Close"
                    disabled={isSubmitting}
                  />
                </Dialog.Close>
              </div>
            </form>
          </FormModalContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
