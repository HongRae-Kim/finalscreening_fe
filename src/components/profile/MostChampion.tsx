import { twMerge } from "tailwind-merge";
import Avatar from "../common/Avatar";
import { cva, VariantProps } from "class-variance-authority";
import { Champion } from "@/types/game-account";

const container = cva("flex flex-col", {
  variants: {
    size: {
      sm: "w-34 ",
      lg: "w-55",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface MostChampionProps extends VariantProps<typeof container> {
  data: Champion[];
  className?: string;
}

export default function MostChampion({
  size = "sm",
  data,
  className,
}: MostChampionProps) {
  return (
    <div className={twMerge(container({ size }), className)}>
      <div className="flex items-center justify-between">
        {data?.map((champ) => (
          <div key={champ.championId} className="relative flex">
            {" "}
            <Avatar
              key={champ.championId}
              type="champion"
              src={champ.championImageUrl}
              alt={champ.championName}
              size={size === "sm" ? "sm" : "lg"}
            />
            <div className="bg-bg-secondary absolute right-0 bottom-0 flex items-center justify-center">
              <span
                className={twMerge(
                  "text-accent px-1 py-0.5 text-[8px]",
                  size === "lg" && "px-1.5 text-[11px]",
                  champ.winRate < 50 && "text-negative",
                  champ.winRate < 25 && "text-content-secondary",
                )}
              >
                {Math.round(champ.winRate)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
