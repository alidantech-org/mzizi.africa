import { placeName, type ViewProps } from "#demo/_view/shared/types";
/** Who can elect, nominate and appoint whom: how a seat gets filled. */
import { Fragment } from "react";
import { Cite } from "#demo/_view/law/components/cite";
import { PageHeader, RoleBadge } from "#demo/_components/ui/primitives";

const chains = [
  {
    office: "Cabinet Secretary",
    removal: "The President, or the National Assembly by vote",
    steps: [
      ["Nominates", "President"],
      ["Vets", "National Assembly committee"],
      ["Approves", "National Assembly"],
      ["Appoints", "President"],
    ],
  },
  {
    office: "Chief Justice",
    removal: "A tribunal, on petition to the President",
    steps: [
      ["Recommends", "Judicial Service Commission"],
      ["Nominates", "President"],
      ["Approves", "National Assembly"],
      ["Appoints", "President"],
    ],
  },
  {
    office: "Member of the IEBC",
    removal: "A tribunal (Article 251)",
    steps: [
      ["Recruits", "Selection panel"],
      ["Nominates", "President"],
      ["Approves", "National Assembly"],
      ["Appoints", "President"],
    ],
  },
  {
    office: "County Executive Committee Member",
    removal: "The Governor",
    steps: [
      ["Nominates", "Governor"],
      ["Vets and approves", "County Assembly"],
      ["Appoints", "Governor"],
    ],
  },
  { office: "Governor", removal: "Impeachment: County Assembly, then Senate", steps: [["Elects", "Voters of the county"]] },
  {
    office: "Nominated member of a House",
    removal: "Ends with the party's term; rules vary",
    steps: [
      ["Nominates", "Political party, by list to the IEBC"],
      ["Seats shared", "By each party's strength"],
    ],
  },
];
const verb: Record<string, string> = { Elects: "bg-c2/15 text-c2", Nominates: "bg-c4/15 text-c4", Appoints: "bg-c3/20 text-ink" };

const reach = [
  ["President", [5, 4, 4, 3, 5]],
  ["National Assembly", [3, 5, 5, 4, 5]],
  ["Chief Justice", [2, 4, 1, 1, 0]],
  ["Governor of a county", [3, 2, 3, 2, 4]],
] as const;
const dims = ["Posts it fills", "Can block others", "Controls money", "Can remove people", "Direct voter mandate"];

export function Power({ ctx, place }: ViewProps) {
  return (
    <>
      <PageHeader eyebrow="Power model" title="Who can elect, nominate and appoint whom">
        Influence starts with formal rights. For each office, see who proposes it, who can block it, who makes it official and who
        can remove the holder. This shows formal powers, not how a person uses them.
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["elected", "Voters decide. No one can overrule the result except by legal process."],
          ["nominated", "Proposes a name. A nominee cannot take the job alone."],
          ["exofficio", "Can block. A power to say no is a power to shape who is chosen."],
          ["appointed", "Makes it official. Often the last step, not the real decision."],
        ].map(([r, t]) => (
          <div key={r} className="rounded-lg border border-line bg-surface p-4">
            <RoleBadge role={r as "elected"} />
            <p className="mt-3 text-sm text-muted">{t}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-4 mt-10 font-display text-2xl">How a seat gets filled</h2>
      <div className="space-y-3">
        {chains.map((c) => (
          <section key={c.office} className="rounded-lg border border-line bg-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl">{c.office}</h3>
              <span className="text-xs text-muted">
                Removal: {c.removal}
                {c.office.includes("IEBC") && (
                  <>
                    {" "}
                    · <Cite article="251" />
                  </>
                )}
                {c.office === "Governor" && (
                  <>
                    {" "}
                    · <Cite article="181" />
                  </>
                )}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-stretch gap-2">
              {c.steps.map(([v, who], i) => (
                <Fragment key={v + who}>
                  {i > 0 && <span className="self-center text-muted">→</span>}
                  <div className="min-w-[150px] flex-1">
                    <span
                      className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-medium ${verb[v] ?? "bg-line text-muted"}`}
                    >
                      {v}
                    </span>
                    <div className="mt-2 rounded-md border border-line bg-paper px-3 py-2 text-sm">{who}</div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        ))}
      </div>
      <h2 className="mb-1 mt-12 font-display text-2xl">Formal reach of an office</h2>
      <p className="mb-4 text-sm text-muted">
        An illustrative 0 to 5 scale per factor. A published method would set these scores; they measure written powers only.
      </p>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface p-4">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">
              <th className="p-3">Office</th>
              {dims.map((d) => (
                <th key={d} className="p-3">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reach.map(([o, v]) => (
              <tr key={o} className="border-t border-line">
                <td className="p-3 font-medium">{o}</td>
                {v.map((n, i) => (
                  <td key={i} className="p-3">
                    <span className="flex gap-1" aria-label={`${n} of 5`}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <span key={k} className={`size-3.5 rounded-full border-2 border-c2 ${k < n ? "bg-c2" : ""}`} />
                      ))}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-lg bg-paper p-5 text-sm text-muted">
        <b className="text-ink">Why this matters.</b> An office with many nominations and few checks has more reach than one with
        fewer. Simplified from the Constitution: confirm each step against the article.
      </div>
    </>
  );
}
