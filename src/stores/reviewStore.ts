import { EmojiType } from "@/types/emoji";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type ReviewStore = {
  initialData: {
    nickName: string;
    profileImage: string;
    emoji: EmojiType;
    content: string;
  };
  setInitialData: ({
    nickName,
    profileImage,
    emoji,
    content,
  }: {
    nickName?: string;
    profileImage?: string;
    emoji?: EmojiType;
    content?: string;
  }) => void;
};

export const useReviewStore = create<ReviewStore>()(
  devtools(
    immer((set) => ({
      initialData: {
        nickName: "",
        profileImage: "",
        emoji: "GOOD",
        content: "",
      },
      setInitialData: ({ nickName, profileImage, emoji, content }) =>
        set({
          initialData: {
            nickName: nickName ?? "",
            profileImage: profileImage ?? "",
            emoji: emoji ?? "GOOD",
            content: content ?? "",
          },
        }),
    })),
  ),
);
