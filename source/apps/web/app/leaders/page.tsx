"use client";

/** Route `/leaders`: who leads Kenya, top to bottom. Pick a place to see the leaders above it. */
import { Suspense } from "react";
import { T } from "#/lib/site/i18n.tsx";
import { useSearchParams } from "next/navigation";

import { LeaderTree } from "#/components/site/leader-tree.tsx";
import { PlacePicker } from "#/components/site/place-picker.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";

function Body() {
  const place = useSearchParams().get("place") ?? undefined;
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Leaders" }]} />
      <p className="kicker">Who leads</p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Leaders, top to bottom"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"Start with national leaders and follow the tree down to a county, a constituency and a ward. Tap anyone to see their record. Choose a place to see the leaders above and at it."}</T></p>
      <div className="my-6 max-w-xl"><PlacePicker base="/leaders" /></div>
      <LeaderTree featureId={place} />
    </PageFrame>
  );
}

export default function LeadersRoute() {
  return <Suspense><Body /></Suspense>;
}
