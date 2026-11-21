"use client";
/** Help: how addresses work, keyboard shortcuts, accessibility, scroll and language behaviour. */
import Link from "#/components/navigation/demo-link";
import { copy } from "@mzizi/copy";
import { PageHeader } from "#/components/ui/page-header";
import { useCopy } from "#/lib/copy/copy";
import { usePrefsInit } from "#/lib/preferences/prefs";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="rounded-lg border border-line bg-surface p-5 text-sm">
    <h2 id={id} className="font-display text-xl">
      {title}
    </h2>
    {children}
  </section>
);

export default function HelpView() {
  const t = useCopy();
  const { place } = usePrefsInit();
  const example = place ? `/${[place.country, ...place.trail].join("/")}` : "/ke/nairobi";
  const rows: [string, string][] = [
    [example, t(copy.pages.help.rowPlace)],
    [`${example}?view=law`, t(copy.pages.help.rowSubject)],
    [`${example}?view=law&view.entity=instrument&view.id=…`, t(copy.pages.help.rowSelection)],
    ["?filters.…&sort.by=…&page.no=2", t(copy.pages.help.rowList)],
    ["?lang=sw", t(copy.pages.help.rowLang)],
  ];
  const bullets: [string, string][] = [
    [t(copy.pages.help.a11yStructure), t(copy.pages.help.a11yStructureText)],
    [t(copy.pages.help.a11yNames), t(copy.pages.help.a11yNamesText)],
    [t(copy.pages.help.a11yDialogs), t(copy.pages.help.a11yDialogsText)],
    [t(copy.pages.help.a11yColour), t(copy.pages.help.a11yColourText)],
    [t(copy.pages.help.a11yText), t(copy.pages.help.a11yTextText)],
    [t(copy.pages.help.a11yVoice), t(copy.pages.help.a11yVoiceText)],
  ];
  return (
    <>
      <PageHeader eyebrow={t(copy.pages.eyebrowHelp)} title={t(copy.pages.help.title)}>
        {t(copy.pages.help.intro)}
      </PageHeader>
      <div className="max-w-3xl space-y-3">
        {rows.map(([u, text]) => (
          <div key={u} className="grid gap-1 rounded-lg border border-line bg-surface p-4 sm:grid-cols-[1.4fr_1fr]">
            <code className="break-all text-sm text-accent" translate="no">
              {u}
            </code>
            <span className="text-sm text-muted">{text}</span>
          </div>
        ))}
        <div className="rounded-lg border border-line bg-surface p-4 text-sm">
          <b>{t(copy.pages.help.shortcutsLead)}</b> <kbd>/</kbd> {t(copy.pages.help.shortcutSearch)} · <kbd>Ctrl</kbd>+<kbd>B</kbd>{" "}
          {t(copy.pages.help.shortcutSidebar)} · {t(copy.pages.help.shortcutResize)}
        </div>
        <Section id="a11y" title={t(copy.pages.help.a11yTitle)}>
          <p className="mt-2 text-muted">{t(copy.pages.help.a11yIntro)}</p>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted">
            {bullets.map(([lead, text]) => (
              <li key={lead}>
                <b className="text-ink">{lead}</b> {text}
              </li>
            ))}
          </ul>
        </Section>
        <Section id="scroll" title={t(copy.pages.help.scrollTitle)}>
          <p className="mt-2 text-muted">{t(copy.pages.help.scrollText)}</p>
        </Section>
        <Section id="lang" title={t(copy.pages.help.languageTitle)}>
          <p className="mt-2 text-muted">{t(copy.pages.help.languageText)}</p>
        </Section>
        <Link href="/" className="inline-block text-sm font-medium text-accent">
          {t(copy.pages.backToExploring)}
        </Link>
      </div>
    </>
  );
}
