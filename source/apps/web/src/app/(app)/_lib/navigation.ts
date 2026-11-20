/** Client-safe address construction for the anonymous welcome dialog. */
export interface SetupParameters {
  "filters.country"?: string;
  "filters.query"?: string;
  "view.entity"?: "place";
  "view.id"?: string;
  "view.tab"?: "place" | "preferences";
}
export function setupLink(fields: SetupParameters = {}, language?: string): string {
  if (fields["view.id"] && (!fields["filters.country"] || fields["view.entity"] !== "place"))
    throw new Error("Place selection requires an explicit country and place entity.");
  const params = new URLSearchParams({ view: "setup" });
  for (const [key, value] of Object.entries(fields)) if (value !== undefined) params.set(key, value);
  if (language) params.set("lang", language);
  return `/?${params}`;
}
