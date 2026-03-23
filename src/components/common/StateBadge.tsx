import { PostStatus } from "@/types/post";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const stateBadgeVariant = cva(
  "rounded-xl px-4 py-2 inline-flex text-sm justify-center items-center",
  {
    variants: {
      state: {
        RECRUIT: "text-accent bg-accent/10 border border-accent/50",
        ACTIVE:
          "text-content-primary bg-bg-secondary border border-border-primary",
        CLOSED: "text-negative bg-negative/10 border border-border-negative/50",
      },
    },
    defaultVariants: {
      state: "RECRUIT",
    },
  },
);

interface StateBadgeProps
  extends
    React.ComponentPropsWithoutRef<"img">,
    VariantProps<typeof stateBadgeVariant> {
  state: PostStatus;
  className?: string;
}

export default function StateBadge({ state, className }: StateBadgeProps) {
  return (
    <div className={twMerge(stateBadgeVariant({ state }), className)}>
      <span className="shrink-0">
        {state === "RECRUIT"
          ? "모집중"
          : state === "ACTIVE"
            ? "모집완료"
            : "게임완료"}
      </span>
    </div>
  );
}
