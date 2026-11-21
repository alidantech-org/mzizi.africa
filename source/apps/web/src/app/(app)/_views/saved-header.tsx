"use client";
import Link from "#/components/navigation/demo-link";
import { copy } from "@mzizi/copy";
import { PageHeader } from "#/components/ui/page-header";
import { useCopy } from "#/lib/copy/copy";

export function SavedHeader() {
  const t = useCopy();
  return (
    <>
      <PageHeader eyebrow={t(copy.pages.eyebrowYou)} title={t(copy.pages.saved.title)}>
        {t(copy.pages.saved.intro)}
      </PageHeader>
    </>
  );
}

export function BackLink() {
  const t = useCopy();
  return (
    <Link href="/" className="mt-6 inline-block text-sm font-medium text-accent">
      {t(copy.pages.backToExploring)}
    </Link>
  );
}
