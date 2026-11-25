/**
 * Module `history`: the timeline of a country's historical occurrences and eras.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { Eras, history, Occurrences } from "#/schemas/postgres/history.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const timeline = history.feature("Timeline").failureDefaults(apiHttp);
const occurrence = Occurrences.asRef();
const era = Eras.asRef();

const CountryTimeline = history
  .schema("CountryTimeline", { countryId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const q = timeline.queries({
  ScanOccurrences: dryv.readQuery
    .from(occurrence)
    .input(CountryTimeline)
    .where((row, args) => [row.fields.countryId.eq(args.countryId)])
    .select((row) => ({
      occurrenceId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      fromYear: row.fields.fromYear,
      toYear: row.fields.toYear,
      startsOn: row.fields.startsOn,
      precision: row.fields.precision,
      names: namesOf(row.follow(occurrence.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.fromYear.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  ScanEras: dryv.readQuery
    .from(era)
    .input(CountryTimeline)
    .where((row, args) => [row.fields.countryId.eq(args.countryId)])
    .select((row) => ({
      eraId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      parentId: row.fields.parentId,
      fromYear: row.fields.fromYear,
      toYear: row.fields.toYear,
      names: namesOf(row.follow(era.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.fromYear.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const historyQueries = q;
const rows = history.schemas({
  HistoryEntry: dryv.schema.fromQuery(q.ScanOccurrences),
  EraEntry: dryv.schema.fromQuery(q.ScanEras),
});
export const historyRows = rows;
const io = history.schemas({
  HistoryCollection: dryv.schema({ occurrences: dryv.field(rows.HistoryEntry).array() }),
  EraCollection: dryv.schema({ eras: dryv.field(rows.EraEntry).array() }),
});

export const historyOperations = timeline.operations({
  ListHistory: dryv
    .operation()
    .role("list")
    .description("A country's historical occurrences in time order.")
    .input(CountryTimeline)
    .output(io.HistoryCollection)
    .queryFromInput(q.ScanOccurrences, { envelope: { occurrences: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/history/occurrences").input(input, dryv.queryObject()).output(output),
    })),
  ListEras: dryv
    .operation()
    .role("list")
    .description("A country's named eras in time order.")
    .input(CountryTimeline)
    .output(io.EraCollection)
    .queryFromInput(q.ScanEras, { envelope: { eras: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/history/eras").input(input, dryv.queryObject()).output(output),
    })),
});
