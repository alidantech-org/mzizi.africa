"use client";

import dynamic from "next/dynamic";

export const ChoroplethLazy = dynamic(
  () => import("#/_archives/components/site/map/choropleth"),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[420px] rounded-[var(--radius)]" aria-hidden />
    ),
  },
);
