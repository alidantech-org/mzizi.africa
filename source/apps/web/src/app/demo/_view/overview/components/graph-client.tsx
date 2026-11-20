"use client";
/** Loads the WebGL graph only in the browser; the page around it is still server-rendered. */
import dynamic from "next/dynamic";

export const GraphClient = dynamic(() => import("#demo/_view/overview/components/graph").then((m) => m.KnowledgeGraph), {
  ssr: false,
  loading: () => <div className="h-[320px] animate-pulse rounded-lg bg-paper" />,
});
