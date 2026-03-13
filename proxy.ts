import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (!session?.user && isDashboardPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (session?.user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
