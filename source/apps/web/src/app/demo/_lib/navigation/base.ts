/** The demo URL boundary. Logical place paths can be accepted without leaking navigation into the real app. */
export const DEMO_BASE = "/demo";
export function isDemoPath(pathname: string): boolean {
  return pathname === DEMO_BASE || pathname.startsWith(`${DEMO_BASE}/`);
}
export function demoHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (
    href === DEMO_BASE ||
    href.startsWith(`${DEMO_BASE}/`) ||
    href.startsWith(`${DEMO_BASE}?`) ||
    href.startsWith(`${DEMO_BASE}#`)
  )
    return href;
  return href === "/" ? DEMO_BASE : `${DEMO_BASE}${href.startsWith("/?") || href.startsWith("/#") ? href.slice(1) : href}`;
}
export function demoSegments(href: string): string[] {
  const parts = href.split("?")[0].split("#")[0].split("/").filter(Boolean);
  return parts[0] === "demo" ? parts.slice(1) : parts;
}
