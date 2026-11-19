/** Legacy leadership entry resolves context on the server and opens the generated explorer. */
import { redirect } from "next/navigation";
import { loadContext } from "#/_archives/lib/server/data";
import { explorerAt } from "#/_archives/lib/dryv/explorer-address";
import { ExplorerView } from "#/_archives/lib/types/explorer-view.enum";

export default async function LeadersRoute({ place }: { place?: string }) {
  const context = await loadContext(undefined, place);
  if (!context) return <p role="alert">Place context is unavailable.</p>;
  redirect(
    explorerAt(
      [context.country.code, context.place?.path].filter(Boolean).join("/"),
      { view: ExplorerView.LEADERS },
    ),
  );
}
