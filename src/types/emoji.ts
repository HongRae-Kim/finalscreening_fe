import emojiGood from "@/assets/images/emoji/emoji_good.png";
import emojiNormal from "@/assets/images/emoji/emoji_normal.png";
import emojiBad from "@/assets/images/emoji/emoji_bad.png";

export type EmojiType = "GOOD" | "NORMAL" | "BAD";

export const EMOJI_SRC_MAP: Record<EmojiType, string> = {
  GOOD: emojiGood.src,
  NORMAL: emojiNormal.src,
  BAD: emojiBad.src,
};
