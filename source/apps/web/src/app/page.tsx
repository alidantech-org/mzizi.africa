/** Welcome: explains the system and offers ways in. It belongs to no country or place, so it never changes the theme or context. */
import { BookOpen, GitBranch, MapPin, Scale } from "lucide-react";
import Link from "next/link";
import { PlaceFinder, SavedPlaces } from "#/components/home-parts";
import { ResumeCard } from "#/components/resume-card";

const ideas: { href: string; title: string; text: string }[] = [
  { href: "/ke", title: "Kenya", text: "Counties, constituencies and wards, the Constitution and its Swahili translation." },
  { href: "/ke/nairobi", title: "Nairobi", text: "One county: its places, people, institutions and statistics." },
  { href: "/ke/taita-taveta", title: "Taita-Taveta", text: "A smaller county, to see how the same questions look elsewhere." },
  { href: "/za", title: "South Africa", text: "Another country, with its own levels, laws and colours." },
];

const how = [
  { icon: MapPin, title: "Place first", text: "The address says where you are. Everything you read is about that place and nothing else." },
  { icon: BookOpen, title: "Evidence kept", text: "Each fact keeps its source, the time it was observed and how sure we are. Demo figures are always tagged." },
  { icon: Scale, title: "Law and power", text: "Read the law, who holds office and how institutions connect, down to a ward." },
  { icon: GitBranch, title: "Proposals, not truth", text: "Model-assisted output is a proposal to review, never silently accepted as fact." },
];

export default function Home() {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Mzizi</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">Know your place. <em className="text-accent">Then everything about it.</em></h1>
      <p className="mt-4 max-w-2xl text-muted">Mzizi connects African history and present-day knowledge to places, with the evidence behind every claim. Choose a place to begin; the sidebar then follows it.</p>
      <div className="mt-6"><ResumeCard /></div>
      <div className="mt-6"><PlaceFinder /></div>
      <section className="mt-10"><h2 className="mb-4 font-display text-2xl">Try one of these</h2>
        <ul className="grid gap-3 sm:grid-cols-2">{ideas.map((i) => <li key={i.href}><Link href={i.href} className="block rounded-lg border border-line bg-surface p-4 hover:bg-accent-soft"><div className="font-display text-xl">{i.title}</div><p className="mt-1 text-sm text-muted">{i.text}</p></Link></li>)}</ul>
      </section>
      <section className="mt-10"><h2 className="mb-4 font-display text-2xl">Saved places</h2><SavedPlaces /></section>
      <section className="mt-10"><h2 className="mb-4 font-display text-2xl">How it works</h2>
        <ul className="grid gap-3 sm:grid-cols-2">{how.map(({ icon: Icon, title, text }) => <li key={title} className="flex gap-3 rounded-lg border border-line p-4"><Icon size={18} className="mt-0.5 shrink-0 text-accent" /><div><div className="font-medium">{title}</div><p className="mt-1 text-sm text-muted">{text}</p></div></li>)}</ul>
      </section>
    </>
  );
}
