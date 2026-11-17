/**
 * Office holders for the units of a place: who holds each office scoped to a unit on a date, their party, and the
 * evidence for the tenure. Names come from the official names of the individual in the requested language.
 */
import type { DataSource } from "typeorm";

import type { OfficeHolder } from "#/modules/locality/schema/interface/office-holder.interface.ts";
import { evidenceFor } from "#/modules/locality/features/places/reads/evidence.ts";
import {
  FALLBACK_LANGUAGE,
  featureName,
  valueLabel,
} from "#/modules/locality/features/places/reads/language.ts";

interface HolderRow {
  holder_id: string;
  office_code: string;
  office_kind_label: string;
  unit_feature_id: string;
  unit_name: string;
  person_name: string;
  party_name: string | null;
  took_office_on: string | null;
  left_office_on: string | null;
}

/** The person's preferred name in the requested language, else English, else any official name. */
const personName = `coalesce(
  (select n.name from official.names n join reference.languages l on l.id = n.language_id
    where n.individual_id = i.id and l.iso6391 = $2 order by n.is_preferred desc limit 1),
  (select n.name from official.names n join reference.languages l on l.id = n.language_id
    where n.individual_id = i.id and l.iso6391 = '${FALLBACK_LANGUAGE}' order by n.is_preferred desc limit 1),
  (select n.name from official.names n where n.individual_id = i.id order by n.is_preferred desc limit 1))`;

/** The holders of offices scoped to the given units on `onDate` (today when absent), widest unit first. */
export async function officialsFor(
  db: DataSource,
  unitIds: readonly string[],
  lang: string,
  onDate: string | undefined,
): Promise<OfficeHolder[]> {
  if (unitIds.length === 0) return [];
  const rows: HolderRow[] = await db.query(
    `select h.id as holder_id, o.code as office_code, ${valueLabel("o.office_kind_id", "$2")} as office_kind_label,
       o.unit_feature_id, ${featureName("o.unit_feature_id", "$2")} as unit_name, ${personName} as person_name,
       (select (select n.name from official.names n where n.entity_id = pt.entity_id order by n.is_preferred desc limit 1)
          from politics.memberships m join politics.parties pt on pt.id = m.party_id
          where m.individual_id = i.id and (m.left_on is null or m.left_on > coalesce($3::date, current_date))
          order by m.joined_on desc nulls last limit 1) as party_name,
       h.took_office_on::text, h.left_office_on::text
     from governance.holders h
     join governance.offices o on o.id = h.office_id
     join official.individuals i on i.id = h.individual_id
     where o.unit_feature_id = any($1::uuid[])
       and (h.took_office_on is null or h.took_office_on <= coalesce($3::date, current_date))
       and (h.left_office_on is null or h.left_office_on > coalesce($3::date, current_date))
     order by array_position($1::uuid[], o.unit_feature_id), o.code`,
    [unitIds, lang, onDate ?? null],
  );
  const evidence = await evidenceFor(
    db,
    "governance.holders",
    rows.map((row) => row.holder_id),
  );
  return rows.map((row) => ({
    holderId: row.holder_id,
    officeCode: row.office_code,
    officeTitle: `${row.office_kind_label}, ${row.unit_name}`,
    unitFeatureId: row.unit_feature_id,
    unitName: row.unit_name,
    personName: row.person_name,
    partyName: row.party_name,
    tookOfficeOn: row.took_office_on,
    leftOfficeOn: row.left_office_on,
    portrait: null,
    evidence: evidence.get(row.holder_id) ?? [],
  }));
}
