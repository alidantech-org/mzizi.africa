"use client";

import Link from "next/link";

import { LikeLeader } from "#/components/site/save-buttons.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";
import type { OfficeHolder } from "#/lib/types/office-holder.ts";

const initials = (name: string): string =>
  name
    .split(" ")
    .filter((part) => part !== "")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export function OfficialCard({ holder }: { holder: OfficeHolder }) {
  const { t } = useLanguage();
  const evidence = holder.evidence[0];
  return (
    <article className="flex gap-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] rounded-[var(--radius)] border border-border-default bg-surface-elevated p-5 shadow-[var(--shadow)]">
      <div
        aria-hidden
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-link font-display text-lg text-content-inverse"
      >
        {initials(holder.personName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay">
          {holder.officeTitle}
        </p>
        <h3 className="mt-0.5 font-display text-xl">{holder.personName}</h3>
        <dl className="mt-2 space-y-0.5 text-sm text-content-muted">
          <div className="flex gap-2">
            <dt>{t("party")}:</dt>
            <dd className="text-content-primary">{holder.partyName ?? t("notRecorded")}</dd>
          </div>
          {holder.tookOfficeOn ? (
            <div className="flex gap-2">
              <dt>{t("inOffice")}</dt>
              <dd className="text-content-primary">{holder.tookOfficeOn}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-3 flex items-center gap-3">
          <LikeLeader
            leader={{
              id: holder.holderId,
              name: holder.personName,
              office: holder.officeTitle,
              unitId: holder.unitFeatureId ?? null,
            }}
          />
          {evidence ? (
            <Link
              href={`${routes.evidenceView}?citationId=${evidence.citationId}`}
              className="inline-block text-sm font-medium text-link underline-offset-2 hover:underline"
            >
              {t("seeEvidence")} →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
