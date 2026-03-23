import { cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text: string;
}
export function BoxButton({
  size,
  tone,
  className,
  text,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ size, tone }), className)}
      {...props}
    >
      {text}
    </button>
  );
}

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-xl font-bold text-white transition overflow-hidden hover:cursor-pointer",

  {
    variants: {
      size: {
        xs: "min-w-13 px-3.5 h-[35px] text-sm",
        sm_long: "min-w-63 px-26 h-10 text-sm",
        sm: "min-w-18 h-10 px-3.5 text-sm",
        md: "min-w-24 h-13 px-4 text-base",
        lg: "min-w-63 h-15 px-10.5 text-lg",
        xl: "min-w-125 h-15 text-lg",
      },
      tone: {
        black: "bg-bg-tertiary hover:bg-bg-tertiary/50",
        color: "bg-accent hover:bg-accent/50",
        positive: "bg-positive hover:bg-positive/50",
        negative: "bg-negative hover:bg-negative/50",
        gradient_positive: "bg-gradient-positive hover:bg-gradient-positive-50",
        gradient_negative: "bg-gradient-negative hover:bg-gradient-negative-50",
      },
    },

    defaultVariants: {
      size: "md",
      tone: "black",
    },
  },
);
