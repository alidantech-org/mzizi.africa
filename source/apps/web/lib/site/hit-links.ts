/** Where each kind of search hit opens. */
import type { SearchHit } from "#/lib/site/insights.ts";

export function hrefFor(hit: Pick<SearchHit, "kind" | "id" | "code" | "featureId">): string {
  switch (hit.kind) {
    case "place": return `/place-profile?featureId=${hit.id}`;
    case "leader": return `/leaders/${hit.id}`;
    case "party": return `/parties/${hit.code ?? ""}`;
    case "project": return `/projects/${hit.code ?? ""}`;
    case "tender": return `/tenders?q=${encodeURIComponent(hit.code ?? "")}`;
    case "indicator": return `/statistics?indicator=${hit.code?.replace(/^sta\.ind\./, "") ?? ""}`;
    case "source": return "/source-browse";
    default: return "/search";
  }
}
