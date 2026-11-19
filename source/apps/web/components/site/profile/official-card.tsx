"use client";

import Link from "next/link";

import { Avatar } from "#/components/site/ui/media.tsx";
import { LikeLeader } from "#/components/site/save-buttons.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import type { OfficeHolder } from "#/lib/types/office-holder.ts";

export function OfficialCard({ holder, portrait }: { holder: OfficeHolder; portrait?: string | null }) {
  const { t } = useLanguage();
  const evidence = holder.evidence[0];
  return (
    <article className="glass card card-lift flex gap-4">
      <Avatar name={holder.personName} size={56} src={portrait} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay">
          {holder.officeTitle}
        </p>
        <h3 className="mt-0.5 font-display text-xl"><Link className="hover:underline" href={`/leaders/${holder.holderId}`}>{holder.personName}</Link></h3>
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
              href={`/data/evidence/${evidence.citationId}`}
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
