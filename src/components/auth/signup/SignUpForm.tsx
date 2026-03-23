"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import TextInput from "@/components/common/TextInput";
import { useState } from "react";
import AuthErrorMsg from "../AuthErrorMsg";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendCodeSchema,
  verifyCodeSchema,
  signUpSchema,
  type SignUpForm,
} from "@/lib/validation/signupSchema";
import { useRouter } from "next/navigation";
import { sendEmailCode, signUp, verifyEmailCode } from "@/app/api/auth/signUp";
import { showToast } from "@/lib/toast";

export default function SignUpForm() {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState<{
    send?: boolean;
    verify?: boolean;
    signup?: boolean;
  }>({});

  const router = useRouter();

  const {
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      isEmailVerified: false,
      agreement: false,
    },
    mode: "onSubmit",
  });

  const onSendCode = async () => {
    clearErrors();

    const email = getValues("email");
    const parsed = sendCodeSchema.safeParse({ email });

    if (!parsed.success) {
      setError("email", { message: parsed.error.issues[0]?.message });
      return;
    }

    setLoading((p) => ({ ...p, send: true }));

    try {
      const res = await sendEmailCode(parsed.data.email);

      if (!res.ok) {
        setError("email", { message: res.message });
        return;
      }

      setIsCodeSent(true);
    } finally {
      setLoading((p) => ({ ...p, send: false }));
    }
  };

  const onVerifyCode = async () => {
    clearErrors();

    const { email, code } = getValues();

    const parsed = verifyCodeSchema.safeParse({ email, code });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "email" | "code";
        setError(field, { message: issue.message });
      }
      return;
    }

    setLoading((p) => ({ ...p, verify: true }));

    try {
      const res = await verifyEmailCode({
        email: parsed.data.email,
        code: parsed.data.code,
      });

      if (!res.ok) {
        setError("code", { message: "인증번호가 올바르지 않습니다." });
        return;
      }

      setIsEmailVerified(true);
      setValue("isEmailVerified", true, { shouldValidate: true });
    } finally {
      setLoading((p) => ({ ...p, verify: false }));
    }
  };

  const onSubmit = async (values: SignUpForm) => {
    setLoading((p) => ({ ...p, signup: true }));

    try {
      const res = await signUp({
        email: values.email,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        code: values.code,
      });

      if (!res.ok) {
        setError("root", { message: res.message });
        showToast.error("회원가입에 실패했습니다.");
        return;
      }
      showToast.success("회원가입이 완료되었습니다.");

      router.push("/login");
    } finally {
      setLoading((p) => ({ ...p, signup: false }));
    }
  };

  return (
    <>
      <form
        className="mt-12 flex w-full flex-col max-md:mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-3">
          <div className="w-full">
            <TextInput
              {...register("email")}
              placeholder="이메일 주소"
              className="outline-border-primary w-98 outline-1 max-md:w-full max-md:text-base"
              readOnly={isCodeSent}
            />
            {errors.email?.message && (
              <AuthErrorMsg message={errors.email?.message} />
            )}
          </div>
          <BoxButton
            onClick={onSendCode}
            type="button"
            size="md"
            tone="color"
            text={loading.send ? "전송중..." : "전송"}
            className={twMerge(
              "text-lg",
              (isCodeSent || loading.send) &&
                "bg-bg-tertiary hover:bg-bg-tertiary hover:cursor-default",
            )}
            disabled={isCodeSent || loading.send}
          />
        </div>
        {isCodeSent && (
          <p className="text-positive mt-3 ml-2 text-sm">
            이메일이 전송되었습니다.
          </p>
        )}

        <div className="mt-3 mb-2 flex flex-row items-center justify-between gap-3">
          <TextInput
            {...register("code")}
            placeholder="이메일 주소로 받은 인증 번호"
            className="outline-border-primary w-98 outline-1 max-md:text-base"
            readOnly={isEmailVerified}
          />
          <BoxButton
            type="button"
            size="md"
            tone="color"
            text={loading.verify ? "인증중..." : "인증"}
            onClick={onVerifyCode}
            disabled={!isCodeSent || isEmailVerified}
            className={twMerge(
              "text-lg",
              (!isCodeSent || isEmailVerified) &&
                "bg-bg-tertiary hover:bg-bg-tertiary hover:cursor-default",
            )}
          />
        </div>
        {isEmailVerified ? (
          <p className="text-positive mt-1 ml-2 text-sm">
            인증이 완료되었습니다.
          </p>
        ) : (
          errors.code?.message && (
            <AuthErrorMsg message={errors.code?.message} />
          )
        )}

        {isCodeSent && !loading.send && !isEmailVerified && (
          <div className="flex flex-row gap-1 text-base">
            <p className="text-content-secondary ml-2">
              인증번호를 받지 못하셨나요?
            </p>
            <button
              type="button"
              className="text-accent cursor-pointer hover:underline"
              onClick={onSendCode}
            >
              재전송
            </button>
          </div>
        )}
        <TextInput
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          className="outline-border-primary mt-3 mb-2 w-125 outline-1 max-md:w-full max-md:text-base"
        />
        {errors.password?.message && (
          <AuthErrorMsg message={errors.password?.message} />
        )}
        <TextInput
          {...register("passwordConfirm")}
          type="password"
          placeholder="비밀번호 확인"
          className="outline-border-primary mt-3 w-125 outline-1 max-md:w-full max-md:text-base"
        />
        {errors.passwordConfirm?.message && (
          <AuthErrorMsg message={errors.passwordConfirm?.message} />
        )}
        <label className="text-content-primary mt-12 mb-12 text-center text-sm">
          <div className="flex items-center justify-center gap-1">
            {" "}
            <input
              type="checkbox"
              {...register("agreement")}
              className="peer hidden"
            />
            <div className="border-content-secondary peer-checked:border-accent peer-checked:bg-accent mt-px h-4 w-4 rounded-full border-2"></div>
            <p className="text-content-primary text-sm">
              (필수){" "}
              <a href="#" className="text-accent hover:underline">
                이용약관
              </a>
              과{" "}
              <a href="#" className="text-accent hover:underline">
                개인정보처리방침
              </a>
              에 동의합니다.
            </p>
          </div>

          {errors.agreement?.message && (
            <AuthErrorMsg message={errors.agreement.message} />
          )}
        </label>

        <BoxButton
          text="회원가입"
          tone="color"
          size="xl"
          className="text-xl max-md:w-full max-md:min-w-0"
        >
          회원가입
        </BoxButton>
      </form>
    </>
  );
}
