import { z } from "zod";

export const passwordSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9가-힣!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
    "공백 문자는 사용할 수 없으며 한글, 영어, 숫자, 특수문자만 가능합니다.",
  )
  .min(8, "비밀번호는 8글자 이상이어야 합니다.");