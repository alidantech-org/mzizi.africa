import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DataSource } from "typeorm";

/**
 * Registers the Kenyan statistical publishers, their sites (as `expected`, hostnames as candidate domains) and one
 * `source.documents` row per publication from `fixtures/seed/ke-statistical-catalogue.json` (custom-prepared from manual
 * research). No request is made; every licence is recorded as unassessed. Idempotent: publishers by code, sites by code,
 * documents by (publisher, title). Existing rows are never changed.
 */
interface Publisher { code: string; name: string; kind: string; websiteUrl: string; institution: string | null; siteCode: string; hosts: string[]; role: string }
interface Publication { code: string; publisher: string; title: string; period: string; geographyLevel: string; format: string; route: string; url: string; estimateKind: string; machineRoute: string; note?: string }

const UNASSESSED = "Unassessed (reuse terms not yet checked against the publisher's terms)";

function documentKind(p: Publication): string {
  if (p.code.includes("census")) return "census_report";
  if (/kihbs|kdhs/.test(p.code)) return "survey";
  return "dataset";
}

export async function seedStatisticalCatalogue(db: DataSource, jurisdictionCode = "ke"): Promise<{ publishers: number; sites: number; domains: number; documents: number }> {
  const file = JSON.parse(readFileSync(join(import.meta.dir, "..", "fixtures", "seed", "ke-statistical-catalogue.json"), "utf8")) as { _meta: { label: string }; publishers: Publisher[]; publications: Publication[] };
  const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [jurisdictionCode]);
  if (!jurisdiction) throw new Error(`jurisdiction ${jurisdictionCode} is not seeded`);
  const counts = { publishers: 0, sites: 0, domains: 0, documents: 0 };
  const publisherIds = new Map<string, string>();
  for (const p of file.publishers) {
    let [publisher] = await db.query(`SELECT id FROM source.publishers WHERE code = $1`, [p.code]);
    if (!publisher) {
      const [kind] = await db.query(`SELECT id FROM reference.classifications WHERE code = $1`, [`source/publisher-kind/${p.kind}`]);
      [publisher] = await db.query(`INSERT INTO source.publishers (code, name, kind_id, jurisdiction_id, website_url, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, now(), now(), 1) RETURNING id`, [p.code, p.name, kind.id, p.siteCode.startsWith("ke/") ? jurisdiction.id : null, p.websiteUrl]);
      counts.publishers++;
    }
    publisherIds.set(p.code, publisher.id);
    let [site] = await db.query(`SELECT id FROM website.sites WHERE code = $1`, [p.siteCode]);
    if (!site) {
      [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, description, created_at, updated_at, version) VALUES ($1, $2, 'dataset_catalogue', 'expected', $3, $4, now(), now(), 1) RETURNING id`, [p.siteCode, p.name, p.siteCode.startsWith("ke/") ? jurisdiction.id : null, `Expected statistical publisher site (${file._meta.label}): ${p.role} Hostnames are unverified candidates: ${p.hosts.join(", ")}.`]);
      await db.query(`INSERT INTO website.checks (site_id, kind, outcome, detail, checked_at, created_at, updated_at, version) VALUES ($1, 'reachability', 'degraded', $2, now(), now(), now(), 1)`, [site.id, JSON.stringify({ type: "expected", source: file._meta.label, candidates: p.hosts })]);
      counts.sites++;
    }
    for (const raw of p.hosts) {
      const host = raw.toLowerCase();
      const [exists] = await db.query(`SELECT 1 AS ok FROM website.domains WHERE site_id = $1 AND hostname = $2`, [site.id, host]);
      if (exists) continue;
      const [primary] = await db.query(`SELECT 1 AS ok FROM website.domains WHERE site_id = $1 AND role = 'primary'`, [site.id]);
      const [zone] = await db.query(`SELECT id, suffix FROM website.domain_zones WHERE $1 LIKE '%.' || suffix ORDER BY length(suffix) DESC LIMIT 1`, [host]);
      const isApex = zone ? host.split(".").length === zone.suffix.split(".").length + 1 : null;
      await db.query(
        `INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, status, status_reason, origin, is_apex, zone_id, created_at, updated_at, version) VALUES ($1, $2, 'https', $3, current_date, 'exact', 'candidate', $4, 'seed_research', $5, $6, now(), now(), 1)`,
        [site.id, host, primary ? "alias" : "primary", `Candidate hostname from ${file._meta.label}; not yet probed.`, isApex, zone?.id ?? null],
      );
      counts.domains++;
    }
    if (p.institution) {
      const [institution] = await db.query(`SELECT id FROM governance.institutions WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [p.institution, jurisdiction.id]);
      if (institution) {
        const [linked] = await db.query(`SELECT 1 AS ok FROM website.subjects WHERE site_id = $1 AND target_kind = 'governance.institutions' AND target_id = $2`, [site.id, institution.id]);
        if (!linked) await db.query(`INSERT INTO website.subjects (site_id, target_kind, target_id, relation, created_at, updated_at, version) VALUES ($1, 'governance.institutions', $2, 'serves', now(), now(), 1)`, [site.id, institution.id]);
      }
    }
  }
  for (const p of file.publications) {
    const publisherId = publisherIds.get(p.publisher);
    if (!publisherId) throw new Error(`publication ${p.code} names unknown publisher ${p.publisher}`);
    const [exists] = await db.query(`SELECT 1 AS ok FROM source.documents WHERE publisher_id = $1 AND title = $2`, [publisherId, p.title]);
    if (exists) continue;
    const [kind] = await db.query(`SELECT id FROM reference.classifications WHERE code = $1`, [`source/document-kind/${documentKind(p)}`]);
    const citation = `Catalogue entry ${p.code} (${file._meta.label}). Period: ${p.period}. Geography: ${p.geographyLevel}. Format: ${p.format}. Route: ${p.route}. Machine route: ${p.machineRoute}. Estimate kind: ${p.estimateKind}.${p.note ? ` ${p.note}` : ""}`.slice(0, 1000);
    await db.query(`INSERT INTO source.documents (publisher_id, title, kind_id, url, licence, citation, jurisdiction_id, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now(), 1)`, [publisherId, p.title, kind.id, p.url, UNASSESSED, citation, jurisdiction.id]);
    counts.documents++;
  }
  return counts;
}
