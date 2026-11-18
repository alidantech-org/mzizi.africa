"use client";

/** Constitution overview and actual legal provisions are delivered through the content operation. */
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AsyncView } from "#/components/site/async-view.tsx";
import {
  ContentArticle,
  ContentLinks,
  Empty,
} from "#/components/site/governance/shared.tsx";
import {
  Breadcrumbs,
  Gaps,
  Loading,
  PageFrame,
  Section,
} from "#/components/site/ui/primitives.tsx";
import { content } from "#/lib/site/governance/reads.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";
function Body() {
  const { language } = useLanguage();
  const provision = useSearchParams().get("provision");
  const loaded = useAsync(
    () =>
      content({
        slug: provision ? `legal/${provision}` : "constitution/overview",
        languageCode: language,
      }),
    `constitution:${language}:${provision}`,
  );
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "The Constitution", href: "/constitution" },
          ...(provision ? [{ label: "Legal provision" }] : []),
        ]}
      />
      <p className="kicker">Legal foundations</p>
      <h1 className="hero-title text-4xl sm:text-5xl">The Constitution</h1>
      <p className="mt-3 mb-7 max-w-3xl text-content-muted">
        Read the available legal text and follow its connections to
        institutions, leaders and places. Missing provisions and unreviewed
        explanations remain visible.
      </p>
      <AsyncView loaded={loaded}>
        {(d) => (
          <>
            {d.content ? (
              <>
                <h2 className="mb-5 font-display text-2xl">
                  {d.content.title}
                </h2>
                <ContentArticle item={d.content} />
              </>
            ) : (
              <Empty title="Constitution content not available">
                The legal text or explanatory overview has not been loaded.
              </Empty>
            )}
            {d.related.length > 0 ? (
              <Section title="Chapters and related reading">
                <ContentLinks items={d.related} />
              </Section>
            ) : null}
            <Gaps items={d.gaps} topic="Constitution" />
          </>
        )}
      </AsyncView>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/institutions" className="btn btn-primary">
          Explore institutions →
        </Link>
        <Link href="/content" className="btn btn-ghost">
          All explanatory content →
        </Link>
      </div>
    </PageFrame>
  );
}
export default function ConstitutionRoute() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <Loading />
        </PageFrame>
      }
    >
      <Body />
    </Suspense>
  );
}
