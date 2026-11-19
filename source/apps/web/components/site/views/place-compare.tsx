"use client";

import CompareRoute from "#/app/data/compare/view.tsx";

/** Compare a place with others (`/<place>/data/compare`). */
export default function PlaceCompare({ id }: { id: string }) {
  return <CompareRoute place={id} />;
}
