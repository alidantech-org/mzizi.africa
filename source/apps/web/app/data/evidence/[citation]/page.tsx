/** `/data/evidence/<citation>`: one citation: its source, where in it, the edition and the files behind it. */
import Link from "next/link";

import { getEvidence } from "@mzizi/api-client/actions/locality/get-evidence.actions.ts";

import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { T } from "#/lib/site/i18n.tsx";

async function read(citation: string) {
  const response = await getEvidence({ params: { citationId: citation } });
  if (!response.success || response.body === null) throw new Error(response.message || "The evidence could not be loaded.");
  return response.body;
}

export default async function EvidencePage({ params }: { params: Promise<{ citation: string }> }) {
  const { citation } = await params;
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sources", href: "/data/sources" }, { label: "Evidence" }]} />
      <h1 className="hero-title text-3xl sm:text-4xl"><T>{"Evidence"}</T></h1>
      <Loaded read={() => read(decodeURIComponent(citation))}>
        {(detail) => (
          <div className="glass card mt-6 space-y-5">
            <div>
              <p className="font-display text-2xl">{detail.evidence.sourceName}</p>
              {detail.evidence.publisherName ? <p className="text-content-muted">{detail.evidence.publisherName}</p> : null}
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-content-muted"><T>{"Where in the source"}</T></dt><dd>{detail.evidence.locator ?? "—"}</dd></div>
              <div><dt className="text-content-muted"><T>{"Edition"}</T></dt><dd>{detail.editionLabel ?? "—"}</dd></div>
            </dl>
            {detail.quotedText ? <blockquote className="border-l-4 pl-4 text-sm italic">{detail.quotedText}</blockquote> : null}
            <p className="break-all font-mono text-xs text-content-muted">{detail.evidence.artifactTitle}</p>
            {detail.files.length > 0 ? (
              <div>
                <p className="text-sm font-semibold"><T>{"Files"}</T></p>
                <ul className="mt-1 text-sm">{detail.files.map((file) => <li key={file.fileVersionId}>{file.title ?? file.fileVersionId}</li>)}</ul>
              </div>
            ) : null}
            <Link href="/data/sources" className="inline-block text-sm font-medium text-link hover:underline"><T>{"Sources"}</T> →</Link>
          </div>
        )}
      </Loaded>
    </PageFrame>
  );
}
