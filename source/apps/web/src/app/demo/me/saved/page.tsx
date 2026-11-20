/** Saved places. */
import Link from "#demo/_components/navigation/demo-link";
import { SavedPlaces } from "#demo/_view/home/components/home-parts";
import { PageHeader } from "#demo/_components/ui/primitives";

export default function Saved() {
  return (
    <>
      <PageHeader eyebrow="You" title="Saved places">
        Each card opens that place with the subject you choose.
      </PageHeader>
      <SavedPlaces manage />
      <Link href="/ke" className="mt-6 inline-block text-sm font-medium text-accent">
        ← Back to exploring
      </Link>
    </>
  );
}
