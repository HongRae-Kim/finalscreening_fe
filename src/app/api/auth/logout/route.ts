import { API_BASE } from "@/lib/clientApi";
import { NextResponse } from "next/server";

const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.COOKIE_DOMAIN ?? ".matchmyduo.cloud"
    : undefined;

export async function POST() {
  const res = await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    return new NextResponse(err, { status: res.status });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: COOKIE_DOMAIN,
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: COOKIE_DOMAIN,
  });

  return response;
}
