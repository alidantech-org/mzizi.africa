/** Saved places. The layout resolves their names on the server in the reader's language; this page only shows them. */
import { SavedPlaces } from "#/components/places/saved-places";
import { SavedHeader } from "#/app/(app)/_views/saved-header";

export default function SavedView() {
  return (
    <>
      <SavedHeader />
      <SavedPlaces manage />
    </>
  );
}
