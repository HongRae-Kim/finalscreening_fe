// 원형 버튼 컴포넌트

"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import React from "react";

const circleBtn = cva(
  "inline-flex items-center justify-center rounded-full cursor-pointer bg-bg-tertiary text-content-main transition-all duration-150 active:scale-95",
  {
    variants: {
      size: {
        xs: "size-7.5",
        sm: "size-10",
        md: "size-12.5",
        lg: "size-17",
        xl: "size-25.5",
        xxl: "size-32.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type CircleBtnVariants = VariantProps<typeof circleBtn>;

interface CircleBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CircleBtnVariants {
  children: React.ReactNode;
}

export default function CircleBtn({
  size = "md",
  className,
  children,
  ...props
}: CircleBtnProps) {
  return (
    <button {...props} className={twMerge(circleBtn({ size }), className)}>
      {children}
    </button>
  );
}

/* 사용법 예시
  <CircleBtn size="lg">
    <svg width="24" height="24">...</svg>
  </CircleBtn>
*/
