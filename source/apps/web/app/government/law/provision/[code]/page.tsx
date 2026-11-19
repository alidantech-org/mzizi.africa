import { Suspense } from "react";

import View from "../../view.tsx";

/** `/government/law/provision/<code>`: one provision of an instrument. */
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <Suspense fallback={<div className="p-8" aria-busy="true" />}><View provision={decodeURIComponent(code)} /></Suspense>;
}
