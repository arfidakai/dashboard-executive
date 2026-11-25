import { NextResponse } from "next/server";
import {
  createSessionToken,
  isAuthConfigured,
  safeEqual,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/src/lib/auth";

type LoginCredentials = { username: string; password: string };

function isLoginCredentials(value: unknown): value is LoginCredentials {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as { username?: unknown }).username === "string" &&
    typeof (value as { password?: unknown }).password === "string",
  );
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ message: "Login belum dikonfigurasi di server" }, { status: 503 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (!isLoginCredentials(body)) {
    return NextResponse.json({ message: "Username dan password wajib diisi" }, { status: 400 });
  }

  if (
    !safeEqual(body.username, process.env.LOGIN_USERNAME!) ||
    !safeEqual(body.password, process.env.LOGIN_PASSWORD!)
  ) {
    return NextResponse.json({ message: "Username atau password salah" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(body.username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
