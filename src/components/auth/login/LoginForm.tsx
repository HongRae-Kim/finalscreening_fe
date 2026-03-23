"use client";

import { BoxButton } from "@/components/common/button/BoxButton";
import TextInput from "@/components/common/TextInput";
import { useState } from "react";
import AuthErrorMsg from "../AuthErrorMsg";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/lib/validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      // 응답 바디 없을 수도 있으니 안전하게
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError("email", { message: "존재하지 않는 이메일입니다." });
          return;
        }
        if (res.status === 401) {
          setError("password", { message: "비밀번호가 올바르지 않습니다." });
          return;
        }

        setServerError(data?.message ?? "로그인에 실패했습니다.");
        return;
      }

      router.push("/");
    } catch (e) {
      console.log(e);
      setServerError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        {...register("email")}
        type="email"
        placeholder="이메일 주소"
        className="outline-border-primary h-15 w-125 outline-1 max-md:w-115 max-md:text-base"
      />
      {errors.email?.message && (
        <AuthErrorMsg message={errors.email?.message} />
      )}
      <TextInput
        {...register("password")}
        type="password"
        name="password"
        placeholder="비밀번호"
        className="outline-border-primary mt-4 mb-2 h-15 w-125 outline-1 max-md:w-115 max-md:text-base"
      />
      {errors.password?.message && (
        <AuthErrorMsg message={errors.password?.message} className="my-1" />
      )}

      {serverError && <AuthErrorMsg message={serverError} className="mt-2" />}
      <BoxButton
        type="submit"
        text={loading ? "로그인 중..." : "로그인"}
        tone="black"
        size="xl"
        className="mt-5 text-xl font-bold max-md:min-w-0"
        disabled={loading}
      />
    </form>
  );
}
