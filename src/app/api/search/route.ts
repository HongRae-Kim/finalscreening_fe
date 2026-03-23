import { searchUsers } from "@/services/users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nickname = (searchParams.get("nickname") || "").trim();

  if (!nickname) return NextResponse.json([]);

  const data = await searchUsers(nickname);

  return NextResponse.json(data);
}
