/** Route `/government/institutions`: a searchable directory of public bodies by arm and kind. A server page; the search is a small client leaf. */
import { DirectoryList } from "#/_archives/components/site/directory-list";
import { DevelopmentNote } from "#/_archives/components/site/governance/shared";
import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";
import { institutions } from "#/_archives/lib/site/governance/reads";

export const dynamic = "force-dynamic";

export default function InstitutionsRoute() {
  return (
    <PageFrame>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Institutions" }]}
      />
      <p className="kicker">Public institutions</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Who does what?</h1>
      <p className="mt-3 max-w-2xl text-content-muted">
        Explore public bodies, their responsibilities, leadership and the legal
        foundations recorded for them.
      </p>
      <DevelopmentNote />
      <Loaded read={() => institutions()}>
        {(d) => <DirectoryList d={d} />}
      </Loaded>
    </PageFrame>
  );
}
