"use client";

import dynamic from "next/dynamic";

export const ChoroplethLazy = dynamic(() => import("#/components/site/map/choropleth.tsx"), {
  ssr: false,
  loading: () => <div className="skeleton h-[420px] rounded-[var(--radius)]" aria-hidden />,
});
