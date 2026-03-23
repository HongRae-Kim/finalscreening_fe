"use client";

import * as Switch from "@radix-ui/react-switch";
import Dropdown from "../../common/Dropdown";
import HorizontalCardContainer from "../../common/container/HorizontalCardContainer";
import Avatar from "../../common/Avatar";

import { FormLabelAndContent } from "../../common/FormLabelAndContent";

import TextInput from "../../common/TextInput";
import { BoxButton } from "../../common/button/BoxButton";
import FindPositionCheckList from "./FindPositionCheckList";
import {
  GAME_MODE_IDS,
  GAME_MODE_META,
  GameMode,
  QUEUE_TYPES,
  QUEUE_TYPES_LABEL,
  QueueType,
  RECRUIT_COUNT_OPTIONS,
} from "@/types/party";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { Position } from "@/types/position";
import { useEffect } from "react";
import AuthErrorMsg from "../../auth/AuthErrorMsg";
import { useRouter } from "next/navigation";
import ClientApi from "@/lib/clientApi";
import { useMenuStore } from "@/stores/menuStore";
import { Post } from "@/types/post";
import { GameAccount } from "@/types/game-account";
import { showToast } from "@/lib/toast";

type PostCreateForm = {
  gameMode: GameMode;
  queueType: QueueType;
  mic: boolean;
  recruitCount: string;
  myPosition: Position;
  lookingPositions: Position[];
  memo: string;
};

