import { z } from "zod";

export const nicknameSchema = (initialNickname?: string) =>
  z
  .string()
  .regex(
    /^[a-zA-Z0-9가-힣]+$/,
    "공백이나 특수 문자는 사용할 수 없으며 한글, 영어, 숫자만 가능합니다.",
  )
  .min(2, "닉네임은 2글자 이상이어야 합니다.")
  .max(8, "닉네임은 8글자 이하여야 합니다.")
  .refine((val) => val !== initialNickname, {
    message: "변경하려는 닉네임이 현재 닉네임과 동일합니다.",
  });