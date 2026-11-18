"use client";

import dynamic from "next/dynamic";

export const ProjectsMapLazy = dynamic(() => import("#/components/site/map/projects-map.tsx"), {
  ssr: false,
  loading: () => <div className="skeleton h-[420px] rounded-[var(--radius)]" aria-hidden />,
});
