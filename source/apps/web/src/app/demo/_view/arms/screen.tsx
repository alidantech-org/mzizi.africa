import { placeName, type ViewProps } from "#demo/_view/shared/types";
/** The three arms of government and how each checks the others. */
import { Cite } from "#demo/_view/law/components/cite";
import { PageHeader, RoleBadge } from "#demo/_components/ui/primitives";
import { tree } from "#demo/_data/government";

const checks = [
  [
    "1",
    "Legislature checks Executive",
    "Approves the budget, vets Cabinet Secretaries and other nominees, questions ministers, and can impeach the President (see Article 145).",
    "c2",
  ],
  [
    "2",
    "Executive checks Legislature",
    "The President signs Bills into law or sends them back. The Executive proposes the budget.",
    "c4",
  ],
  ["3", "Judiciary checks Executive", "Courts review government decisions and can declare them unconstitutional.", "c3"],
  [
    "4",
    "Executive shapes Judiciary",
    "The President appoints judges on the recommendation of the Judicial Service Commission.",
    "c4",
  ],
  ["5", "Judiciary checks Legislature", "Courts can strike down laws that conflict with the Constitution.", "c3"],
  [
    "6",
    "Legislature shapes Judiciary",
    "Parliament passes the laws judges apply and approves the money the Judiciary receives.",
    "c2",
  ],
] as const;

const Node = ({ x, y, title, sub, c }: { x: number; y: number; title: string; sub: string; c: string }) => (
  <g transform={`translate(${x - 120} ${y - 30})`}>
    <rect width="240" height="60" rx="14" fill={`var(--${c})`} />
    <text x="120" y="26" textAnchor="middle" fill="var(--paper)" fontSize="16" style={{ fontFamily: "var(--font-fraunces)" }}>
      {title}
    </text>
    <text x="120" y="45" textAnchor="middle" fill="var(--paper)" fontSize="10.5" opacity=".85">
      {sub}
    </text>
  </g>
);
const Arrow = ({ x1, y1, x2, y2, n, c }: { x1: number; y1: number; x2: number; y2: number; n: string; c: string }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`var(--${c})`} strokeWidth="2.5" markerEnd={`url(#m-${c})`} />
    <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="11" fill="var(--surface)" stroke={`var(--${c})`} strokeWidth="2" />
    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--ink)" fontWeight="600">
      {n}
    </text>
  </g>
);

export function Arms({ ctx, place }: ViewProps) {
  return (
    <>
      <PageHeader eyebrow="The three arms" title="How the three arms work together">
        Kenya divides power so no one arm rules alone. Each arm can check the others. Numbers on the arrows match the explanations
        below.
      </PageHeader>
      <div className="rounded-lg border border-line bg-surface p-4 md:p-8">
        <svg
          viewBox="0 0 760 380"
          role="img"
          aria-label="Diagram of how the Executive, Legislature and Judiciary check each other"
          className="mx-auto w-full max-w-3xl"
        >
          <defs>
            {["c2", "c3", "c4"].map((c) => (
              <marker key={c} id={`m-${c}`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M0 0L9 4.5L0 9z" fill={`var(--${c})`} />
              </marker>
            ))}
          </defs>
          <Arrow x1={320} y1={110} x2={170} y2={290} n="1" c="c2" />
          <Arrow x1={210} y1={285} x2={355} y2={112} n="2" c="c4" />
          <Arrow x1={560} y1={290} x2={410} y2={112} n="3" c="c3" />
          <Arrow x1={440} y1={110} x2={590} y2={290} n="4" c="c4" />
          <Arrow x1={540} y1={330} x2={250} y2={330} n="5" c="c3" />
          <Arrow x1={250} y1={345} x2={540} y2={345} n="6" c="c2" />
          <Node x={380} y={60} title="Executive" sub="President leads the national government" c="c4" />
          <Node x={130} y={320} title="Legislature" sub="Parliament: National Assembly and Senate" c="c2" />
          <Node x={630} y={320} title="Judiciary" sub="Courts led by the Chief Justice" c="c3" />
        </svg>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {checks.map(([n, t, d, c]) => (
          <div key={n} className="flex gap-4 rounded-lg border border-line bg-surface p-5">
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold"
              style={{ borderColor: `var(--${c})` }}
            >
              {n}
            </span>
            <div>
              <h3 className="font-medium">{t}</h3>
              <p className="mt-1 text-sm text-muted">
                {d}
                {n === "1" && (
                  <>
                    {" "}
                    <Cite article="145" />
                  </>
                )}
                {n === "4" && (
                  <>
                    {" "}
                    <Cite article="166" />
                  </>
                )}
                {n === "5" && (
                  <>
                    {" "}
                    <Cite article="165" />
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mb-4 mt-12 font-display text-2xl">Who is at the top of each arm</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            ["Executive", "c4", tree.executive.slice(0, 4)],
            ["Legislature", "c2", [...tree.parliament.flatMap((p) => p.children ?? []).filter((o) => o.id.includes("speaker"))]],
            ["Judiciary", "c3", tree.judiciary],
          ] as const
        ).map(([name, c, list]) => (
          <section key={name} className="overflow-hidden rounded-lg border border-line bg-surface">
            <h3 className="px-5 py-3 font-display text-lg text-paper" style={{ background: `var(--${c})` }}>
              {name}
            </h3>
            <ul className="divide-y divide-line">
              {list.map((o) => (
                <li key={o.id} className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <div className="text-sm font-medium">{o.name}</div>
                    <div className="text-xs text-muted">{o.note}</div>
                  </div>
                  {o.role && <RoleBadge role={o.role} />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">
        Summaries are in plain words and simplified. Read the full articles in the Constitution before relying on them.
      </p>
    </>
  );
}
