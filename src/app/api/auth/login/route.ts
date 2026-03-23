import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  const body = await req.json(); // { email, password }

  // 1) Next 서버가 백엔드로 로그인 요청
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 백엔드가 JSON으로 토큰을 내려준다는 가정
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    return new NextResponse(err, { status: res.status });
  }

  // 예: 백엔드 응답이 { accessToken, refreshToken } 형태라고 가정
  const data = await res.json();
  const { accessToken, refreshToken } = data;

  // 2) 여기서 "프론트 도메인" 쿠키로 심는다 (Set-Cookie는 Vercel이 내려줌)
  const response = NextResponse.json({ ok: true });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
    domain:
      process.env.NODE_ENV === "production" ? ".matchmyduo.shop" : undefined,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain:
      process.env.NODE_ENV === "production" ? ".matchmyduo.shop" : undefined,
  });

  return response;
}
