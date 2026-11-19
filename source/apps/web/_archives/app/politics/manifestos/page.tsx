/** `/politics/manifestos`: manifestos by election. A server page; empty until a manifesto document is added, and it says so. */
import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";
import { date } from "#/_archives/lib/site/format";
import { T } from "#/_archives/lib/site/i18n";
import { manifestos } from "#/_archives/lib/site/ledger";

export const dynamic = "force-dynamic";

export default function ManifestosRoute() {
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Politics", href: "/politics/parties" },
          { label: "Manifestos" },
        ]}
      />
      <p className="kicker">
        <T>{"Politics"}</T>
      </p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        <T>{"Manifestos"}</T>
      </h1>
      <Loaded read={manifestos}>
        {({ manifestos: list, gaps }) => (
          <>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {list.map((m) => (
                <li key={m.code} className="glass card">
                  <p className="kicker">{m.election ?? "Election"}</p>
                  <h2 className="font-display text-xl">{m.party ?? m.code}</h2>
                  <p className="text-sm text-content-muted">
                    {m.publishedOn ? `Published ${date(m.publishedOn)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
            <Gaps items={gaps} topic="manifestos" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