export default function FindCreateForm({
  initialPost,
  type,
  gameAccountData,
}: {
  initialPost?: Post;
  type: "create" | "modify";
  gameAccountData?: GameAccount[];
}) {
  const router = useRouter();
  const { currentGame } = useMenuStore();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PostCreateForm>({
    defaultValues: {
      gameMode: initialPost ? initialPost?.gameMode : "SUMMONERS_RIFT",
      queueType: initialPost?.queueType ?? "DUO",
      mic: initialPost?.mic ?? false,
      recruitCount: String(initialPost?.recruitCount) ?? "1",
      myPosition: initialPost?.myPosition ?? "ANY",
      lookingPositions: initialPost?.lookingPositions ?? ["ANY"],
      memo: initialPost?.memo ?? "",
    },
    mode: "onChange",
  });
  const queueType = watch("queueType");
  const recruitCount = watch("recruitCount");

  useEffect(() => {
    const allowed = RECRUIT_COUNT_OPTIONS[queueType].map(String);
    const current = recruitCount;

    if (!allowed.includes(current)) {
      setValue("recruitCount", allowed[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (!gameAccountData || !gameAccountData.length) {
      showToast.error("게임 계정 연동이 필요한 기능입니다.");
      router.back();
      return;
    }
  }, [queueType, setValue]);

  const onSubmit = async (data: PostCreateForm) => {
    const payload = {
      gameMode: data.gameMode,
      queueType: data.queueType,
      myPosition: data.myPosition,
      lookingPositions: data.lookingPositions,
      mic: data.mic,
      recruitCount: Number(data.recruitCount),
      memo: data.memo,
    };

    let res: Response;

    if (type === "create") {
      res = await ClientApi("/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast.error("게시글 작성에 실패했습니다.");

        if (res.status === 401) {
          router.push("find");
          router.refresh();
          return;
        }

        return;
      }

      showToast.success("게시글이 작성되었습니다.");
    } else {
      if (!initialPost) {
        showToast.error("수정할 글이 없습니다.");
        return;
      }

      if (initialPost.currentParticipants > payload.recruitCount) {
        showToast.error(
          "현재 참여 인원보다 모집 인원을 적게 설정할 수 없습니다.",
        );
        return;
      }

      res = await ClientApi(`/api/v1/posts/${initialPost?.postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast.error("게시글 수정에 실패했습니다.");

        if (res.status === 401) {
          router.push("find");
          router.refresh();
          return;
        }

        return;
      }

      showToast.success("게시글이 수정되었습니다.");
    }

    router.push(`/${currentGame}/find`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7.5">
      <div className="flex items-center gap-6.5">
        <FormLabelAndContent labelText="연동된 게임 아이디">
          <HorizontalCardContainer className="flex items-center gap-3 px-4 py-2">
            <Avatar
              src={gameAccountData![0].profileIconUrl}
              type="profile"
              size="sm"
            />
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">
                {gameAccountData![0].gameNickname}
              </span>
              <span className="text-content-secondary text-sm">
                {" "}
                {gameAccountData![0].gameTag}
              </span>
            </div>
          </HorizontalCardContainer>
        </FormLabelAndContent>
        <FormLabelAndContent labelText="마이크" labelFor="micOption">
          <Controller
            control={control}
            name="mic"
            render={({ field }) => (
              <Switch.Root
                id="micOption"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="bg-bg-primary data-[state=checked]:bg-accent border-border-primary relative h-8 w-14 cursor-pointer rounded-full border outline-none"
              >
                <Switch.Thumb className="block size-6 translate-x-1 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-7" />
              </Switch.Root>
            )}
          />
        </FormLabelAndContent>
      </div>

      <div className="flex gap-6.5">
        <FormLabelAndContent labelText="게임 모드" labelFor="gameMode">
          <Controller
            control={control}
            name="gameMode"
            rules={{ required: "게임 모드를 선택해주세요." }}
            render={({ field }) => (
              <Dropdown
                name="gameMode"
                placeholder="게임 모드를 선택해주세요"
                value={field.value}
                onValueChange={field.onChange}
                items={GAME_MODE_IDS.map((id) => ({
                  value: id,
                  label: (
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={GAME_MODE_META[id].icon}
                        alt=""
                        width={20}
                        className="object-cover"
                      />
                      <span>{GAME_MODE_META[id].label}</span>
                    </div>
                  ),
                }))}
                className="w-48.5"
              />
            )}
          />
          {errors.gameMode && (
            <AuthErrorMsg
              message={String(errors.gameMode.message)}
              className="ml-0 text-xs"
            />
          )}
        </FormLabelAndContent>
        <FormLabelAndContent labelText="큐 타입" labelFor="queueType">
          <Controller
            control={control}
            name="queueType"
            rules={{ required: "큐 타입을 선택해주세요." }}
            render={({ field }) => (
              <Dropdown
                name="queueType"
                placeholder="큐 타입을 선택해주세요"
                value={field.value}
                onValueChange={field.onChange}
                items={QUEUE_TYPES.map((t) => ({
                  value: t,
                  label: QUEUE_TYPES_LABEL[t],
                }))}
                className="w-48"
              />
            )}
          />
          {errors.queueType && (
            <AuthErrorMsg
              message={String(errors.queueType.message)}
              className="ml-0 text-xs"
            />
          )}
        </FormLabelAndContent>
      </div>

      <div className="flex gap-8">
        <div className="flex w-full flex-col gap-4">
          <FormLabelAndContent labelText="주 포지션">
            <Controller
              control={control}
              name="myPosition"
              rules={{ required: "주 포지션을 선택해주세요." }}
              render={({ field }) => (
                <FindPositionCheckList
                  type="my"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.myPosition && (
              <AuthErrorMsg
                message={String(errors.myPosition.message)}
                className="ml-0 text-xs"
              />
            )}
          </FormLabelAndContent>
          <FormLabelAndContent labelText="찾는 포지션">
            <Controller
              control={control}
              name="lookingPositions"
              render={({ field }) => (
                <FindPositionCheckList
                  type="find"
                  value={field.value}
                  onChange={(next) => {
                    clearErrors("lookingPositions");
                    field.onChange(next);
                  }}
                  onLimitExceeded={(msg) => {
                    setError("lookingPositions", {
                      type: "manual",
                      message: msg,
                    });
                  }}
                />
              )}
            />
            {errors.lookingPositions && (
              <AuthErrorMsg
                message={String(errors.lookingPositions.message)}
                className="ml-0 text-xs"
              />
            )}
          </FormLabelAndContent>
        </div>

        <FormLabelAndContent
          labelText="모집 인원"
          labelFor="recruitCount"
          className="w-full"
        >
          <Controller
            control={control}
            name="recruitCount"
            render={({ field }) => (
              <Dropdown
                key={`${queueType}-${field.value}`}
                name="recruitCount"
                placeholder="모집 인원을 선택해주세요"
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v)}
                items={RECRUIT_COUNT_OPTIONS[queueType].map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                className="w-47"
              />
            )}
          />
          {errors.recruitCount && (
            <AuthErrorMsg
              message={String(errors.recruitCount.message)}
              className="ml-0 text-xs"
            />
          )}
        </FormLabelAndContent>
      </div>

      <FormLabelAndContent labelText="모집 내용">
        <TextInput
          placeholder="모집 내용을 작성해주세요"
          className="h-10 text-sm"
          {...register("memo", {
            required: "모집 내용을 입력해주세요.",
            validate: (value) =>
              value.trim().length > 0 || "모집 내용을 입력해주세요.",
            maxLength: {
              value: 100,
              message: "모집 내용은 최대 100자까지 작성할 수 있어요.",
            },
          })}
        />
        {errors.memo && (
          <AuthErrorMsg
            message={String(errors.memo.message)}
            className="ml-0 text-xs"
          />
        )}
      </FormLabelAndContent>

      <div className="flex justify-end gap-2">
        <BoxButton
          type="submit"
          text={isSubmitting ? "작성중..." : "작성"}
          size="sm"
          tone="color"
          disabled={isSubmitting}
        />

        <BoxButton
          type="button"
          text="닫기"
          size="sm"
          tone="black"
          aria-label="Close"
          onClick={() => router.back()}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
