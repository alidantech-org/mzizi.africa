/**
 * Schema: event | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 27.3 (approved 2026-11-25).
 * Contract authors: the civic calendar of planned and recurring happenings (holidays, sittings, deadlines, election
 * timetables) with exact dates and times. Historical significance is in `history`. No partitioning.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { templateFields } from "#/schemas/_templates.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Features } from "./geography.ts";
import { Countries, Languages, Levels, Timezones } from "./reference.ts";

export const event = dryv
  .group({ name: "event" })
  .description(
    "The civic calendar: calendars, events, recurrence rules, occurrences, changes, schedules, seasons and venues.",
  )
  .facets({ storage: { namespace: "event", store: "main" } });

const eventProperties = event.properties({
  Month: dryv.property.number.integer({ range: { min: 1, max: 12 } }),
  Day: dryv.property.number.integer({ range: { min: 1, max: 31 } }),
  Weekday: dryv.property.number.integer({ range: { min: 1, max: 7 } }),
  Nth: dryv.property.number.integer({ range: { min: -5, max: 5 } }),
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
});

/** An optional note with its language (section 27.3: free-text explanations become notes with a language). */
const note = {
  note: dryv.field(eventProperties.Note).maybe().description("Optional note, written in `note_language_id`."),
  noteLanguageId: belongsTo(() => Languages).maybe(),
};

