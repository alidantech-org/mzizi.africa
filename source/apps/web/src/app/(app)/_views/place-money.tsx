/** Money of a place: the projects that touch it and the country's tenders. */
import { FileText, Hammer } from "lucide-react";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import type { PlaceAddress } from "#/lib/server/codes";
import { loadProjects, loadTenders } from "#/lib/server/views/money";
import { loadPlace } from "#/lib/server/views/place-home";
import { formatValue } from "#/app/(app)/_views/text";

export default async function PlaceMoney({ view, address, language }: { view: "finance" | "suppliers"; address: PlaceAddress; language: string }) {
  const { data: place } = await loadPlace(address, language);
  if (!place) return <PageHeader eyebrow="Money" title="This place could not be loaded" />;
  const [projects, tenders] = await Promise.all([loadProjects(place.place.id), loadTenders(place.country.id)]);
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow={view === "finance" ? "Finance" : "Suppliers"} title={place.place.name.text}>
        Projects in this place and the country's tenders, with every bid where it is recorded.
      </PageHeader>
      <Panel id="projects" title="Projects" icon={Hammer} note={`${projects.data?.projects.length ?? 0}`}>
        {(projects.data?.projects.length ?? 0) === 0 ? (
          <p className="text-sm text-muted">No projects are recorded here yet.</p>
        ) : (
          <ul className="grid gap-1 text-sm">
            {projects.data?.projects.map((p) => (
              <li key={p.projectId}>{p.names.find((n) => n.isDefault)?.text ?? p.code}</li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel id="tenders" title="Tenders" icon={FileText} note={`${tenders.data?.tenders.length ?? 0}`}>
        {(tenders.data?.tenders.length ?? 0) === 0 ? (
          <p className="text-sm text-muted">No tenders are recorded for this country yet.</p>
        ) : (
          <ul className="grid gap-1 text-sm">
            {tenders.data?.tenders.map((t) => (
              <li key={t.procurementId} className="flex justify-between gap-4">
                <span>{t.names.find((n) => n.isDefault)?.text ?? t.code}</span>
                <span>
                  {formatValue(t.amount, 0, language)} {t.currencyCode ? `${t.currencyCode} minor units` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
