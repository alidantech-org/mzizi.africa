/** Saved places. */
import Link from "next/link";
import { SavedPlaces } from "#/components/home-parts";
import { PageHeader } from "#/components/ui";

export default function Saved() {
  return (
    <>
      <PageHeader eyebrow="You" title="Saved places">Each card opens that place with the subject you choose.</PageHeader>
      <SavedPlaces manage />
      <Link href="/ke" className="mt-6 inline-block text-sm font-medium text-accent">← Back to exploring</Link>
    </>
  );
}
