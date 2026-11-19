"use client";

import { BrowseView } from "#/components/site/browse-view.tsx";

/** The places inside a place (`/<place>/places`). */
export default function PlaceBrowse({ id }: { id: string }) {
  return <BrowseView featureId={id} />;
}
