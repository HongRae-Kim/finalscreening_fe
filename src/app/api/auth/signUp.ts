import { API_BASE } from "@/lib/clientApi";

export async function signUp({
  email,
  code,
  password,
  passwordConfirm,
}: {
  email: string;
  code: string;
  password: string;
  passwordConfirm: string;
}) {
  const res = await fetch(`${API_BASE}/api/v1/users/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      verificationCode: code,
    }),
  });

  if (!res.ok) {
    return {
      ok: res.ok,
      message: "회원가입 실패",
    };
  }

  return {
    ok: res.ok,
    message: "회원가입 성공",
  };
}

export async function sendEmailCode(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/email/verify-request?email=${encodeURIComponent(email)}`,
    { method: "POST", credentials: "include" },
  );

  if (!res.ok) {
    if (res.status === 409)
      return {
        ok: res.ok,
        message: "이미 존재하는 이메일입니다.",
      };
    return {
      ok: res.ok,
      message: "이메일 전송에 실패했습니다.",
    };
  }

  return {
    ok: res.ok,
    message: "이메일이 전송되었습니다.",
  };
}

export async function verifyEmailCode({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/email/verify-confirm?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!res.ok) {
    return {
      ok: res.ok,
      message: "인증번호가 올바르지 않습니다.",
    };
  }

  return { ok: res.ok, message: "인증이 완료되었습니다." };
}

export async function loginWithEmail(email: string, password: string) {
  const res = await fetch(`/api/v1/users/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      data: null,
    };
  }

  const data = await res.json();

  return {
    ok: true,
    status: res.status,
    data,
  };
}
