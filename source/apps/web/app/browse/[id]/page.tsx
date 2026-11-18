"use client";

import { useParams } from "next/navigation";

import { BrowseView } from "#/components/site/browse-view.tsx";

export default function BrowsePlace() {
  const { id } = useParams<{ id: string }>();
  return <BrowseView featureId={id} />;
}
