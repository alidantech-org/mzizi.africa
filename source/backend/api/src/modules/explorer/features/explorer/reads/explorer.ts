/** Composed, contract-validated explorer reads. Custom SQL is deliberately owned here, outside generated transport code. */
import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";
import { CountryChoiceDto } from "#/modules/explorer/schema/dto/country-choice.dto";
import { LanguageChoiceDto } from "#/modules/explorer/schema/dto/language-choice.dto";
import { createHash } from "node:crypto";
import { CopyEntryDto } from "#/modules/explorer/schema/dto/copy-entry.dto";
import { CountDto } from "#/modules/explorer/schema/dto/count.dto";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto";
import { LevelDto } from "#/modules/explorer/schema/dto/level.dto";
import type { NavigationInputDto } from "#/modules/explorer/schema/dto/navigation-input.dto";
import type { NavigationDto } from "#/modules/explorer/schema/dto/navigation.dto";
import { NavigationItemDto } from "#/modules/explorer/schema/dto/navigation-item.dto";
import type { CopyInputDto } from "#/modules/explorer/schema/dto/copy-input.dto";
import type { CopyBundleDto } from "#/modules/explorer/schema/dto/copy-bundle.dto";
import type { BootstrapInputDto } from "#/modules/explorer/schema/dto/bootstrap-input.dto";
import type { BootstrapDto } from "#/modules/explorer/schema/dto/bootstrap.dto";
import type { PlaceInputDto } from "#/modules/explorer/schema/dto/place-input.dto";
import type { ContextDto } from "#/modules/explorer/schema/dto/context.dto";
import type { PlacesDto } from "#/modules/explorer/schema/dto/places.dto";
import type { SearchInputDto } from "#/modules/explorer/schema/dto/search-input.dto";
import type { ChildrenInputDto } from "#/modules/explorer/schema/dto/children-input.dto";
import type { CoordinatesInputDto } from "#/modules/explorer/schema/dto/coordinates-input.dto";
import { ResolutionStatus } from "#/modules/explorer/schema/enum/resolution-status.enum.ts";
import type { ResolutionDto } from "#/modules/explorer/schema/dto/resolution.dto";
import type { OverviewDto } from "#/modules/explorer/schema/dto/overview.dto";
import { queryRows } from "./parse.ts";
import { countriesSql, placeCte, placeColumns } from "./queries.ts";

async function language(db: DataSource, requested?: string): Promise<string> {
  const code = requested ?? "en";
  const available = await queryRows(
    db,
    `select iso6391 as code,name from reference.languages where iso6391=$1 and deleted_at is null`,
    [code],
    LanguageChoiceDto,
  );
  if (!available.length) throw new BadRequestException("The requested language is not registered.");
  return code;
}
/** A registered country, served or not; unlike `country`, a missing routing root is not an error here. */
async function countryRow(db: DataSource, code: string): Promise<CountryChoiceDto> {
  const rows = await queryRows(db, countriesSql, [], CountryChoiceDto);
  const selected = rows.find((row) => row.code === code.toUpperCase());
  if (!selected) throw new NotFoundException("This country is not registered.");
  return selected;
}
async function country(db: DataSource, code: string): Promise<CountryChoiceDto> {
  const rows = await queryRows(db, countriesSql, [], CountryChoiceDto);
  const selected = rows.find((row) => row.code === code.toUpperCase());
  if (!selected) throw new NotFoundException("This country is not registered.");
  if (!selected.rootFeatureId)
    throw new NotFoundException("This country's routing root is missing or ambiguous.");
  return selected;
}
function pageOffset(page: number, limit: number): number {
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(page) || !Number.isSafeInteger(offset))
    throw new BadRequestException("The requested pagination offset cannot be represented safely.");
  return offset;
}

function canonical(place: PlaceDto): PlaceDto {
  const segments = place.canonicalPath.split("/");
  if (
    segments.length !== place.depth + 2 ||
    segments.slice(2).some((segment) => !segment || segment === "." || segment === "..")
  )
    throw new BadRequestException(
      "The registered place address contains an invalid path segment; registry review is required.",
    );
  return { ...place, canonicalPath: segments.map(encodeURIComponent).join("/") };
}

