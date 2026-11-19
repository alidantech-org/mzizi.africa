/** Institutions: every public body in the seed. Selection lives in the URL (view.entity, view.id). */
import { Suspense } from "react";
import { InstitutionBrowser } from "#/components/institution-browser";
import { PageHeader, RealTag } from "#/components/ui";
import data from "#/data/generated/governance.json";
import type { ViewProps } from "./types";

export function Institutions({ ctx }: ViewProps) {
  const id = ctx.params["view.id"];
  const entity = ctx.params["view.entity"];
  const bad = (entity && entity !== "institution") || (id && !data.institutions.some((i) => i.code === id));
  return (
    <>
      <PageHeader eyebrow="Institutions" title="Leaders of every public body" actions={<RealTag>{data.institutions.length} bodies · {data.offices.length} offices</RealTag>}>Kenya has many bodies besides the three arms. Pick one to see what it is, which offices lead it, and where it sits. These bodies serve the whole country.</PageHeader>
      {bad && <div role="alert" className="mb-5 rounded-lg border border-c1 bg-c1/10 p-4 text-sm">No institution matches <b>{entity ?? "institution"} {id}</b>. Showing the first body instead.</div>}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}><InstitutionBrowser selected={bad ? undefined : id} kind={ctx.params["filters.kind"]} /></Suspense>
    </>
  );
}
