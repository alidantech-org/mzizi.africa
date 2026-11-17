"use client";

import Link from "next/link";

import { OfficialCard } from "#/components/site/profile/official-card.tsx";
import { ProcurementPanel } from "#/components/site/profile/procurement-panel.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";
import type { LocalityProfile } from "#/lib/types/locality-profile.ts";

export function ProfileView({ profile }: { profile: LocalityProfile }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-12">
      <header>
        <nav
          aria-label={t("chainLabel")}
          className="flex flex-wrap items-center gap-1 text-sm text-content-muted"
        >
          {profile.chain.map((unit, index) => (
            <span key={unit.featureId} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden>›</span> : null}
              {index < profile.chain.length - 1 ? (
                <Link
                  className="hover:underline"
                  href={`${routes.placeProfile}?featureId=${unit.featureId}`}
                >
                  {unit.name}
                </Link>
              ) : (
                <span className="font-medium text-content-primary">{unit.name}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl sm:text-5xl">{profile.place.name}</h1>
          <span className="rounded-full bg-surface-sunken px-3 py-1 text-sm font-medium text-content-muted">
            {profile.place.kindLabel}
          </span>
        </div>
      </header>
      <section aria-labelledby="reps">
        <h2 id="reps" className="mb-4 text-2xl">
          {t("representatives")}
        </h2>
        {profile.officials.length === 0 ? (
          <p className="text-content-muted">{t("notRecorded")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.officials.map((holder) => (
              <OfficialCard key={holder.holderId} holder={holder} />
            ))}
          </div>
        )}
      </section>
      <section aria-labelledby="proc">
        <h2 id="proc" className="mb-4 text-2xl">
          {t("procurement")}
        </h2>
        <ProcurementPanel summary={profile.procurement} />
      </section>
      {profile.gaps.length > 0 ? (
        <section
          aria-labelledby="gaps"
          className="rounded-[var(--radius)] border border-dashed border-calabash/70 bg-calabash/10 p-5"
        >
          <h2 id="gaps" className="font-display text-lg">
            {t("gaps")}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-content-muted">
            {profile.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
