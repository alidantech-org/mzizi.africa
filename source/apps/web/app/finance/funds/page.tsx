/** `/finance/funds`: funds, who manages them, where they apply and how much money moved through them. A server page. */
import Link from "next/link";

import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame } from "#/components/site/ui/primitives.tsx";
import { n } from "#/lib/site/format.ts";
import { T } from "#/lib/site/i18n.tsx";
import { funds } from "#/lib/site/ledger.ts";
import { placeAt } from "#/lib/site/links.ts";

export const dynamic = "force-dynamic";

export default function FundsRoute() {
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Funds" }]} />
      <p className="kicker"><T>{"Public money"}</T></p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Funds"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"Money set aside for a purpose or a place, who looks after it, and the flows recorded against it."}</T></p>
      <Loaded read={() => funds()}>
        {({ funds: list, total, gaps }) => (
          <>
            {list.length > 0 ? (
              <div className="glass card mt-6 overflow-x-auto">
                <table className="table-clean">
                  <thead><tr><th>Manager</th><th>Kind</th><th>Applies to</th><th>Money flows</th></tr></thead>
                  <tbody>{list.map((f) => (
                    <tr key={f.code}>
                      <td className="font-semibold">{f.manager ?? f.code}</td><td>{f.kind}</td>
                      <td>{f.place ? <Link className="underline" href={placeAt(f.path, "finance")}>{f.place}</Link> : "—"}</td>
                      <td className="num">{n(f.flows)}</td>
                    </tr>))}</tbody>
                </table>
              </div>
            ) : null}
            <p className="mt-3 text-xs text-content-muted">Showing {n(list.length)} of {n(total)}.</p>
            <Gaps items={gaps} topic="funds" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
