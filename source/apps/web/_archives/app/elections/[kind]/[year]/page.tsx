/** `/elections/<kind>/<year>`: one election, found by its kind and year (`/elections/general/2022`). */
import { notFound } from "next/navigation";

import { elections } from "#/_archives/lib/site/insights.ts";

import View from "../../view.tsx";

export const dynamic = "force-dynamic";

export default async function ElectionPage({
  params,
}: {
  params: Promise<{ kind: string; year: string }>;
}) {
  const { kind, year } = await params;
  const { elections: list } = await elections();
  const found = list.find((e) => e.kind === kind && String(e.year) === year);
  if (!found) notFound();
  return <View id={found.electionId} base={`/elections/${kind}/${year}`} />;
}
