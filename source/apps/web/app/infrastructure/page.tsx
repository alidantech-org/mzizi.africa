/** Infrastructure: offices, schools, hospitals, police stations, polling stations and more, by class and place. */
import { listFacilities } from "@mzizi/api-client/actions/experience/list-facilities.actions.ts";

import { FacilitiesPage } from "#/components/site/facilities-page.tsx";
import { serverLanguage, unwrap } from "#/lib/server/data.ts";

export const dynamic = "force-dynamic";

export default async function InfrastructurePage({ searchParams }: { searchParams: Promise<{ class?: string; q?: string; featureId?: string }> }) {
  const { class: classCode, q, featureId } = await searchParams;
  const list = await unwrap(listFacilities({ query: { classCode, query: q, featureId, languageCode: await serverLanguage(), limit: 60 } }));
  return <FacilitiesPage list={list} classCode={classCode} q={q} base="/infrastructure" />;
}