export async function bootstrap(db: DataSource, input: BootstrapInputDto): Promise<BootstrapDto> {
  const lang = await language(db, input.languageCode);
  const [countries, languages] = await Promise.all([
    queryRows(db, countriesSql, [], CountryChoiceDto),
    queryRows(
      db,
      `select l.iso6391 as code,
         coalesce((select n.name from reference.language_names n join reference.languages il on il.id=n.in_language_id
                    where n.language_id=l.id and il.iso6391=$1 and n.deleted_at is null order by n.id limit 1), l.name) as name,
         (select n.name from reference.language_names n where n.language_id=l.id and n.in_language_id=l.id and n.deleted_at is null order by n.id limit 1) as "nativeName"
       from reference.languages l
      where l.iso6391 is not null and l.deleted_at is null
        and exists(select 1 from reference.copy c where c.language_id=l.id and c.deleted_at is null)
      order by l.name,l.id`,
      [lang],
      LanguageChoiceDto,
    ),
  ]);
  return {
    countries,
    languages,
    language: lang,
    gaps: [
      "Flags without registered display media use a neutral marker. Recorded data is not an assertion of completeness or verification.",
    ],
  };
}
export async function context(db: DataSource, input: PlaceInputDto): Promise<ContextDto> {
  const [selected, lang] = await Promise.all([
    country(db, input.countryCode),
    language(db, input.languageCode),
  ]);
  const path = input.path?.split("/").filter(Boolean).join("/") ?? "";
  const rows = await queryRows(
    db,
    `${placeCte} select ${placeColumns} from places p where ($3::uuid is not null and p.feature_id=$3) or ($3::uuid is null and array_to_string(p.segments,'/')=$4) order by p.path`,
    [selected.id, lang, input.featureId ?? null, path],
    PlaceDto,
  );
  if (!rows.length)
    throw new NotFoundException(
      "This place has no current registered path in the selected country.",
    );
  const unique = new Set(rows.map((row) => row.featureId));
  if (unique.size !== 1) throw new BadRequestException("This path identifies more than one place.");
  const place = rows[0]!;
  if (rows.some((row) => row.canonicalPath !== place.canonicalPath))
    throw new BadRequestException(
      "This place has multiple canonical paths; registry review is required.",
    );
  if (
    input.featureId &&
    input.path !== undefined &&
    place.canonicalPath !== `/${selected.code.toLowerCase()}/${path}`
  )
    throw new BadRequestException("The supplied place identity and path do not agree.");
  const [chain, levels] = await Promise.all([
    queryRows(
      db,
      `${placeCte} select ${placeColumns} from places p where p.feature_id=$3 or (cardinality(p.segments)<$4 and p.segments=(string_to_array($5,'/'))[1:cardinality(p.segments)]) order by cardinality(p.segments),p.path`,
      [
        selected.id,
        lang,
        place.featureId,
        place.depth,
        place.canonicalPath.split("/").slice(2).join("/"),
      ],
      PlaceDto,
    ),
    queryRows(
      db,
      `select l.depth,v.code as "kindCode",v.label from geography.levels l join reference.values v on v.id=l.feature_kind_id where l.country_id=$1 and l.is_routing_hierarchy and l.deleted_at is null order by l.depth,l.id`,
      [selected.id],
      LevelDto,
    ),
  ]);
  if (new Set(chain.map((place) => place.depth)).size !== chain.length)
    throw new BadRequestException(
      "The registered ancestor paths are ambiguous; registry review is required.",
    );
  return {
    country: selected,
    place: canonical(place),
    chain: chain.map(canonical),
    levels,
    language: lang,
    gaps: selected.served ? [] : ["Only partial coverage is recorded for this country."],
  };
}
export async function search(db: DataSource, input: SearchInputDto): Promise<PlacesDto> {
  const selected = await country(db, input.countryCode);
  const lang = await language(db, input.languageCode);
  const page = input.page ?? 1,
    limit = input.limit ?? 20;
  if (input.parentFeatureId)
    await context(db, {
      countryCode: selected.code,
      featureId: input.parentFeatureId,
      languageCode: lang,
    });
  const filter = `position(lower($3) in lower(p.name))>0 and ($4::uuid is null or $4=any(p.ancestors)) and ($5::int is null or cardinality(p.segments)=$5)`;
  const parameters = [
    selected.id,
    lang,
    input.query,
    input.parentFeatureId ?? null,
    input.depth ?? null,
  ];
  const [result, counts] = await Promise.all([
    queryRows(
      db,
      `${placeCte} select ${placeColumns} from places p where ${filter} order by lower(p.name),p.feature_id,p.path limit $6 offset $7`,
      [...parameters, limit, pageOffset(page, limit)],
      PlaceDto,
    ),
    queryRows(
      db,
      `${placeCte} select 'Matching places'::text as label,count(*)::int as value from places p where ${filter}`,
      parameters,
      CountDto,
    ),
  ]);
  return { places: result.map(canonical), total: counts[0]!.value, page, limit, gaps: [] };
}
export async function children(db: DataSource, input: ChildrenInputDto): Promise<PlacesDto> {
  const current = await context(db, {
    countryCode: input.countryCode,
    featureId: input.featureId,
    languageCode: input.languageCode,
  });
  const page = input.page ?? 1,
    limit = input.limit ?? 20;
  const parameters = [current.country.id, current.language, current.place.featureId];
  const [result, counts] = await Promise.all([
    queryRows(
      db,
      `${placeCte} select ${placeColumns} from places p where p.parent_feature_id=$3 order by lower(p.name),p.feature_id,p.path limit $4 offset $5`,
      [...parameters, limit, pageOffset(page, limit)],
      PlaceDto,
    ),
    queryRows(
      db,
      `${placeCte} select 'Direct child places'::text as label,count(*)::int as value from places p where p.parent_feature_id=$3`,
      parameters,
      CountDto,
    ),
  ]);
  const total = counts[0]!.value;
  return {
    places: result.map(canonical),
    total,
    page,
    limit,
    gaps: total ? [] : ["No direct child places are recorded in this place hierarchy."],
  };
}
export async function resolve(db: DataSource, input: CoordinatesInputDto): Promise<ResolutionDto> {
  const lang = await language(db, input.languageCode);
  const countries = await queryRows(db, countriesSql, [], CountryChoiceDto);
  if (input.countryCode) await country(db, input.countryCode);
  const candidates: PlaceDto[] = [];
  for (const c of countries.filter(
    (row) =>
      row.rootFeatureId && (!input.countryCode || row.code === input.countryCode.toUpperCase()),
  )) {
    const rows = await queryRows(
      db,
      `${placeCte} select distinct ${placeColumns} from places p join geography.geometries g on g.feature_id=p.feature_id where g.deleted_at is null and g.to_year is null and g.geometry is not null and st_dimension(g.geometry)=2 and st_covers(g.geometry,st_setsrid(st_makepoint($3,$4),4326)) order by depth desc,"featureId" limit 8`,
      [c.id, lang, input.longitude, input.latitude],
      PlaceDto,
    );
    const deepest = rows[0]?.depth;
    candidates.push(...rows.filter((row) => row.depth === deepest).map(canonical));
  }
  const status =
    candidates.length === 1
      ? ResolutionStatus.MATCHED
      : candidates.length
        ? ResolutionStatus.AMBIGUOUS
        : ResolutionStatus.UNRESOLVED;
  return {
    status,
    candidates,
    gaps: [
      "Candidates use recorded boundary geometry; device accuracy and boundary precision may affect the result. Confirm the place before saving.",
      ...(candidates.length ? [] : ["No registered place boundary covers this position."]),
    ],
  };
}
export async function overview(db: DataSource, input: PlaceInputDto): Promise<OverviewDto> {
  const ctx = await context(db, input);
  const kids = await children(db, {
    countryCode: ctx.country.code,
    featureId: ctx.place.featureId,
    languageCode: ctx.language,
    limit: 100,
  });
  return {
    context: ctx,
    children: kids,
    counts: [
      { label: "Registered direct child places", value: kids.total },
      { label: "Recorded citations for this place", value: ctx.place.citationCount },
    ],
    gaps: [
      ...ctx.gaps,
      ...(kids.total > kids.limit
        ? [
            "More child places are recorded than can be shown here. Use Change place to search the complete registered list.",
          ]
        : []),
      "Counts describe recorded coverage, not verified completeness. Statistics, office-holder details and financial measures are not included in this overview.",
    ],
  };
}

