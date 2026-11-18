/** Route `/explore`: topics, each with the sections that answer it and a fact to start from. A server page; the facts come from the API. */
import Link from "next/link";

import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { FactsCarousel } from "#/components/site/facts-carousel.tsx";
import { PageFrame } from "#/components/site/ui/primitives.tsx";
import { T } from "#/lib/site/i18n.tsx";
import { facts } from "#/lib/site/insights.ts";

interface Destination { readonly href: string; readonly title: string; readonly description: string; readonly icon: IconName }
interface Topic { readonly id: string; readonly title: string; readonly question: string; readonly items: readonly Destination[] }

/** Topics group the sections by the question a visitor is asking, not by how the system is organised. */
const TOPICS: readonly Topic[] = [
  { id: "who", title: "Who leads", question: "Who represents me, and what have they done?", items: [
    { href: "/leaders", title: "Leadership tree", description: "Follow current holders from the nation down to the ward.", icon: "tree" },
    { href: "/parties", title: "Parties and coalitions", description: "Votes, members, office holders and the money parties receive.", icon: "flag" },
    { href: "/elections", title: "Elections", description: "Contests, results, turnout and the road to the next one.", icon: "vote" },
  ] },
  { id: "law", title: "Law and government", question: "Who decides, and on what authority?", items: [
    { href: "/institutions", title: "Institutions", description: "Responsibilities, leadership and legal foundations.", icon: "parliament" },
    { href: "/constitution", title: "The Constitution", description: "Chapters, articles and their connected legal context.", icon: "book" },
    { href: "/parliament", title: "Parliament", description: "Motions, recorded votes and contributions.", icon: "parliament" },
  ] },
  { id: "money", title: "Public money", question: "Where does the money go, and what was built with it?", items: [
    { href: "/civic", title: "Finance and projects", description: "Public projects and the spending records behind them.", icon: "build" },
    { href: "/tenders", title: "Procurement", description: "Public buying notices, bids and contract awards.", icon: "document" },
    { href: "/infrastructure", title: "Infrastructure", description: "Schools, hospitals, offices and polling stations on a map.", icon: "pin" },
  ] },
  { id: "places", title: "Places and numbers", question: "How does my area compare?", items: [
    { href: "/browse", title: "Places", description: "Boundaries and the places within them.", icon: "pin" },
    { href: "/statistics", title: "Statistics", description: "Population, indicators, maps and change over time.", icon: "chart" },
    { href: "/compare", title: "Compare places", description: "Find nearby peers and compare recorded measures.", icon: "compare" },
    { href: "/leaderboards", title: "Rankings", description: "Which places lead and which lag on a measure.", icon: "trophy" },
  ] },
  { id: "time", title: "Time and evidence", question: "What is coming, and how do we know?", items: [
    { href: "/calendar", title: "Calendar", description: "Public holidays, sittings and the election timetable.", icon: "calendar" },
    { href: "/content", title: "Knowledge library", description: "Explanatory articles and background.", icon: "book" },
    { href: "/source-browse", title: "Sources", description: "Inspect the evidence behind the records.", icon: "book" },
  ] },
];

export default function ExploreRoute() {
  return (
    <PageFrame wide>
      <p className="kicker"><T>Explore</T></p>
      <h1 className="hero-title text-3xl sm:text-4xl"><T>Follow the connections</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>Start with a question. Each topic leads to the sections that answer it.</T></p>
      <Loaded read={() => facts()}>
        {(d) => (d.facts.length > 0 ? <div className="mt-6 max-w-2xl"><FactsCarousel facts={d.facts} scopeName="" /></div> : null)}
      </Loaded>
      <div className="mt-8 space-y-10">
        {TOPICS.map((topic) => (
          <section key={topic.id} aria-labelledby={`topic-${topic.id}`}>
            <h2 id={`topic-${topic.id}`} className="text-xl font-semibold"><T>{topic.title}</T></h2>
            <p className="mt-0.5 text-sm text-content-muted"><T>{topic.question}</T></p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topic.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="glass card card-lift flex h-full items-start gap-3.5 !p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-sunken text-clay"><Icon name={item.icon} size={20} /></span>
                    <span className="min-w-0">
                      <strong className="block text-[0.95rem] font-semibold"><T>{item.title}</T></strong>
                      <span className="mt-1 block text-sm leading-relaxed text-content-muted"><T>{item.description}</T></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageFrame>
  );
}
