/**
 * Puts the request path on a header so server components (the layout) can resolve the place the address names, and applies a
 * shared `?lang=xx` link: the language becomes the visitor's preference and the address loses the parameter.
 */
import { NextResponse, type NextRequest } from "next/server";

const LANGUAGE = /^[a-z]{2}$/;
const YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  if (lang !== null) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("lang");
    const response = NextResponse.redirect(clean);
    if (LANGUAGE.test(lang)) response.cookies.set("mz_lang", lang, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return response;
  }
  const headers = new Headers(request.headers);
  headers.set("x-path", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"] };
