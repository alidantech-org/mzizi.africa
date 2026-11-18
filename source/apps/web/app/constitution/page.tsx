import { Suspense } from "react";

import View from "./view.tsx";

/** The route is a server page; the interactive view below it is the only client code. */
export default function Page() {
  return (
    <Suspense fallback={<div className="p-8" aria-busy="true" />}>
      <View />
    </Suspense>
  );
}
