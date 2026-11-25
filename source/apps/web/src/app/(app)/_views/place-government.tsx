/**
 * Government of a place: leaders (offices and holders), a country's institutions and one institution's offices.
 * Laws, parliament, elections and the power model have API reads but no loaded data yet; they say so.
 */
import { Landmark, Users } from "lucide-react";
import Link from "next/link";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import type { ViewId } from "#/lib/navigation/route";
import { countryCode, type PlaceAddress } from "#/lib/server/codes";
import { loadInstitution, loadInstitutions } from "#/lib/server/views/government";
import { loadPlace } from "#/lib/server/views/place-home";
import { Text } from "#/app/(app)/_views/text";

export default async function PlaceGovernment({
  view,
  address,
  base,
  language,
  code,
}: {
  view: ViewId;
  address: PlaceAddress;
  base: string;
  language: string;
  code?: string;
}) {
  const { data: place } = await loadPlace(address, language);
  if (!place) return <PageHeader eyebrow="Government" title="This place could not be loaded" />;
  if (view === "leaders")
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Leaders" title={place.place.name.text}>
          The offices that serve this place and who holds them now.
        </PageHeader>
        <Panel id="leaders" title="Offices" icon={Users} note={`${place.leaders.length}`}>
          {place.leaders.length === 0 ? (
            <p className="text-sm text-muted">No offices are recorded for this place.</p>
          ) : (
            <ul className="grid gap-2 text-sm">
              {place.leaders.map((l) => (
                <li key={l.office} className="flex justify-between gap-4 border-b border-line py-1">
                  <Text value={l.officeName} />
                  <span>{l.personName ? <Text value={l.personName} /> : <span className="text-muted">not recorded</span>}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  if (view === "institutions" && code) {
    const { data } = await loadInstitution(address.country, code, language);
    if (!data) return <PageHeader eyebrow="Institution" title="This institution could not be loaded" />;
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Institution" title={data.name.text} />
        <Link href={`${base}?view=institutions`} className="text-sm text-accent">
          All institutions
        </Link>
        <Panel id="offices" title="Offices" icon={Users} note={`${data.offices.length}`}>
          <ul className="grid gap-2 text-sm">
            {data.offices.map((o) => (
              <li key={o.office} className="flex justify-between gap-4 border-b border-line py-1">
                <Text value={o.name} />
                <span>{o.holder ? <Text value={o.holder} /> : <span className="text-muted">vacant or not recorded</span>}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }
  if (view === "institutions" || view === "arms") {
    const { data } = await loadInstitutions(place.country.id);
    const institutions = data?.institutions ?? [];
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Government" title={`Institutions of ${place.country.name.text}`} />
        <Panel id="institutions" title="Institutions" icon={Landmark} note={`${institutions.length}`}>
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {institutions.map((i) => (
              <li key={i.code}>
                <Link href={`${base}?view=institutions&view.id=${encodeURIComponent(i.code)}`} className="hover:underline">
                  {i.names.find((n) => n.isDefault)?.text ?? i.code}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }
  return (
    <PageHeader eyebrow="Government" title={`No ${view} data is loaded yet`}>
      The API serves this subject ({countryCode(address.country)}), but the rebuilt database has no rows for it yet.
    </PageHeader>
  );
}
