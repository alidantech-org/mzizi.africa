"use client";

import dynamic from "next/dynamic";

export const ProjectsMapLazy = dynamic(
  () => import("#/_archives/components/site/map/projects-map"),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[420px] rounded-[var(--radius)]" aria-hidden />
    ),
  },
);
