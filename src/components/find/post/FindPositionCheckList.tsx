"use client";

import {
  activePositionIcons,
  Position,
  POSITION,
  positionIcons,
} from "@/types/position";
import { Asterisk } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type FindPositionCheckListProps =
  | {
      type: "my";
      value: Position;
      onChange: (v: Position) => void;
      onLimitExceeded?: (message: string) => void;
    }
  | {
      type: "find";
      value: Position[];
      onChange: (v: Position[]) => void;
      onLimitExceeded?: (message: string) => void;
    };

export default function FindPositionCheckList(
  props: FindPositionCheckListProps,
) {
  const { type, onChange } = props;
  const selected: Position[] =
    type === "my" ? (props.value ? [props.value] : []) : (props.value ?? []);

  const isChecked = (v: Position) => selected.includes(v);

  const toggle = (v: Position) => {
    if (type === "my") {
      onChange(v);
      return;
    }

    if (v === "ANY") {
      onChange(["ANY"]);
      return;
    }

    // ANY가 이미 선택돼 있으면 제거
    const base = selected.filter((x) => x !== "ANY");

    // 최대 3개 제한 (원하면 여기서 막기)
    if (!base.includes(v) && base.length >= 3) {
      props.onLimitExceeded?.("찾는 포지션은 3개까지만 선택할 수 있어요.");
      return;
    }

    const next = base.includes(v) ? base.filter((x) => x !== v) : [...base, v];

    onChange(next);
  };

  return (
    <div className="flex gap-2.5 max-md:gap-1.5">
      {POSITION.map((p, index) =>
        p === "ANY" ? (
          <label key={index} className="cursor-pointer">
            <input
              id="test"
              type="checkbox"
              aria-label="Any position"
              className="sr-only"
              value="ANY"
              name={type === "my" ? "myPosition" : "findPosition"}
              checked={isChecked("ANY") ?? false}
              onChange={() => {
                toggle("ANY");
              }}
            />
            <Asterisk
              size={28}
              viewBox="4.5 4.5 15 15"
              className={twMerge(
                "text-content-secondary",
                isChecked("ANY") && "text-accent",
              )}
            />
          </label>
        ) : (
          <label
            key={index}
            className="flex shrink-0 cursor-pointer items-center"
          >
            <input
              type="checkbox"
              aria-label={`${p} position`}
              className="sr-only"
              value={p}
              name={type === "my" ? "myPosition" : "findPosition"}
              checked={isChecked(p) ?? false}
              onChange={() => toggle(p)}
            />
            <Image
              src={isChecked(p) ? activePositionIcons[p] : positionIcons[p]}
              alt={`${p} position icon`}
              width={p == "SUPPORT" ? 32 : 28}
              height={p == "SUPPORT" ? 32 : 28}
            />
          </label>
        ),
      )}
    </div>
  );
}
