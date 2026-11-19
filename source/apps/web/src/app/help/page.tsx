/** Help: how addresses work and keyboard shortcuts. */
import Link from "next/link";
import { PageHeader } from "#/components/ui";

const rows = [["/ke/nairobi/westlands", "Westlands, within Nairobi, within Kenya."], ["/ke/nairobi/westlands?view=law", "The laws that apply to that same place."], ["/ke/nairobi/westlands?view=finance", "Public finance for that same place."], ["?view=law&view.chapter=4&view.provision=article-43", "A chapter and article inside the law view."], ["?filters.party=UMJ&sort.by=margin&page.no=2", "Filters, sorting and pages in a list."], ["?lang=sw", "An explicit interface language."]];

export default function Help() {
  return (
    <>
      <PageHeader eyebrow="Help" title="How addresses work">The address names a place. The sidebar chooses what to show about it. Changing the subject keeps the place; changing the place keeps the subject.</PageHeader>
      <div className="max-w-3xl space-y-3">
        {rows.map(([u, t]) => <div key={u} className="grid gap-1 rounded-lg border border-line bg-surface p-4 sm:grid-cols-[1.4fr_1fr]"><code className="break-all text-sm text-accent">{u}</code><span className="text-sm text-muted">{t}</span></div>)}
        <div className="rounded-lg border border-line bg-surface p-4 text-sm"><b>Shortcuts.</b> <kbd>/</kbd> search · <kbd>Ctrl</kbd>+<kbd>B</kbd> show or hide the sidebar · drag the sidebar edge to resize.</div>
        <section aria-labelledby="a11y" className="rounded-lg border border-line bg-surface p-5 text-sm">
          <h2 id="a11y" className="font-display text-xl">Accessibility</h2>
          <p className="mt-2 text-muted">Mzizi is built to work with screen readers, keyboards and assistive settings. The commitments below apply to every page and every new component.</p>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted">
            <li><b className="text-ink">Structure:</b> one heading outline per page, landmarks for navigation, main content and sidebar, and a visible keyboard focus on every control.</li>
            <li><b className="text-ink">Names and descriptions:</b> every icon-only button has an accessible name, every chart and map has a text label, and images carry alternative text.</li>
            <li><b className="text-ink">Dialogs and sheets:</b> they trap focus, close with Escape, return focus where you were, and announce their title.</li>
            <li><b className="text-ink">Colour:</b> meaning is never carried by colour alone; roles and statuses also show a symbol or word. Contrast modes: high contrast, high contrast light, yellow on black and black on yellow.</li>
            <li><b className="text-ink">Text:</b> four text sizes, wider text spacing, underlined links and reduced motion.</li>
            <li><b className="text-ink">Voice:</b> talk to search, read a page or section aloud, and optional spoken responses or hands-free mode. These use the browser&apos;s own speech support.</li>
            <li><b className="text-ink">Tables:</b> data tables use real header cells, and sortable columns report their sort order.</li>
          </ul>
        </section>
        <section aria-labelledby="scroll" className="rounded-lg border border-line bg-surface p-5 text-sm">
          <h2 id="scroll" className="font-display text-xl">Your place on the page</h2>
          <p className="mt-2 text-muted">Switching place, sorting, filtering or changing a tab keeps you where you were reading instead of jumping to the top. The address also records the section you are on (the part after #), so a copied link opens at the same spot, and Back returns to your previous place and position.</p>
        </section>
        <section aria-labelledby="lang" className="rounded-lg border border-line bg-surface p-5 text-sm">
          <h2 id="lang" className="font-display text-xl">Language</h2>
          <p className="mt-2 text-muted">When you change language, everything on the page should be in that language. Anything that is not translated is shown in English and marked as English. A note at the top of the page says what is translated, what is not, and why.</p>
          <p className="mt-2 text-muted">In Kiswahili, the Constitution is shown in the Swahili translation held in our records (an unofficial translation whose review is pending). Provisions without a translation stay in English and say so. The language comes from <code>?lang=</code>, then your saved choice, then English.</p>
        </section>
        <Link href="/ke" className="inline-block text-sm font-medium text-accent">← Back to exploring</Link>
      </div>
    </>
  );
}
