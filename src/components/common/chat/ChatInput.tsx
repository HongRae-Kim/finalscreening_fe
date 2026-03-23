"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Send } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

type ChatInputProps = {
  placeholder?: string;
  onSend: (message: string) => void | Promise<void>;

  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;

  disabled?: boolean;
  isSending?: boolean;

  className?: string;
  inputClassName?: string;
};

export default function ChatInput({
  placeholder = "보낼 메시지를 입력하세요",
  onSend,
  value,
  onChange,
  defaultValue = "",
  disabled = false,
  isSending = false,
  className,
  inputClassName,
}: ChatInputProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const text = isControlled ? value : internalValue;

  const inputDisabled = disabled || isSending;
  const canSend = text.trim().length > 0 && !inputDisabled;

  const setText = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleSend = async () => {
    if (!canSend) return;
    await onSend(text.trim());
    setText("");
  };

  return (
    <Tooltip.Provider delayDuration={150}>
      <div className={twMerge("flex w-full items-center gap-3", className)}>
        {/* 입력 영역 */}
        <div
          className={twMerge(
            "flex w-full items-center",
            "bg-bg-secondary border-border-primary border",
            "h-14 rounded-full",
          )}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (e.nativeEvent.isComposing) return; // IME(한글) 조합 중 Enter 방지
              e.preventDefault();
              handleSend();
            }}
            placeholder={placeholder}
            disabled={inputDisabled}
            className={twMerge(
              "w-full bg-transparent outline-none",
              "text-content-primary placeholder:text-content-tertiary",
              "text-lg",
              "pr-4 pl-5", // ✅ placeholder 좌측 여백 20px
              inputClassName,
            )}
          />
        </div>

        {/* 전송 버튼 (Input 바깥, 우측) */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="send message"
              className={twMerge(
                "h-12 w-12 shrink-0 rounded-full",
                "flex items-center justify-center",
                "bg-accent",
                !canSend && "cursor-not-allowed opacity-40",
              )}
            >
              <Send className="text-bg-primary h-5 w-5" />
            </button>
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              sideOffset={8}
              className="bg-bg-quaternary text-content-main rounded-md px-2 py-1 text-xs"
            >
              보내기
              <Tooltip.Arrow className="fill-bg-quaternary" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
