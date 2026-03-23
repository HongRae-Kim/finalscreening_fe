"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export type MessageDirection = "sent" | "received";

const segmentBtn = cva(
  "inline-flex items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 select-none font-semibold cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-9 px-5 text-sm",
        md: "h-11 px-8 text-sm",
        lg: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

type SegmentBtnVariants = VariantProps<typeof segmentBtn>;

interface ToggleBtnProps extends SegmentBtnVariants {
  value: MessageDirection; // 현재 선택된 상태
  onChange: (next: MessageDirection) => void; // 상태 변경 콜백
  className?: string; // 래퍼 div에 줄 className (선택)
}

export default function MyReviewFilterToggle({
  value,
  onChange,
  size = "sm",
  className,
}: ToggleBtnProps) {
  const isSent = value === "sent";
  const isReceived = value === "received";

  return (
    <div className={twMerge("inline-flex gap-3", className)}>
      <TogglePrimitive.Root
        // pressed는 현재 value 기준으로만 제어 (Radix 내부 상태에 의존 X)
        pressed={isReceived}
        onPressedChange={() => onChange("received")}
        className={twMerge(
          segmentBtn({ size }),
          isReceived
            ? // 선택된 상태 (이미지에서 왼쪽 버튼)
              "bg-accent/10 border-accent/50 text-accent hover:border-border-primary"
            : // 비선택 상태
              "bg-bg-primary text-content-secondary border-border-primary hover:bg-bg-tertiary hover:border-border-primary",
        )}
      >
        받은 리뷰
      </TogglePrimitive.Root>

      <TogglePrimitive.Root
        pressed={isSent}
        onPressedChange={() => onChange("sent")}
        className={twMerge(
          segmentBtn({ size }),
          isSent
            ? // 선택된 상태 (이미지에서 오른쪽이 활성일 때)
              "bg-accent/10 border-accent/50 text-accent hover:border-border-primary"
            : // 비선택 상태
              "bg-bg-primary text-content-secondary border-border-primary hover:bg-bg-tertiary hover:border-border-primary",
        )}
      >
        작성한 리뷰
      </TogglePrimitive.Root>
    </div>
  );
}
