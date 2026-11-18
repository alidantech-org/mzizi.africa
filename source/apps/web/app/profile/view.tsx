"use client";

/** Device preferences and saved regions, sharing the same stores used throughout the public site. */
import Link from "next/link";
import { LanguageSwitcher } from "#/components/site/language-switcher.tsx";
import { ThemeToggle } from "#/components/site/theme-toggle.tsx";
import { PlacePicker } from "#/components/site/place-picker.tsx";
import { Empty } from "#/components/site/governance/shared.tsx";
import {
  Breadcrumbs,
  PageFrame,
  Section,
} from "#/components/site/ui/primitives.tsx";
import { useSaved } from "#/lib/site/saved.tsx";

export default function ProfileRoute() {
  const saved = useSaved();
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile and preferences" },
        ]}
      />
      <p className="kicker">Your space</p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        Profile and preferences
      </h1>
      <p className="mt-3 max-w-2xl text-content-muted">
        Your choices are stored on this browser. No account is required.
      </p>
      <Section title="Preferences">
        <div className="divide-y divide-[var(--border-default)]">
          <div className="flex items-center justify-between gap-4 py-5">
            <div>
              <h3 className="font-semibold">Language</h3>
              <p className="mt-1 text-sm text-content-muted">
                English or Kiswahili. Missing translations retain the available
                wording.
              </p>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between gap-4 py-5">
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="mt-1 text-sm text-content-muted">
                Switch between light, dark and device colours.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </Section>
      <Section
        title="Your saved regions"
        action={
          <Link className="btn btn-ghost" href="/browse">
            Find and save a place →
          </Link>
        }
      >
        {saved.places.length === 0 ? (
          <Empty title="No saved places yet">
            Find a place, open its profile and save it to keep it here.
          </Empty>
        ) : (
          <ul className="divide-y divide-[var(--border-default)]">
            {saved.places.map((place) => (
              <li
                key={place.id}
                className="flex flex-wrap items-center justify-between gap-3 py-5"
              >
                <Link href={`/place-profile?featureId=${place.id}`}>
                  <strong className="block">{place.name}</strong>
                  <span className="text-sm text-content-muted">
                    {place.kind}
                  </span>
                </Link>
                <div className="flex gap-2">
                  <Link
                    className="btn btn-ghost"
                    href={`/leaders?place=${place.id}`}
                  >
                    Leadership tree →
                  </Link>
                  <Link
                    className="btn btn-ghost"
                    href={`/compare?place=${place.id}`}
                  >
                    Compare →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 max-w-xl">
          <PlacePicker base="/leaders" />
        </div>
      </Section>
      <Section title="Keep exploring">
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/saved">
            All saved places, leaders and projects →
          </Link>
          <Link className="btn btn-ghost" href="/source-browse">
            Data sources →
          </Link>
        </div>
        <p className="mt-4 text-sm text-content-muted">
          Saved items and language/theme preferences stay on this device.
          Missing evidence and development records are labelled in the pages
          that use them.
        </p>
      </Section>
    </PageFrame>
  );
}
