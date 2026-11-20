import { placeName, type ViewProps } from "#demo/_view/shared/types";
/** Supplier profile: a link graph with sources. Entirely sample data. */
import { DemoTag, PageHeader } from "#demo/_components/ui/primitives";

const nodes = [
  { id: "owner", x: 110, y: 90, t: "Director B", s: "Person · owner", c: "surface" },
  { id: "supplier", x: 400, y: 90, t: "Supplier A Ltd", s: "Company · sample", c: "c2" },
  { id: "tender", x: 690, y: 90, t: "Market rehabilitation", s: "Tender · county", c: "surface" },
  { id: "party", x: 110, y: 270, t: "Party X", s: "Political party", c: "surface" },
  { id: "officer", x: 400, y: 300, t: "Executive Committee Member", s: "Public office · Person C", c: "c4" },
  { id: "dept", x: 690, y: 270, t: "Trade department", s: "Buyer · public body", c: "surface" },
] as const;
const edges = [
  ["owner", "supplier", "Owns 60%", "Company record, official"],
  ["supplier", "tender", "Awarded KSh 120M", "Tender record, official"],
  ["party", "supplier", "Received KSh 5M", "Party return, official"],
  ["officer", "supplier", "Same household, declared", "Declaration, official"],
  ["officer", "dept", "Leads department of", "County record, official"],
] as const;
const timeline = [
  ["Jan", "Director B listed as owner"],
  ["Mar", "KSh 5M gift to Party X, declared"],
  ["May", "Tender published"],
  ["Jun", "One bid received"],
  ["Jul", "Award to Supplier A, 118 days after the gift"],
];
const patterns = [
  ["Owner shares a household with a public officer who oversees the buyer", "Review"],
  ["Company gave to a party within 12 months before an award", "Review"],
  ["Only one bidder", "Review"],
  ["Contract value more than 10% above the estimate", "Not triggered"],
  ["Company registered less than a year before the award", "Not triggered"],
  ["Officer declared the interest and stepped aside", "No record found"],
];

export function Suppliers({ ctx, place }: ViewProps) {
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <>
      <PageHeader eyebrow="Supplier profile" title="Who is behind a supplier">
        See who owns a company, what it wins and whether anyone with power over the buyer is connected. Every link shows its
        source.
      </PageHeader>
      <div className="mb-5 flex items-center gap-3 rounded-lg bg-c3/20 px-5 py-3 text-sm">
        <DemoTag>Sample data</DemoTag>Names and figures are made up to show the design. No real person or company is described.
      </div>
      <div className="rounded-lg bg-paper p-5 text-sm text-muted">
        <b className="text-ink">A link is not proof of wrongdoing.</b> People and companies can have lawful ties. Mzizi shows what
        the records say and lets the people named respond.
      </div>
      <section className="mt-5 rounded-lg border border-line bg-surface p-4 md:p-6">
        <h2 className="mb-3 font-display text-xl">Link graph</h2>
        <svg
          viewBox="0 0 800 380"
          className="w-full"
          role="img"
          aria-label="Graph linking a supplier to its owner, a tender, a party and a public officer"
        >
          {edges.map(([a, b, l, src]) => {
            const A = at(a),
              B = at(b);
            const mx = (A.x + B.x) / 2,
              my = (A.y + B.y) / 2;
            return (
              <g key={a + b}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--muted)" strokeWidth="1.6" />
                <rect x={mx - 62} y={my - 17} width="124" height="34" rx="9" fill="var(--surface)" stroke="var(--line)" />
                <text x={mx} y={my - 2} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ink)">
                  {l}
                </text>
                <text x={mx} y={my + 11} textAnchor="middle" fontSize="9" fill="var(--muted)">
                  {src}
                </text>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x - 85} ${n.y - 27})`}>
              <rect
                width="170"
                height="54"
                rx="12"
                fill={n.c === "surface" ? "var(--surface)" : `color-mix(in srgb, var(--${n.c}) 22%, var(--surface))`}
                stroke={n.c === "surface" ? "var(--ink)" : `var(--${n.c})`}
                strokeWidth="1.8"
              />
              <text x="85" y="24" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">
                {n.t}
              </text>
              <text x="85" y="40" textAnchor="middle" fontSize="10" fill="var(--muted)">
                {n.s}
              </text>
            </g>
          ))}
        </svg>
      </section>
      <h2 className="mb-3 mt-10 font-display text-2xl">Timeline around the award</h2>
      <div className="grid gap-3 sm:grid-cols-5">
        {timeline.map(([m, t], i) => (
          <div key={m} className="border-t-4 pt-3" style={{ borderColor: `var(--${i % 2 ? "c1" : "c2"})` }}>
            <div className="font-display text-lg">{m}</div>
            <p className="mt-1 text-sm text-muted">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-display text-xl">Patterns checked</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {patterns.map(([p, s]) => (
                <tr key={p} className="border-t border-line">
                  <td className="py-3 pr-3">{p}</td>
                  <td className="py-3">
                    <span className={`rounded-md px-2.5 py-1 text-xs ${s === "Review" ? "bg-c3/25" : "bg-line text-muted"}`}>
                      {s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">The same checks run on every supplier and every party, using the same rules.</p>
        </section>
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-display text-xl">Right of reply</h2>
          <p className="mt-3 text-sm text-muted">
            People and companies named here can add a statement, request a correction or show proof of a declared interest. Their
            response appears beside the link.
          </p>
          <h3 className="mt-6 font-medium">How sure is each link?</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li>
              <b className="text-ink">Official record:</b> shown, linked to its source.
            </li>
            <li>
              <b className="text-ink">Reported:</b> shown with a label, not confirmed.
            </li>
            <li>
              <b className="text-ink">Inferred:</b> never shown as fact.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