/** One language's wording. Country wording overrides the general wording; another language is never substituted. */
export async function copyBundle(db: DataSource, input: CopyInputDto): Promise<CopyBundleDto> {
  const lang = await language(db, input.languageCode);
  const prefix = input.area ? `${input.area}.%` : null;
  const country = input.countryCode?.toUpperCase() ?? null;
  const [entries, missing] = await Promise.all([
    queryRows(
      db,
      `select distinct on(c.key) c.key,c.text
         from reference.copy c
         join reference.languages l on l.id=c.language_id
         left join reference.countries co on co.id=c.country_id
        where l.iso6391=$1 and c.deleted_at is null
          and (c.country_id is null or co.iso_alpha2=$2)
          and ($3::text is null or c.key like $3)
        order by c.key,(c.country_id is null),c.id`,
      [lang, country, prefix],
      CopyEntryDto,
    ),
    queryRows(
      db,
      `select distinct k.key as "key",''::text as "text"
         from reference.copy k
        where k.deleted_at is null and ($2::text is null or k.key like $2)
          and not exists (select 1 from reference.copy c join reference.languages l on l.id=c.language_id
                           where c.key=k.key and l.iso6391=$1 and c.deleted_at is null)
        order by 1`,
      [lang, prefix],
      CopyEntryDto,
    ),
  ]);
  const hash = createHash("sha256").update(JSON.stringify(entries.map((e) => [e.key, e.text]))).digest("hex").slice(0, 16);
  return { language: lang, hash, entries, missing: missing.map((m) => m.key) };
}

