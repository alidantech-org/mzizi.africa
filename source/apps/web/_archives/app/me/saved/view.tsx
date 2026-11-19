"use client";

/** `/me/saved`: what the visitor keeps on this device. Hand-written; it is not a Dryv view because it reads no operation. */
import Link from "next/link";

import { placeAt } from "#/_archives/lib/site/links";
import { useLanguage } from "#/_archives/lib/site/i18n";
import { useSaved } from "#/_archives/lib/site/saved";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal">
      <h2 className="mb-3 text-xl">{title}</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</ul>
    </section>
  );
}

function Row({
  href,
  title,
  subtitle,
  onRemove,
  removeLabel,
}: {
  href: string;
  title: string;
  subtitle?: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-[var(--radius)] border border-border-default bg-surface-elevated px-5 py-4 shadow-[var(--shadow)] transition hover:border-clay">
      <Link href={href} className="min-w-0 flex-1">
        <p className="truncate font-display text-lg">{title}</p>
        {subtitle ? (
          <p className="truncate text-sm text-content-muted">{subtitle}</p>
        ) : null}
      </Link>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs text-content-muted hover:text-danger"
      >
        {removeLabel}
      </button>
    </li>
  );
}

export default function SavedRoute() {
  const { t } = useLanguage();
  const saved = useSaved();
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-12">
      <header className="reveal">
        <h1 className="text-4xl">{t("savedTitle")}</h1>
        <p className="mt-2 max-w-2xl text-content-muted">{t("savedBody")}</p>
      </header>
      {saved.count === 0 ? (
        <p className="text-content-muted">{t("savedEmpty")}</p>
      ) : null}
      {saved.places.length > 0 ? (
        <Section title={t("myPlaces")}>
          {saved.places.map((place) => (
            <Row
              key={place.id}
              href={placeAt(place.path, "")}
              title={place.name}
              subtitle={place.kind}
              onRemove={() => saved.togglePlace(place)}
              removeLabel={t("remove")}
            />
          ))}
        </Section>
      ) : null}
      {saved.spots.length > 0 ? (
        <Section title={t("mySpots")}>
          {saved.spots.map((spot) => (
            <Row
              key={spot.id}
              href={`/finance?lat=${spot.latitude}&lng=${spot.longitude}`}
              title={spot.label}
              subtitle={`${spot.latitude.toFixed(4)}, ${spot.longitude.toFixed(4)}`}
              onRemove={() => saved.removeSpot(spot.id)}
              removeLabel={t("remove")}
            />
          ))}
        </Section>
      ) : null}
      {saved.leaders.length > 0 ? (
        <Section title={t("myLeaders")}>
          {saved.leaders.map((leader) => (
            <Row
              key={leader.id}
              href={`/leaders/${leader.id}`}
              title={leader.name}
              subtitle={leader.office}
              onRemove={() => saved.toggleLeader(leader)}
              removeLabel={t("remove")}
            />
          ))}
        </Section>
      ) : null}
      {saved.projects.length > 0 ? (
        <Section title={t("myProjects")}>
          {saved.projects.map((project) => (
            <Row
              key={project.id}
              href={`/projects/${project.id}`}
              title={project.title}
              onRemove={() => saved.toggleProject(project)}
              removeLabel={t("remove")}
            />
          ))}
        </Section>
      ) : null}
    </div>
  );
}
