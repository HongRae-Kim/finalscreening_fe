"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface DropDownProps {
  placeholder: string;
  items: { value: string; label: string | number | React.ReactNode }[];
  value?: string;
  onValueChange: (value: string) => void;
  name?: string;
  className?: string;
}

export default function Dropdown({
  placeholder,
  items,
  value,
  onValueChange,
  name,
  className,
}: DropDownProps) {
  return (
    <Select.Root defaultValue={value} onValueChange={onValueChange} name={name}>
      <Select.Trigger
        className={twMerge(
          "border-border-primary bg-bg-primary text-content-primary data-placeholder:text-content-tertiary flex cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5 text-sm outline-0",
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} className="text-content-secondary" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          side="bottom"
          sideOffset={4}
          position="popper"
          collisionPadding={0}
          avoidCollisions={true}
          className="border-border-primary bg-bg-primary text-content-secondary z-99 max-h-60 w-full rounded-xl border"
        >
          <Select.ScrollUpButton className="flex h-6 items-center justify-center">
            <ChevronUp size={14} />
          </Select.ScrollUpButton>

          <Select.Viewport className="w-(--radix-select-trigger-width) overflow-auto p-2">
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex h-6 items-center justify-center">
            <ChevronDown size={14} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <Select.Item
      value={value}
      className="focus:bg-bg-secondary focus:text-content-primary hover:bg-bg-secondary flex cursor-pointer items-center justify-between rounded-xl px-4 py-2 text-sm outline-none select-none"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
