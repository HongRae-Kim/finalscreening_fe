import Image from "next/image";
import { Rank, Tier, tierIcons } from "@/types/tier";
import { twMerge } from "tailwind-merge";
import { romanToNumber } from "@/utils/romanToNumber";

type TierSetType = "default" | "mini";
interface TierSetProps {
  tier: Tier | "UNRANKED";
  rank: Rank | "";
  type?: TierSetType;
  className?: string;
}

export default function TierSet({
  tier,
  rank,
  type = "default",
  className,
}: TierSetProps) {
  const validRank = !!rank;
  return (
    <div
      className={twMerge(
        "flex w-32.5 flex-col items-center justify-center text-sm",
        type === "mini" && "w-12.5",
        className,
      )}
    >
      <Image src={tierIcons[tier]} alt={`${tier} tier image`} />
      <span className="text-content-secondary">
        {type === "default"
          ? `${tier} ${tier === "CHALLENGER" || tier === "GRANDMASTER" || tier === "MASTER" || tier === "UNRANKED" ? "" : rank}`
          : `${validRank ? tier[0] : tier}${validRank ? romanToNumber(rank) : ""}`}
      </span>
    </div>
  );
}
