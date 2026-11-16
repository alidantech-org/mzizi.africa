/** What the root page shows: the API's and the engine's own `/` reports, fetched on the server for every request. */

export type ServiceState = 'ok' | 'degraded' | 'unavailable';

export interface ContractInfo {
  name: string;
  group: string;
  role: string;
  summary: string;
}

export interface EndpointInfo {
  method: string;
  path: string;
  feature?: string;
  handler: string;
  contract?: ContractInfo | null;
}

export interface FeatureInfo {
  id: string;
  name: string;
  endpoints: number;
}

export interface CapabilityInfo {
  name: string;
  version: string;
  package: string;
  description: string;
  cpu_bound: boolean;
  requires: string[];
}

export interface ServiceOverview {
  service: string;
  name: string;
  status: string;
  version: string;
  uptime_seconds?: number;
  uptimeSeconds?: number;
  features: FeatureInfo[];
  endpoints: EndpointInfo[];
  capabilities?: CapabilityInfo[];
  dependencies?: Record<string, { status: string; latencyMs?: number; detail?: string }>;
}

export type Report = { state: 'ok'; url: string; data: ServiceOverview } | { state: 'unavailable'; url: string; reason: string };

async function load(url: string, headers: HeadersInit = {}): Promise<Report> {
  try {
    const response = await fetch(`${url}/`, { cache: 'no-store', headers, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { state: 'unavailable', url, reason: `answered ${response.status}` };
    return { state: 'ok', url, data: (await response.json()) as ServiceOverview };
  } catch (problem) {
    return { state: 'unavailable', url, reason: problem instanceof Error ? problem.message : 'no answer' };
  }
}

export async function loadOverview(): Promise<{ api: Report; engine: Report }> {
  const api = process.env.REVIEW_API_URL ?? 'http://127.0.0.1:3000';
  const engine = process.env.ENGINE_URL ?? 'http://127.0.0.1:8760';
  const [apiReport, engineReport] = await Promise.all([load(api), load(engine)]);
  return { api: apiReport, engine: engineReport };
}
