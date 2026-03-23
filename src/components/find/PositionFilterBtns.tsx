"use client";

import {
  activePositionIcons,
  Position,
  POSITION,
  positionIcons,
} from "@/types/position";
import { Asterisk } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function PositionFilterBtns({
  value,
  onChange,
}: {
  value: Position[];
  onChange: (next: Position[]) => void;
}) {
  const selected = value;

  const isChecked = (pos: string) => {
    if (pos === "ANY") return selected.length === 0;
    return selected.includes(pos as Position);
  };

  const toggleItem = (raw: string) => {
    const pos = raw as Position | "ANY";

    if (pos === "ANY") {
      onChange([]);
      return;
    }

    const next = selected.includes(pos)
      ? selected.filter((p) => p !== pos)
      : [...selected, pos];

    if (next.length >= 5) {
      onChange([]);
      return;
    }

    onChange(next);
  };

  return (
    <div className="flex items-center gap-2">
      {POSITION.map((p, index) =>
        p === "ANY" ? (
          <label key={index} className="cursor-pointer">
            <input
              id="test"
              type="checkbox"
              aria-label="Any position"
              className="sr-only"
              value={p}
              name={`${p} position`}
              checked={isChecked("ANY") ?? false}
              onChange={(e) => {
                toggleItem(e.target.value);
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
          <label key={index} className="shrink-0 cursor-pointer">
            <input
              type="checkbox"
              aria-label={`${p} position`}
              className="sr-only"
              value={p}
              name={`${p} position`}
              checked={isChecked(p) ?? false}
              onChange={(e) => {
                toggleItem(e.target.value);
              }}
            />
            <Image
              src={isChecked(p) ? activePositionIcons[p] : positionIcons[p]}
              alt={`${p} position icon`}
              width={28}
              height={28}
            />
          </label>
        ),
      )}
    </div>
  );
}
