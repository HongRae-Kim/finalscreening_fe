// lib/validation/signupSchema.ts
import { z } from "zod";

const EmailIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9._-]{2,32}$/, "아이디는 2글자 이상이어야 합니다.");

export const sendCodeSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일 형식이 올바르지 않습니다.")
    .refine(
      (email) => {
        const [id] = email.split("@");
        return EmailIdSchema.safeParse(id).success;
      },
      { message: "이메일 아이디는 2글자 이상이어야 합니다." },
    ),
});

export const verifyCodeSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일 형식이 올바르지 않습니다."),
  code: z
    .string()
    .min(1, "인증번호를 입력해주세요.")
    .length(6, "인증번호 6자리를 입력해주세요."),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .refine(
        (email) => {
          const [id] = email.split("@");
          return EmailIdSchema.safeParse(id).success;
        },
        { message: "이메일 아이디는 2글자 이상이어야 합니다." },
      ),

    code: z
      .string()
      .min(1, "인증번호를 입력해주세요.")
      .length(6, "인증번호 6자리를 입력해주세요."),

    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8글자 이상이어야 합니다.")
      .refine((v) => !/\s/.test(v), {
        message: "비밀번호는 공백을 포함할 수 없습니다.",
      })
      .refine((v) => /[a-zA-Z]/.test(v), {
        message: "비밀번호에 영문이 포함되어야 합니다.",
      })
      .refine((v) => /\d/.test(v), {
        message: "비밀번호에 숫자가 포함되어야 합니다.",
      })
      .refine((v) => /[^a-zA-Z0-9]/.test(v), {
        message: "비밀번호에 특수문자가 포함되어야 합니다.",
      }),

    passwordConfirm: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8글자 이상이어야 합니다."),

    isEmailVerified: z.boolean(),

    agreement: z
      .boolean()
      .refine(
        (v) => v === true,
        "이용약관 및 개인정보처리방침에 동의해주세요.",
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SendCodeForm = z.infer<typeof sendCodeSchema>;
export type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
