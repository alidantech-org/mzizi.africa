"use client";
/** Preferences: everything about how Mzizi looks, sounds and remembers you. Kept in cookies in this browser. */
import Link from "#/components/navigation/demo-link";
import type { ReactNode } from "react";
import { copy } from "@mzizi/copy";
import { InstallApp } from "#/components/layout/pwa";
import { LanguageChoice } from "#/components/preferences/language-choice";
import { AppearancePanel } from "#/components/preferences/appearance-panel";
import { AudioPanel, LookPanel } from "#/components/preferences/prefs-panels";
import { ResetPrefs } from "#/components/preferences/reset-prefs";
import { PageHeader } from "#/components/ui/page-header";
import { useCopy } from "#/lib/copy/copy";
import { usePlaceNames } from "#/lib/places/catalogue";
import { usePrefsInit } from "#/lib/preferences/prefs";

const Card = ({ title, note, children }: { title: string; note?: string; children: ReactNode }) => (
  <section className="min-w-0 rounded-lg border border-line bg-surface p-3 sm:p-4">
    <h2 className="truncate font-display text-xl">{title}</h2>
    {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

export default function MeView() {
  const t = useCopy();
  const { home } = usePrefsInit();
  const names = usePlaceNames();
  return (
    <>
      <PageHeader eyebrow={t(copy.pages.eyebrowYou)} title={t(copy.pages.me.title)} actions={<ResetPrefs />}>
        {t(copy.pages.me.intro)}
      </PageHeader>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card title={t(copy.pages.me.theme)} note={t(copy.pages.me.themeNote)}>
          <LookPanel />
        </Card>
        <div className="grid min-w-0 gap-4">
          <Card title={t(copy.preferences.look.title)} note={t(copy.preferences.look.note)}>
            <AppearancePanel />
          </Card>
          <Card title={t(copy.pages.me.sound)} note={t(copy.pages.me.soundNote)}>
            <AudioPanel />
          </Card>
          <Card title={t(copy.pages.me.language)} note={t(copy.pages.me.languageNote)}>
            <LanguageChoice />
          </Card>
          <Card title={t(copy.pages.me.places)} note={t(copy.pages.me.placesNote)}>
            <p className="truncate text-sm">
              {home ? t(copy.pages.me.homeNow, { place: names.nameOf(home) }) : t(copy.pages.me.homeNone)}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
              <Link href="/?setup=1" className="max-w-full truncate text-accent hover:underline">
                {t(copy.pages.me.changeHome)}
              </Link>
              <Link href="/me/saved" className="max-w-full truncate text-accent hover:underline">
                {t(copy.pages.me.manageSaved)}
              </Link>
            </div>
          </Card>
          <Card title={t(copy.pages.me.app)} note={t(copy.pages.me.appNote)}>
            <InstallApp />
          </Card>
        </div>
      </div>
    </>
  );
}
