/** Request context: explicit language applies immediately and persists without changing the shared address. */
import { NextResponse, type NextRequest } from "next/server";
import { explorerLanguages } from "#/lib/dryv/explorer-address.ts";

const YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const explicit = request.nextUrl.searchParams.getAll("lang");
  if (explicit.length > 1) return new NextResponse("Supply one language", { status: 400 });
  const lang = explicit[0];
  if (lang !== undefined && !explorerLanguages.some((choice) => choice.code === lang)) return new NextResponse("Unsupported interface language", { status: 400 });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-path", request.nextUrl.pathname);
  requestHeaders.set("x-query", request.nextUrl.searchParams.toString());
  requestHeaders.delete("x-language");
  if (lang) requestHeaders.set("x-language", lang);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (lang) response.cookies.set("mz_lang", lang, { path: "/", maxAge: YEAR, sameSite: "lax" });
  return response;
}

export const config = { matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"] };
