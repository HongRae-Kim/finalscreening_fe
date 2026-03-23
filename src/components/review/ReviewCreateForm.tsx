"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Avatar from "../common/Avatar";
import { BoxButton } from "../common/button/BoxButton";
import { EmojiRadioGroup } from "../common/button/EmojiButton";
import { FormLabelAndContent } from "../common/FormLabelAndContent";
import { Controller, useForm } from "react-hook-form";
import { EmojiType } from "@/types/emoji";
import { PostPartyDetail } from "@/types/party";
import ClientApi from "@/lib/clientApi";
import { useReviewStore } from "@/stores/reviewStore";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";

type FormValues = {
  emoji: EmojiType;
  initialPost?: PostPartyDetail;
  content: string;
};

export default function ReviewCreateForm({
  type,
  currentUserId,
}: {
  type: "create" | "modify";
  currentUserId: number;
}) {
  const router = useRouter();

  const { partyId } = useParams();
  const { reviewId } = useParams();
  const revieweeId = useSearchParams().get("revieweeId");

  const qc = useQueryClient();

  const { initialData } = useReviewStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      emoji: initialData.emoji ?? "GOOD",
      content: initialData.content ?? "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      partyId: partyId,
      revieweeId: revieweeId,
      emoji: values.emoji,
      content: values.content ?? "",
    };

    let res: Response;

    if (type === "create") {
      res = await ClientApi("/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast.error("리뷰 등록에 실패했습니다.");

        if (res.status === 401) {
          router.push("find");
          router.refresh();
          return;
        }

        return;
      }

      await qc.invalidateQueries({
        queryKey: ["ReviewDistribution"],
      });

      await qc.invalidateQueries({
        queryKey: ["receivedReviews"],
      });

      await qc.invalidateQueries({
        queryKey: ["writtenReviews"],
      });

      showToast.success("리뷰가 등록되었습니다.");

      router.refresh();
      router.push(`/myprofile/find-history`);
    } else {
      res = await ClientApi(`/api/v1/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast.error("리뷰 수정에 실패했습니다.");

        if (res.status === 401) {
          router.push("/myprofile/find-history");
          router.refresh();
          return;
        }

        return;
      }

      showToast.success("리뷰가 수정되었습니다.");

      router.refresh();

      await qc.invalidateQueries({
        queryKey: ["writtenReviews"],
      });

      router.push(`/myprofile/reviews`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7.5">
      <div className="flex flex-col justify-center gap-7.5 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Avatar type="profile" src={initialData.profileImage} size="sm" />
          <span>{initialData.nickName}</span>
        </div>
        <p className="text-content-secondary text-center">
          함께한 파티원에 대한 평가를 선택해주세요
        </p>
        <div className="flex items-center justify-center">
          <Controller
            control={control}
            name="emoji"
            rules={{ required: true }}
            render={({ field }) => (
              <EmojiRadioGroup
                value={field.value}
                onChange={field.onChange}
                size="lg"
              />
            )}
          />
        </div>

        <FormLabelAndContent labelText="리뷰 내용 (선택)" className="w-full">
          <textarea
            {...register("content")}
            placeholder="리뷰 내용을 작성해주세요"
            className="bg-bg-primary border-border-primary text-content-primary placeholder:text-content-tertiary resize-none rounded-lg border p-4 outline-0"
          />
        </FormLabelAndContent>
        <div className="flex justify-end gap-2">
          <BoxButton
            type="submit"
            size="sm"
            tone="color"
            text={type === "create" ? "작성" : "수정"}
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
      </div>
    </form>
  );
}