/*---------------- event.calendars ----------------*/
export const Calendars = event
  .schema("Calendars", {
    countryId: belongsTo(() => Countries).maybe(),
    kindTerm: term("evt.calendar.kind", "public holidays, parliamentary, fiscal, electoral, school."),
    yearStartMonth: dryv.field(eventProperties.Month).maybe().description("Month the calendar's year starts (7 for July)."),
    yearStartDay: dryv.field(eventProperties.Day).maybe(),
    isObserved: dryv.field(sharedProperties.Flag).description("True when the calendar is in force."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A civic calendar, such as Kenya's public holidays or the National Assembly calendar.")
  .role("entity")
  .facets({ storage: dryv.storage("calendars").index("countryId", "kindTerm") });

/*---------------- event.events ----------------*/
export const Events = event
  .schema("Events", {
    identityKind: identityKindField("event"),
    countryId: belongsTo(() => Countries).maybe(),
    calendarId: belongsTo(() => Calendars).maybe(),
    kindTerm: term("evt.event.kind", "holiday, sitting, deadline, election, observance."),
    levelId: belongsTo(() => Levels)
      .maybe()
      .description("The level of government the event concerns."),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The place the event concerns."),
    organiserId: identity("The organisation or office that organises it.").maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("EventKind", (v) => v.identityKind.eq("event"))
  .description("A planned or recurring civic happening (Madaraka Day, budget reading). Its names are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("events")
      .index("countryId", "kindTerm")
      .index("calendarId")
      .index("featureId")
      .references("EventIsIdentity", identityReference),
  });

/*---------------- event.rules ----------------*/
export const Rules = event
  .schema("Rules", {
    eventId: belongsTo(() => Events, { onDelete: "cascade" }),
    kind: dryv.field(enums.RuleKind).description("fixed date, nth weekday, interval, rrule."),
    month: dryv.field(eventProperties.Month).maybe(),
    dayOfMonth: dryv.field(eventProperties.Day).maybe(),
    weekday: dryv.field(eventProperties.Weekday).maybe().description("ISO weekday, 1 is Monday."),
    nthWeekday: dryv
      .field(eventProperties.Nth)
      .maybe()
      .description("Which weekday of the month; negative counts from the end."),
    intervalYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    rrule: dryv.field(sharedProperties.NonEmptyString500).maybe().description("An RFC 5545 recurrence rule."),
    anchorOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    adjustmentTerm: term("evt.rule.adjustment", "What happens when the date falls on a weekend.").maybe(),
    ...periodFields,
    ...templateFields("event-rule"),
  })
  .extends(baseSchemas.Entity)
  .description(
    "When an event recurs. A rule may be generated from a pattern (the second Tuesday of August every fifth year).",
  )
  .role("entity")
  .facets({ storage: dryv.storage("rules").index("eventId").index("templateId") });

/*---------------- event.occurrences ----------------*/
export const Occurrences = event
  .schema("Occurrences", {
    eventId: belongsTo(() => Events, { onDelete: "cascade" }),
    plannedStartsOn: dryv
      .field(sharedProperties.CalendarDate)
      .maybe()
      .description("Planned first day; empty while the date is not yet known."),
    plannedEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualStartsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    startsAt: dryv.field(sharedProperties.Instant).maybe().description("Exact start time, when known."),
    timezoneId: belongsTo(() => Timezones).maybe(),
    isAllDay: dryv.field(sharedProperties.Flag),
    status: dryv.field(enums.OccurrenceStatus).description("scheduled, held, postponed, cancelled."),
    knowledgeTerm: term("evt.occurrence.knowledge", "How the date is known: announced, gazetted, estimated.").maybe(),
    format: dryv.field(enums.OccurrenceFormat).description("in person, online or hybrid.").maybe(),
    organiserId: identity("The organiser of this occurrence when it differs from the event's.").maybe(),
    continuesOccurrenceId: belongsTo(dryv.self)
      .maybe()
      .description("The occurrence this one continues (a resumed sitting)."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("PlannedDatesAreOrdered", rule.ordered("plannedStartsOn", "plannedEndsOn", { allowEqual: true }))
  .rule("ActualDatesAreOrdered", rule.ordered("actualStartsOn", "actualEndsOn", { allowEqual: true }))
  .description("One happening of an event, with planned and actual dates.")
  .role("entity")
  .facets({ storage: dryv.storage("occurrences").index("eventId", "plannedStartsOn").index("plannedStartsOn") });

/*---------------- event.changes ----------------*/
export const Changes = event
  .schema("Changes", {
    occurrenceId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    kind: dryv.field(enums.OccurrenceChange).description("postponed, brought forward, cancelled, moved."),
    reasonTerm: term("evt.change.reason", "Why it changed.").maybe(),
    fromOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    toOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    decidedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    authorityId: identity("Who decided the change.").maybe(),
    replacementOccurrenceId: belongsTo(() => Occurrences).maybe(),
    ...note,
  })
  .extends(baseSchemas.Entity)
  .rule("ChangeNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("A postponement, cancellation or move of an occurrence.")
  .role("entity")
  .facets({ storage: dryv.storage("changes").index("occurrenceId") });

/*---------------- event.subjects ----------------*/
export const Subjects = event
  .schema("Subjects", {
    eventId: belongsTo(() => Events, { onDelete: "cascade" }),
    identityId: identity("A named thing the event is about."),
    roleTerm: term("evt.subject.role", "What part the thing plays (commemorated, decided on)."),
  })
  .extends(baseSchemas.Association)
  .description("What an event is about.")
  .role("entity")
  .facets({ storage: dryv.storage("subjects").unique("eventId", "identityId", "roleTerm").index("identityId") });

/*---------------- event.participants ----------------*/
export const Participants = event
  .schema("Participants", {
    occurrenceId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    identityId: identity("The person or organisation taking part."),
    roleTerm: term("evt.participant.role", "host, speaker, guest."),
  })
  .extends(baseSchemas.Association)
  .description("Who took part in an occurrence.")
  .role("entity")
  .facets({ storage: dryv.storage("participants").unique("occurrenceId", "identityId", "roleTerm").index("identityId") });

/*---------------- event.schedules ----------------*/
export const Schedules = event
  .schema("Schedules", {
    countryId: belongsTo(() => Countries).maybe(),
    kindTerm: term("evt.schedule.kind", "election timetable, budget calendar."),
    anchorEventId: belongsTo(() => Events)
      .maybe()
      .description("The event the schedule counts from."),
    anchorOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    issuerId: identity("The body that issued the schedule.").maybe(),
    status: dryv.field(enums.ScheduleStatus).description("draft, published, superseded."),
    supersedesScheduleId: belongsTo(dryv.self).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...templateFields("event-schedule"),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A published timetable of steps counted from an anchor (an election timetable); an expected one is generated from a pattern.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("schedules").index("countryId", "kindTerm").index("anchorEventId").index("templateId") });

/*---------------- event.items ----------------*/
export const Items = event
  .schema("Items", {
    scheduleId: belongsTo(() => Schedules, { onDelete: "cascade" }),
    eventId: belongsTo(() => Events),
    occurrenceId: belongsTo(() => Occurrences).maybe(),
    offsetDays: dryv.field(sharedProperties.Integer).maybe().description("Days from the anchor; negative before it."),
    countsWorkingDays: dryv.field(sharedProperties.Flag),
    position: dryv.field(sharedProperties.NonNegativeInteger),
    ...note,
  })
  .extends(baseSchemas.Entity)
  .rule("ItemNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("One step of a schedule.")
  .role("entity")
  .facets({ storage: dryv.storage("items").unique("scheduleId", "position").index("eventId") });

/*---------------- event.seasons ----------------*/
export const Seasons = event
  .schema("Seasons", {
    countryId: belongsTo(() => Countries),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The region the season applies to."),
    kindTerm: term("evt.season.kind", "long rains, short rains, school term, harvest."),
    startMonth: dryv.field(eventProperties.Month).maybe(),
    startDay: dryv.field(eventProperties.Day).maybe(),
    endMonth: dryv.field(eventProperties.Month).maybe(),
    endDay: dryv.field(eventProperties.Day).maybe(),
    isNatural: dryv.field(sharedProperties.Flag).description("True for a natural season, false for an institutional one."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A recurring season of a country or region.")
  .role("entity")
  .facets({ storage: dryv.storage("seasons").index("countryId", "kindTerm").index("featureId") });

/*---------------- event.venues ----------------*/
export const Venues = event
  .schema("Venues", {
    occurrenceId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The place; empty while the venue is not yet known."),
    roleTerm: term("evt.venue.role", "main venue, satellite, route."),
    ...note,
  })
  .extends(baseSchemas.Entity)
  .rule("VenueNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("Where an occurrence takes place.")
  .role("entity")
  .facets({ storage: dryv.storage("venues").unique("occurrenceId", "featureId", "roleTerm").index("featureId") });
