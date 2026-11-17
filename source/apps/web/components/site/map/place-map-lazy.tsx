"use client";

import dynamic from "next/dynamic";

/** The map needs `window`, so it loads only in the browser. */
export const PlaceMapLazy = dynamic(() => import("#/components/site/map/place-map.tsx"), {
  ssr: false,
  loading: () => <div className="skeleton h-[340px] rounded-[var(--radius)]" aria-hidden />,
});
