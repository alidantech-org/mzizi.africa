/**
 * Module `event`: the civic calendar of a country or place.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { event, Events, Occurrences } from "#/schemas/postgres/event.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const calendar = event.feature("Calendar").failureDefaults(apiHttp);
const eventRef = Events.asRef();
const occurrence = Occurrences.asRef();

const CalendarWindow = event
  .schema("CalendarWindow", { countryId: dryv.field(p.Id), from: dryv.field(p.CalendarDate) })
  .extends(PageWindow)
  .asRef();

const q = calendar.queries({
  ScanOccurrences: dryv.readQuery
    .from(occurrence)
    .input(CalendarWindow)
    .where((row, args) => [
      row.follow(occurrence.fields.eventId, eventRef).fields.countryId.eq(args.countryId),
      row.fields.plannedStartsOn.compare("greater-than-or-equal", args.from),
    ])
    .select((row) => ({
      occurrenceId: row.fields.id,
      eventId: row.fields.eventId,
      eventCode: row.follow(occurrence.fields.eventId, eventRef).fields.code,
      kindTerm: row.follow(occurrence.fields.eventId, eventRef).fields.kindTerm,
      featureId: row.follow(occurrence.fields.eventId, eventRef).fields.featureId,
      plannedStartsOn: row.fields.plannedStartsOn,
      plannedEndsOn: row.fields.plannedEndsOn,
      actualStartsOn: row.fields.actualStartsOn,
      startsAt: row.fields.startsAt,
      isAllDay: row.fields.isAllDay,
      statusTerm: row.fields.statusTerm,
      names: namesOf(row.follow(occurrence.fields.eventId, eventRef).follow(eventRef.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.plannedStartsOn.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const eventQueries = q;
const rows = event.schemas({ OccurrenceEntry: dryv.schema.fromQuery(q.ScanOccurrences) });
export const eventRows = rows;
const io = event.schemas({ OccurrenceCollection: dryv.schema({ occurrences: dryv.field(rows.OccurrenceEntry).array() }) });

export const eventOperations = calendar.operations({
  ListOccurrences: dryv
    .operation()
    .role("list")
    .description("A country's civic calendar from a date: holidays, sittings, deadlines and polling days.")
    .input(CalendarWindow)
    .output(io.OccurrenceCollection)
    .queryFromInput(q.ScanOccurrences, { envelope: { occurrences: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/event/occurrences").input(input, dryv.queryObject()).output(output),
    })),
});
