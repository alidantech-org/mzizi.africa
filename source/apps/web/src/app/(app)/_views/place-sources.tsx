/** The publication channels behind Mzizi's data, with their publishers. */
import { BookOpen } from "lucide-react";
import { sourceListSources } from "@mzizi/api-client/actions/source";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";

export default async function PlaceSources() {
  const res = await sourceListSources({ query: { limit: 200, offset: 0 }, options: { caching: { revalidate: 3600, tags: ["sources"] } } });
  const sources = res.body?.sources ?? [];
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Sources" title="Where the data comes from">
        Every figure, name and office links to the citation it came from. These are the channels read so far.
      </PageHeader>
      <Panel id="sources" title="Sources" icon={BookOpen} note={`${sources.length}`}>
        {sources.length === 0 ? (
          <p className="text-sm text-muted">No sources are loaded into the rebuilt database yet.</p>
        ) : (
          <ul className="grid gap-1 text-sm">
            {sources.map((s) => (
              <li key={s.code}>
                {s.label} · <span className="text-muted">{s.publisherNames.find((n) => n.isDefault)?.text ?? s.publisherCode}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
