/** Where each kind of search hit opens. */
import { placeAt } from "#/_archives/lib/site/links";
import type { SearchHit } from "#/_archives/lib/site/insights";

export function hrefFor(
  hit: Pick<SearchHit, "kind" | "id" | "code" | "featureId" | "placePath">,
): string {
  switch (hit.kind) {
    case "place":
      return placeAt(hit.placePath, "");
    case "leader":
      return `/leaders/${hit.id}`;
    case "party":
      return `/politics/parties/${hit.code ?? ""}`;
    case "project":
      return `/projects/${hit.code ?? ""}`;
    case "tender":
      return `/procurement/tenders?q=${encodeURIComponent(hit.code ?? "")}`;
    case "indicator":
      return `/data/statistics?indicator=${hit.code?.replace(/^sta\.ind\./, "") ?? ""}`;
    case "source":
      return "/data/sources";
    default:
      return "/search";
  }
}
