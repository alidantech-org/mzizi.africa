/** Addresses are built from the place's clean path (`nairobi/westlands`) and a section; the country itself has no path. */
export function placeAt(path: string | null | undefined, section: string): string {
  const parts = [path, section].filter((part): part is string => typeof part === "string" && part !== "");
  return `/${parts.join("/")}`;
}
