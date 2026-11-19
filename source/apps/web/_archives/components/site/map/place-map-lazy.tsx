"use client";

import dynamic from "next/dynamic";

/** The map needs `window`, so it loads only in the browser. */
export const PlaceMapLazy = dynamic(
  () => import("#/_archives/components/site/map/place-map"),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[340px] rounded-[var(--radius)]" aria-hidden />
    ),
  },
);
