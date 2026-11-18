/** Interface copy: the wording for one language from `reference.copy`, with a country's own wording over the general text. */
import type { DataSource } from "typeorm";

export interface CopyCatalogDoc {
  languageCode: string;
  entries: { key: string; text: string }[];
}

export async function copyCatalog(db: DataSource, languageCode: string, countryCode: string | undefined, prefix: string | undefined): Promise<CopyCatalogDoc> {
  const rows: { key: string; text: string }[] = await db.query(
    `select distinct on (c.key) c.key, c.text
       from reference.copy c
       join reference.languages l on l.id = c.language_id and (l.iso6391 = $1 or l.code = $1)
       left join reference.countries k on k.id = c.country_id
      where (c.country_id is null or k.code = $2 or lower(k.iso_alpha2) = lower($2))
        and ($3::text is null or c.key like $3 || '%')
      order by c.key, (c.country_id is null)`,
    [languageCode, countryCode ?? null, prefix ?? null],
  );
  return { languageCode, entries: rows };
}
