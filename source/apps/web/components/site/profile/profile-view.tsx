"use client";

import { PlaceMapLazy } from "#/components/site/map/place-map-lazy.tsx";
import { SavePlace, SaveSpot } from "#/components/site/save-buttons.tsx";
import { OfficialCard } from "#/components/site/profile/official-card.tsx";
import { ProcurementPanel } from "#/components/site/profile/procurement-panel.tsx";
import { LeaderTree } from "#/components/site/leader-tree.tsx";
import { FactStrip } from "#/components/site/fact-strip.tsx";
import { Gallery } from "#/components/site/ui/media.tsx";
import { PlaceTabs, PlaceTrail } from "#/components/site/ui/primitives.tsx";
import { browse } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import type { LocalityProfile } from "#/lib/types/locality-profile.ts";

export function ProfileView({
  profile,
  position,
}: {
  profile: LocalityProfile;
  position: { latitude: number; longitude: number } | null;
}) {
  const { t } = useLanguage();
  const gallery = useAsync(() => browse(profile.place.featureId), `gallery-${profile.place.featureId}`);
  return (
    <div className="space-y-12">
      <header className="reveal">
        <PlaceTrail chain={profile.chain} section={{ label: "Places", href: "/browse" }} />
        <PlaceTabs featureId={profile.place.featureId} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl sm:text-5xl">{profile.place.name}</h1>
          <span className="rounded-full bg-surface-sunken px-3 py-1 text-sm font-medium text-content-muted">
            {profile.place.kindLabel}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SavePlace
            place={{
              id: profile.place.featureId,
              name: profile.place.name,
              kind: profile.place.kindLabel,
            }}
          />
          {position ? (
            <SaveSpot
              latitude={position.latitude}
              longitude={position.longitude}
              label={profile.place.name}
              featureId={profile.place.featureId}
            />
          ) : null}
        </div>
      </header>
      <section aria-label={t("mapTitle")} className="reveal reveal-1">
        <PlaceMapLazy
          units={profile.chain.map((unit) => ({ featureId: unit.featureId, name: unit.name }))}
          position={position}
        />
      </section>
      <section aria-labelledby="reps" className="reveal reveal-2">
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
      {gallery.state === "ready" && gallery.value.media.length > 0 ? (
        <section aria-label="Pictures and videos" className="reveal reveal-2"><h2 className="mb-4 text-2xl">Pictures and videos</h2><Gallery items={gallery.value.media} /></section>
      ) : null}
      <section aria-labelledby="tree" className="reveal reveal-2"><h2 id="tree" className="mb-1 text-2xl">Leaders from the country down to here</h2><p className="mb-4 text-sm text-content-muted">National leaders affect you too. This tree starts at the top and follows the places you are in.</p><LeaderTree featureId={profile.place.featureId} /></section>
      <FactStrip featureId={profile.place.featureId} />
      <section aria-labelledby="proc" className="reveal reveal-3">
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
