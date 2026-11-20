/** Root address adapter for the copied UI. The permanent demo keeps its own prefix adapter. */
export const DEMO_BASE = "";
export function isDemoPath(pathname: string): boolean {
  return pathname.startsWith("/") && pathname !== "/demo" && !pathname.startsWith("/demo/");
}
export function demoHref(href: string): string {
  return href;
}
export function demoSegments(href: string): string[] {
  return href.split("?")[0].split("#")[0].split("/").filter(Boolean);
}
