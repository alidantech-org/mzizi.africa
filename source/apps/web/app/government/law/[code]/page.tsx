import { Suspense } from "react";

import View from "../view.tsx";

/** `/government/law/<instrument>`: the instrument's overview. */
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <Suspense fallback={<div className="p-8" aria-busy="true" />}><View instrument={decodeURIComponent(code)} /></Suspense>;
}
