/** Route `/government/institutions`: a searchable directory of public bodies by arm and kind. A server page; the search is a small client leaf. */
import { DirectoryList } from "#/components/site/directory-list.tsx";
import { DevelopmentNote } from "#/components/site/governance/shared.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { institutions } from "#/lib/site/governance/reads.ts";

export const dynamic = "force-dynamic";

export default function InstitutionsRoute() {
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Institutions" }]} />
      <p className="kicker">Public institutions</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Who does what?</h1>
      <p className="mt-3 max-w-2xl text-content-muted">Explore public bodies, their responsibilities, leadership and the legal foundations recorded for them.</p>
      <DevelopmentNote />
      <Loaded read={() => institutions()}>{(d) => <DirectoryList d={d} />}</Loaded>
    </PageFrame>
  );
}
