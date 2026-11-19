import CompareRoute from "#/_archives/app/data/compare/view";

/** Compare a place with others (`/<place>/data/compare`). */
export default function PlaceCompare({ id }: { id: string }) {
  return <CompareRoute place={id} />;
}