/** Navigation subjects and the records that make each one worth opening for a country. $1 is the country identity, or its lowercase code for subjects marked `by: "code"`. */
const SUBJECTS: readonly { view: string; exists: string; by?: "code" }[] = [
  { view: "elections", exists: "select 1 from politics.elections t where t.country_id=$1 and t.deleted_at is null" },
  { view: "parliament", exists: "select 1 from governance.bills t where t.country_id=$1 and t.deleted_at is null" },
  { view: "leaders", exists: "select 1 from governance.terms t where t.country_id=$1 and t.deleted_at is null" },
  { view: "institutions", exists: "select 1 from governance.institutions t where t.country_id=$1 and t.deleted_at is null" },
  { view: "arms", exists: "select 1 from governance.institutions t where t.country_id=$1 and t.arm_id is not null and t.deleted_at is null" },
  { view: "power", exists: "select 1 from governance.authority_scopes t where t.country_id=$1 and t.deleted_at is null" },
  {
    view: "law",
    exists:
      "select 1 from legal.instruments i join geography.features f on f.id=i.issuing_unit_id where f.code like 'geo.ftr.'||$1||'%' and i.deleted_at is null",
    by: "code",
  },
  { view: "finance", exists: "select 1 from finance.budgets t where t.country_id=$1 and t.deleted_at is null" },
  { view: "suppliers", exists: "select 1 from civic.procurements t where t.country_id=$1 and t.deleted_at is null" },
  {
    view: "statistics",
    exists:
      "select 1 from statistics.observations o join geography.features f on f.id=o.feature_id where f.code like 'geo.ftr.'||$1||'%' and o.deleted_at is null",
    by: "code",
  },
  { view: "compare", exists: "select 1 from geography.levels t where t.country_id=$1 and t.deleted_at is null" },
  { view: "sources", exists: "select 1 from source.coverage t where t.country_id=$1 and t.deleted_at is null" },
];

export async function navigation(db: DataSource, input: NavigationInputDto): Promise<NavigationDto> {
  const selected = await countryRow(db, input.countryCode);
  const items = await Promise.all(
    SUBJECTS.map(async (subject) => {
      const parameters = [subject.by === "code" ? input.countryCode.toLowerCase() : selected.id];
      const found = await db.query(`select exists(${subject.exists}) as "ok"`, parameters);
      return Object.assign(new NavigationItemDto(), { view: subject.view, available: found[0]?.ok === true });
    }),
  );
  return { country: selected, items, gaps: [] };
}
