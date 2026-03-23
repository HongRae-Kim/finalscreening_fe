import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const introduceBubble = cva(
  "bg-bg-tertiary text-content-primary inline-flex items-center px-5 py-3 rounded-xl",
  {
    variants: {
      type: {
        message: "rounded-tl-none",
        default: "",
      },
      size: {
        sm: "min-h-10 min-w-65.5 text-xs",
        md: "min-h-11 min-w-90 text-sm",
        lg: "min-h-12 min-w-125 text-base",
      },
    },
    defaultVariants: {
      type: "default",
      size: "md",
    },
  },
);

interface IntroduceBubbleProps extends VariantProps<typeof introduceBubble> {
  content: string | null;
  className?: string;
}

export default function IntroduceBubble({
  type,
  size,
  content,
  className,
}: IntroduceBubbleProps) {
  return (
    <div className={twMerge(introduceBubble({ type, size }), className)}>
      <span className="overflow-hidden break-words text-ellipsis whitespace-nowrap">
        {type === "message" && !content && "아직 자기소개를 작성하지 않았어요."}
        {type === "default" && !content ? "내용이 없습니다." : content}
      </span>
    </div>
  );
}
