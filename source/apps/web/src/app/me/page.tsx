/** Preferences: everything about how Mzizi looks, sounds and remembers you. Stored in this browser. */
import Link from "next/link";
import { LanguageChoice } from "#/components/language-choice";
import { AudioPanel, LookPanel } from "#/components/prefs-panels";
import { InstallApp } from "#/components/pwa";
import { ResetPrefs } from "#/components/reset-prefs";
import { PageHeader } from "#/components/ui";

const Card = ({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-line bg-surface p-5"><h2 className="font-display text-xl">{title}</h2>{note && <p className="mt-1 text-sm text-muted">{note}</p>}<div className="mt-4">{children}</div></section>
);

export default function Me() {
  return (
    <>
      <PageHeader eyebrow="You" title="Your preferences" actions={<ResetPrefs />}>Theme, sound, language and the places you keep. Stored in this browser only; the home place and language are also cookies so pages can personalise. Nothing is sent to a server in this demo.</PageHeader>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card title="Theme" note="Colours, contrast, text size and display options. Changes apply at once."><LookPanel /></Card>
        <div className="grid gap-4">
          <Card title="Sound" note="Read pages aloud and choose how Mzizi answers."><AudioPanel /></Card>
          <Card title="Language" note="An explicit ?lang= in a link wins and is remembered. Without it, this choice is used. Evidence is not translated by choosing a language."><LanguageChoice /></Card>
          <Card title="Places"><p className="text-sm text-muted">Your home place is set from the Home page and decides your starting area, your region in Compare, and what Home shows first.</p><div className="mt-3 flex flex-wrap gap-4 text-sm font-medium"><Link href="/" className="text-accent hover:underline">Change home place →</Link><Link href="/me/saved" className="text-accent hover:underline">Manage saved places →</Link></div></Card>
          <Card title="App" note="Install Mzizi to open it like an app and read pages you have already visited offline."><InstallApp /></Card>
        </div>
      </div>
    </>
  );
}
