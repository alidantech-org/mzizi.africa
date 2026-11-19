/** Legacy finance entry resolves its place on the server and opens the contextual explorer. */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { resolveLocality } from "@mzizi/api-client/actions/locality/resolve-locality.actions.ts";
import { loadContext, serverLanguage } from "#/_archives/lib/server/data";
import { explorerAt } from "#/_archives/lib/dryv/explorer-address";
import { ExplorerView } from "#/_archives/lib/types/explorer-view.enum";

export default async function FinanceRoute() {
  const requestHeaders = await headers();
  const query = new URLSearchParams(requestHeaders.get("x-query") ?? "");
  let featureId: string | undefined;
  if (query.has("lat") && query.has("lng")) {
    const latitude = Number(query.get("lat"));
    const longitude = Number(query.get("lng"));
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180
    ) {
      const result = await resolveLocality({
        query: { latitude, longitude, languageCode: await serverLanguage() },
      });
      featureId = result.success ? result.body?.place?.featureId : undefined;
    }
  }
  const context = await loadContext(undefined, featureId);
  if (!context) return <p role="alert">Place context is unavailable.</p>;
  redirect(
    explorerAt(
      [context.country.code, context.place?.path].filter(Boolean).join("/"),
      { view: ExplorerView.FINANCE },
    ),
  );
}
