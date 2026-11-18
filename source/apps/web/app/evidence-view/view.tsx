"use client";

/** Route `/evidence-view`. Scaffolded by Dryv once; this file belongs to the app. */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { evidenceOf } from "#/lib/site/api.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";
import { routes } from "#/lib/dryv/routes.ts";

function Evidence() {
  const citationId = useSearchParams().get("citationId") ?? "";
  const router = useRouter();
  const { t } = useLanguage();
  const loaded = useAsync(() => evidenceOf(citationId), citationId);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-link hover:underline"
      >
        ← {t("back")}
      </button>
      <h1 className="mt-4 text-3xl">{t("evidence")}</h1>
      <div className="mt-6">
        <AsyncView loaded={loaded}>
          {(detail) => (
            <div className="space-y-5 rounded-[var(--radius)] border border-border-default bg-surface-elevated p-6 shadow-[var(--shadow)]">
              <div>
                <p className="font-display text-2xl">{detail.evidence.sourceName}</p>
                {detail.evidence.publisherName ? (
                  <p className="text-content-muted">{detail.evidence.publisherName}</p>
                ) : null}
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-content-muted">{t("locator")}</dt>
                  <dd>{detail.evidence.locator ?? t("notRecorded")}</dd>
                </div>
                <div>
                  <dt className="text-content-muted">{t("edition")}</dt>
                  <dd>{detail.editionLabel ?? t("notRecorded")}</dd>
                </div>
              </dl>
              <p className="break-all font-mono text-xs text-content-muted">
                {detail.evidence.artifactTitle}
              </p>
              {detail.files.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold">{t("files")}</p>
                  <ul className="mt-1 text-sm">
                    {detail.files.map((file) => (
                      <li key={file.fileVersionId}>{file.title ?? file.fileVersionId}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Link
                href={routes.sourceBrowse}
                className="inline-block text-sm font-medium text-link hover:underline"
              >
                {t("sources")} →
              </Link>
            </div>
          )}
        </AsyncView>
      </div>
    </div>
  );
}

export default function EvidenceViewRoute() {
  return (
    <Suspense>
      <Evidence />
    </Suspense>
  );
}
