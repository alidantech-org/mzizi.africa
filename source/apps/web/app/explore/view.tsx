"use client";

/** Discoverable destinations into the existing public application, with short explanations. */
import Link from "next/link";
import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
interface Destination {
  href: string;
  title: string;
  description: string;
  icon: IconName;
}
const destinations: readonly Destination[] = [
  {
    href: "/browse",
    title: "Places",
    description: "Explore boundaries and the places within them.",
    icon: "pin",
  },
  {
    href: "/leaders",
    title: "Leadership tree",
    description:
      "Follow current holders, institutions and their relationships.",
    icon: "tree",
  },
  {
    href: "/institutions",
    title: "Institutions",
    description:
      "Understand responsibilities, leadership and legal foundations.",
    icon: "parliament",
  },
  {
    href: "/constitution",
    title: "The Constitution",
    description: "Read chapters, articles and their connected legal context.",
    icon: "book",
  },
  {
    href: "/statistics",
    title: "Statistics",
    description: "Explore population, indicators, maps and change over time.",
    icon: "chart",
  },
  {
    href: "/compare",
    title: "Compare places",
    description: "Find nearby peers and compare recorded measures.",
    icon: "compare",
  },
  {
    href: "/elections",
    title: "Elections",
    description: "Explore contests, results and representation.",
    icon: "vote",
  },
  {
    href: "/parliament",
    title: "Parliament",
    description: "Follow motions, recorded votes and contributions.",
    icon: "parliament",
  },
  {
    href: "/civic",
    title: "Money & projects",
    description: "Find public projects and available spending records.",
    icon: "build",
  },
  {
    href: "/tenders",
    title: "Tenders",
    description: "Explore public buying notices and contract records.",
    icon: "document",
  },
  {
    href: "/parties",
    title: "Parties",
    description: "Explore political organisations and recorded activity.",
    icon: "flag",
  },
  {
    href: "/content",
    title: "Knowledge library",
    description: "Read explanatory articles and background.",
    icon: "book",
  },
  {
    href: "/source-browse",
    title: "Sources",
    description: "Inspect the evidence behind the records.",
    icon: "book",
  },
];
export default function ExploreRoute() {
  const { tr } = useLanguage();
  return (
    <PageFrame>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Explore" }]}
      />
      <p className="kicker">{tr("Explore")}</p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        {tr("Follow the connections")}
      </h1>
      <p className="mt-3 max-w-2xl text-content-muted">
        {tr("Start with a place, a person, an institution or a source.")}
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((item) => (
          <li key={item.href}>
            <Link
              className="glass card card-lift flex h-full gap-4"
              href={item.href}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-sunken text-clay">
                <Icon name={item.icon} size={25} />
              </span>
              <span>
                <strong className="block font-display text-xl">
                  {tr(item.title)}
                </strong>
                <span className="mt-2 block text-sm leading-relaxed text-content-muted">
                  {tr(item.description)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
