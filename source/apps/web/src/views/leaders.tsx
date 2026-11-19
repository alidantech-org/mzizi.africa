import { placeName, type ViewProps } from "./types";
/** Leaders: how every seat of government is filled, shown four ways. */
import Link from "next/link";
import { build } from "#/lib/route";
import { Applies } from "#/components/applies";
import { EChart } from "#/components/echart";
import { LeadersViews } from "#/components/leaders-views";
import { PageHeader } from "#/components/ui";
import { branches, flat, tree } from "#/data/government";
import { palette } from "#/lib/palette";

const roleColor = { elected: palette.series[1], nominated: palette.series[3], appointed: palette.series[2], exofficio: palette.muted } as const;
const branchColor = [palette.series[3], palette.series[1], palette.series[2], palette.series[0], palette.series[4]];

export function Leaders({ ctx, place }: ViewProps) {
  const data = branches.map((b, i) => ({
    name: b.label,
    itemStyle: { color: branchColor[i] },
    children: flat(tree[b.id]).filter((o) => o.role || o.seats).map((o) => ({ name: o.name, value: 1, itemStyle: { color: o.role ? roleColor[o.role] : palette.line } })),
  }));
  return (
    <>
      <PageHeader eyebrow={`Leaders · ${placeName(place)}`} title="Who leads, top to bottom">Follow any office to the body it answers to, and see how its holders got there: elected, nominated, appointed, or seated by right of another office.</PageHeader>
      <p className="-mt-4 mb-6 text-sm text-muted">Also: <Link href={build(ctx, { view: "arms" })} className="text-accent hover:underline">how the three arms work together</Link> · <Link href={build(ctx, { view: "power" })} className="text-accent hover:underline">who can elect, nominate and appoint</Link></p>
      <LeadersViews mode={ctx.params["view.mode"]} office={ctx.params["view.office"]} radial={
        <EChart height={560} width={560} label="Sunburst of branches of government and their offices" option={{
          series: [{ type: "sunburst", radius: ["14%", "98%"], sort: undefined, data, label: { rotate: "radial", fontSize: 10, color: palette.ink, minAngle: 6 }, itemStyle: { borderColor: palette.surface, borderWidth: 2, borderRadius: 4 }, levels: [{}, { r0: "14%", r: "40%", label: { rotate: 0, fontSize: 12, color: palette.surface } }, { r0: "42%", r: "98%" }] }],
        }} />
      } />
      <div className="mt-8"><Applies place={place} ctx={ctx} /></div>
    </>
  );
}
