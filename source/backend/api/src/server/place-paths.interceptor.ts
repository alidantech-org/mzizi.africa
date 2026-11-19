/**
 * Gives every place in a response its clean address. Any object that carries a `featureId` (a crumb, a child, a ranked row,
 * a search hit) leaves the API with a `path` (`nairobi/westlands`) taken from the slug registry, so clients link places by
 * their address and never by id. Registered once in `main.ts`; recorded as a Dryv gap (response enrichment).
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Observable, from, switchMap } from "rxjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function collect(value: unknown, into: Record<string, unknown>[], depth = 0): void {
  if (depth > 12 || value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collect(item, into, depth + 1);
    return;
  }
  const record = value as Record<string, unknown>;
  const place = (typeof record.featureId === "string" && record.featureId) || (typeof record.unit_id === "string" && record.unit_id) || (typeof record.unitId === "string" && record.unitId) || "";
  if (UUID.test(place) && (record.path === undefined || Array.isArray(record.path)) && record.unit_path === undefined && record.unitPath === undefined) into.push(record);
  for (const child of Object.values(record)) collect(child, into, depth + 1);
}

@Injectable()
export class PlacePathsInterceptor implements NestInterceptor {
  constructor(private readonly db: DataSource) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(switchMap((body) => from(this.enrich(body))));
  }

  private async enrich(body: unknown): Promise<unknown> {
    const records: Record<string, unknown>[] = [];
    collect(body, records);
    if (records.length === 0) return body;
    const idOf = (r: Record<string, unknown>): string => (typeof r.featureId === "string" ? r.featureId : typeof r.unit_id === "string" ? r.unit_id : (r.unitId as string));
    const ids = [...new Set(records.map(idOf))];
    const rows: { origin: string; path: string }[] = await this.db.query(
      `with recursive up as (
         select subject_id as origin, id, slug, parent_slug_id, 1 as depth from source.slugs
          where subject_table = 'geography.features' and subject_id = any($1::uuid[]) and to_year is null
         union all
         select up.origin, s.id, s.slug, s.parent_slug_id, up.depth + 1 from source.slugs s join up on s.id = up.parent_slug_id where up.depth < 8)
       select origin, string_agg(slug, '/' order by depth desc) as path from up group by origin`,
      [ids],
    );
    const byId = new Map(rows.map((r) => [r.origin, r.path]));
    for (const record of records) {
      const path = byId.get(idOf(record));
      if (path === undefined) continue;
      if (typeof record.featureId !== "string") {
        if (typeof record.unit_id === "string") record.unit_path = path;
        else record.unitPath = path;
        continue;
      }
      // A search hit already uses `path` for its breadcrumb names; its address is `placePath`.
      if (Array.isArray(record.path)) record.placePath = path;
      else record.path = path;
    }
    return body;
  }
}
