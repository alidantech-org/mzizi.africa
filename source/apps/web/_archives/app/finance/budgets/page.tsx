/** `/finance/budgets`: budgets by fiscal year with their revisions. A server page. */
import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";
import { date, n } from "#/_archives/lib/site/format";
import { T } from "#/_archives/lib/site/i18n";
import { budgets } from "#/_archives/lib/site/ledger";

export const dynamic = "force-dynamic";

export default function BudgetsRoute() {
  return (
    <PageFrame wide>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Finance", href: "/finance" },
          { label: "Budgets" },
        ]}
      />
      <p className="kicker">
        <T>{"Public money"}</T>
      </p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        <T>{"Budgets"}</T>
      </h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        <T>
          {
            "What governments planned to spend each financial year, and each revision released."
          }
        </T>
      </p>
      <Loaded read={budgets}>
        {({ budgets: list, gaps }) => (
          <>
            {list.length > 0 ? (
              <div className="glass card mt-6 overflow-x-auto">
                <table className="table-clean">
                  <thead>
                    <tr>
                      <th>Budget</th>
                      <th>Kind</th>
                      <th>Financial year</th>
                      <th>Revisions</th>
                      <th>Latest release</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((b) => (
                      <tr key={b.code}>
                        <td className="font-semibold">{b.entity ?? b.code}</td>
                        <td>{b.kind}</td>
                        <td>
                          {b.fiscalFrom
                            ? `${date(b.fiscalFrom)} – ${date(b.fiscalTo)}`
                            : "—"}
                        </td>
                        <td className="num">{n(b.revisions)}</td>
                        <td>
                          {b.latestReleasedOn ? date(b.latestReleasedOn) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <Gaps items={gaps} topic="budgets" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
