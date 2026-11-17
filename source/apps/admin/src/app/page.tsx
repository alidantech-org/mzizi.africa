import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadOverview, type Report, type ServiceOverview } from '@/lib/system/overview';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mzizi Africa',
  description: 'Live status of the Mzizi API and research engine, with every endpoint, feature and capability.',
};

const METHOD_STYLE: Record<string, string> = {
  GET: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400',
  POST: 'bg-blue-600/15 text-blue-700 dark:text-blue-400',
  PUT: 'bg-amber-600/15 text-amber-700 dark:text-amber-400',
  PATCH: 'bg-amber-600/15 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-red-600/15 text-red-700 dark:text-red-400',
};

function Status({ report }: { report: Report }) {
  const ok = report.state === 'ok' && report.data.status === 'ok';
  const text = report.state === 'unavailable' ? 'Unavailable' : ok ? 'Healthy' : 'Degraded';
  return <Badge variant={ok ? 'default' : 'destructive'}>{text}</Badge>;
}

function uptime(data: ServiceOverview): string {
  const seconds = data.uptimeSeconds ?? data.uptime_seconds ?? 0;
  if (seconds < 120) return `${seconds}s`;
  if (seconds < 7200) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function Endpoints({ data }: { data: ServiceOverview }) {
  return (
    <div className="divide-y rounded-md border">
      {data.endpoints.map((endpoint) => (
        <div key={`${endpoint.method} ${endpoint.path}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2 text-sm">
          <span
            className={`w-16 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-xs ${METHOD_STYLE[endpoint.method] ?? 'bg-muted'}`}
          >
            {endpoint.method}
          </span>
          <code className="font-mono">{endpoint.path}</code>
          <span className="text-muted-foreground">{endpoint.contract?.summary ?? endpoint.handler}</span>
        </div>
      ))}
    </div>
  );
}

function Service({ title, report }: { title: string; report: Report }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <Status report={report} />
        </div>
        <CardDescription className="font-mono">{report.url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {report.state === 'unavailable' ? (
          <p className="text-sm text-muted-foreground">
            Not answering ({report.reason}). Start it with <code>bun dev</code>.
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">{report.data.version}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Uptime</dt>
                <dd className="font-medium">{uptime(report.data)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Endpoints</dt>
                <dd className="font-medium">{report.data.endpoints.length}</dd>
              </div>
            </dl>
            {report.data.dependencies && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(report.data.dependencies).map(([name, dependency]) => (
                  <Badge key={name} variant={dependency.status === 'ok' ? 'secondary' : 'destructive'}>
                    {name}: {dependency.status}
                    {dependency.latencyMs !== undefined && ` · ${dependency.latencyMs}ms`}
                  </Badge>
                ))}
              </div>
            )}
            <section>
              <h3 className="mb-2 text-sm font-semibold">Features</h3>
              <div className="flex flex-wrap gap-2">
                {report.data.features.map((feature) => (
                  <Badge key={feature.id} variant="outline">
                    {feature.name} · {feature.endpoints}
                  </Badge>
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-sm font-semibold">Endpoints</h3>
              <Endpoints data={report.data} />
            </section>
            {report.data.capabilities && (
              <section>
                <h3 className="mb-2 text-sm font-semibold">Capabilities ({report.data.capabilities.length})</h3>
                <div className="max-h-96 divide-y overflow-auto rounded-md border">
                  {report.data.capabilities.map((capability) => (
                    <div key={capability.name} className="px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="font-mono font-medium">{capability.name}</code>
                        <Badge variant="outline">{capability.package}</Badge>
                        {capability.requires.map((need) => (
                          <Badge key={need} variant="secondary">
                            {need}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground">{capability.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const { api, engine } = await loadOverview();
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mzizi Africa</h1>
        <p className="max-w-2xl text-muted-foreground">
          Research and connect African historical and present-day knowledge, keeping evidence, provenance, time, place and uncertainty. This
          page reads the live reports of the product API and the research engine.
        </p>
        <nav className="flex gap-4 text-sm">
          <Link className="underline underline-offset-4" href="/review">
            Review
          </Link>
          <Link className="underline underline-offset-4" href="/admin">
            Admin
          </Link>
        </nav>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Service title="Product API" report={api} />
        <Service title="Research engine" report={engine} />
      </div>
    </main>
  );
}
