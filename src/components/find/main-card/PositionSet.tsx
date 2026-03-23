import { activePositionIcons, Position, positionIcons } from "@/types/position";
import { Asterisk } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type PositionSetType = "my" | "find";
type PositionSetSize = "default" | "mini";

interface PositionSetProps {
  type: PositionSetType;
  size: PositionSetSize;
  data: Position | Position[];
  isActive: boolean;
  className?: string;
}

export default function PositionSet({
  type,
  size = "default",
  data,
  isActive,
  className,
}: PositionSetProps) {
  const h = size === "default" ? 30 : 20;
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center gap-2 font-semibold",
        size === "mini" && "w-full justify-start gap-3",
        className,
      )}
    >
      <p className={twMerge("text-sm", size === "mini" && "w-full")}>
        {type === "my" ? "주 포지션" : "찾는 포지션"}
      </p>
      <div
        className={twMerge(
          "flex w-full items-center justify-center gap-4",
          size === "mini" && "justify-start",
          className,
        )}
      >
        {typeof data === "object" ? (
          data.map((d, index) => {
            if (d === "ANY")
              return (
                <Asterisk
                  key={index}
                  size={h}
                  viewBox="4.5 4.5 15 15"
                  className={
                    isActive ? "text-accent" : "text-content-secondary"
                  }
                />
              );
            return (
              <Image
                key={index}
                src={isActive ? activePositionIcons[d] : positionIcons[d]}
                alt={`${d} position icon`}
                height={h}
              />
            );
          })
        ) : data === "ANY" ? (
          <Asterisk
            size={h}
            viewBox="4.5 4.5 15 15"
            className={isActive ? "text-accent" : "text-content-secondary"}
          />
        ) : (
          <Image
            src={isActive ? activePositionIcons[data] : positionIcons[data]}
            alt={`${data} position icon`}
            height={h}
          />
        )}
      </div>
    </div>
  );
}
