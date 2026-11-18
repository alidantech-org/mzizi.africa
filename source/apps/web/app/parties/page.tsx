"use client";

/** Route `/parties`: registered parties ranked by votes, members, office holders and the public money they receive. */
import Link from "next/link";

import { AsyncView } from "#/components/site/async-view.tsx";
import { Breadcrumbs, Gaps, PageFrame } from "#/components/site/ui/primitives.tsx";
import { ksh, n, short } from "#/lib/site/format.ts";
import { parties } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

export default function PartiesRoute() {
  const loaded = useAsync(() => parties(), "parties");
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Parties" }]} />
      <p className="kicker">Political parties</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Parties, ranked</h1>
      <AsyncView loaded={loaded}>
        {({ parties: list, gaps }) => {
          const topVotes = Math.max(...list.map((p) => p.votes2022), 1);
          return (
            <>
              <div className="glass card mt-6 overflow-x-auto">
                <table className="table-clean">
                  <thead><tr><th>#</th><th>Party</th><th>Votes, 2022</th><th>Members</th><th>Office holders</th><th>Party fund 2026/27</th></tr></thead>
                  <tbody>{list.map((p, i) => (
                    <tr key={p.code}>
                      <td className="num text-content-muted">{i + 1}</td>
                      <td><Link className="font-semibold underline-offset-2 hover:underline" href={`/parties/${p.code}`}>{p.name}</Link></td>
                      <td className="min-w-48"><div className="bar-track h-2"><div className="bar-fill h-full" style={{ width: `${(p.votes2022 / topVotes) * 100}%` }} /></div><span className="num text-xs text-content-muted">{short(p.votes2022)}</span></td>
                      <td className="num">{n(p.members)}</td><td className="num">{n(p.officeHolders)}</td><td className="num">{ksh(p.fundAllocationKes)}</td>
                    </tr>))}</tbody>
                </table>
              </div>
              <Gaps items={gaps} topic="party data" />
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
