/** The legal instruments held, highest authority first: ordered by the reference position of their kind (constitution, act, regulation). */
import type { DataSource } from "typeorm";

import { shortCode } from "./shared.ts";

interface Row { code: string; name: string | null; kind_code: string; kind_label: string; enacted_on: string | null; provisions: string }

export async function listLaw(db: DataSource, kindCode: string | undefined) {
  const rows: Row[] = await db.query(
    `select i.code, (select n.name from legal.names n where n.instrument_id = i.id order by n.is_preferred desc, n.name limit 1) as name,
       k.code as kind_code, k.label as kind_label, i.enacted_on::text as enacted_on,
       (select count(*) from legal.provisions p where p.instrument_id = i.id and p.deleted_at is null) as provisions
     from legal.instruments i join reference.values k on k.id = i.kind_id
     where i.deleted_at is null and ($1::text is null or k.code = $1 or k.code = 'ref.val.' || $1)
     order by k.position nulls last, i.enacted_on desc nulls last, i.code`,
    [kindCode ?? null],
  );
  return {
    instruments: rows.map((r) => ({
      code: shortCode(r.code),
      name: r.name ?? shortCode(r.code),
      kindCode: shortCode(r.kind_code.replace(/^ref\.val\./, "")),
      kindLabel: r.kind_label,
      enactedOn: r.enacted_on,
      provisions: Number(r.provisions),
    })),
    gaps: rows.length === 0 ? ["No legal instruments have been loaded yet."] : [],
  };
}
