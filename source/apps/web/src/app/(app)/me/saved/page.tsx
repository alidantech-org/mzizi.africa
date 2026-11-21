import { Suspense } from "react";
import SavedView from "#/app/(app)/_views/saved";
import { BackLink } from "#/app/(app)/_views/saved-header";

export default function SavedPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SavedView />
      </Suspense>
      <BackLink />
    </>
  );
}
