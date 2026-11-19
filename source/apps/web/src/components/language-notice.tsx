/** Shown at the top of every page when a language other than English is active: what is translated, what is not, and why. */
import { Languages } from "lucide-react";
import { LANGUAGES } from "#/data/languages";
import { VIEWS, type ViewId } from "#/lib/route";

const translated: Partial<Record<ViewId, string>> = { law: "the Constitution text (URAIA translation, unofficial, review pending)" };

export function LanguageNotice({ lang, view }: { lang: string; view: ViewId }) {
  if (lang === "en") return null;
  const name = LANGUAGES.find((l) => l.code === lang)?.name ?? lang;
  const here = translated[view];
  return (
    <div role="note" className="mb-6 flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
      <Languages size={16} className="mt-0.5 shrink-0 text-accent" />
      <p className="text-muted"><b className="text-ink">{name} is selected.</b> {here ? <>On this page, {here} is shown in {name} where a translation exists; the rest of the page is in English.</> : <>Nothing on the {VIEWS[view].label} page has a {name} translation yet, so it is shown in English.</>} Missing parts are in English because no translation has been loaded for them.</p>
    </div>
  );
}
