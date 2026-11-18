/** Puts the request path on a header so server components (the layout) can resolve the place the address names. */
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-path", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"] };
