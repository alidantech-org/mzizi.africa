/** Passes the request path to server components so the shared shell can load the catalogue for the place in the URL. */
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-mzizi-path", request.nextUrl.pathname);
  headers.set("x-mzizi-find", request.nextUrl.searchParams.get("find") ?? "");
  headers.set("x-mzizi-lvl", request.nextUrl.searchParams.get("lvl") ?? "");
  headers.set("x-mzizi-pg", request.nextUrl.searchParams.get("pg") ?? "");
  headers.set("x-mzizi-lang", request.nextUrl.searchParams.get("lang") ?? "");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/|demo|icons/|api/).*)"] };
