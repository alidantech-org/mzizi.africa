/**
 * Schema: event | Database: mzizi
 * Only things with actual dates: events and recurring series (public holidays, national days, elections, visits,
 * commemorations), their rules and calendars, dated occurrences with planned and actual dates, reschedules and
 * adjournments, published schedules and timetables with offsets from an anchor, and natural seasons.
 * Parliamentary sittings are occurrences here; the legislative record lives in governance.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Provisions } from "./legal.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Language, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const event = dryv
  .group({ name: "event" })
  .description("Events with actual dates: series, rules, calendars, occurrences, changes, schedules and seasons.")
  .facets({ storage: { namespace: "event", store: "main" } });

/*---------------- event.calendars ----------------*/
export const Calendars = event
  .schema("Calendars", {
    countryId: belongsTo(() => Country).maybe(),
    /** Scheme evt.calendar.kind: Gregorian, Islamic lunar, fiscal year, school year, parliamentary year, agricultural year. */
    calendarKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.calendar.kind"),
    /** The month and day a year of this calendar begins (a fiscal year starting on 1 July). */
    yearStartMonth: dryv.field(sharedProperties.PositiveInteger).maybe(),
    yearStartDay: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** True when dates depend on observation (a lunar month sighted by an authority) and are announced, not computed. */
    isObserved: dryv.field(sharedProperties.Flag),
    description: dryv.field(sharedProperties.Description).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("calendars").index("countryId").index("calendarKindId").index("sourceCitationId") });

/*---------------- event.events ----------------*/
export const Events = event
  .schema("Events", {
    countryId: belongsTo(() => Country).maybe(),
    /** The calendar the event's dates are counted in. */
    calendarId: belongsTo(() => Calendars).maybe(),
    /** Scheme evt.event.kind: public holiday, national day, general election, election milestone, sitting, visit, deadline, commemoration, court date, other. */
    eventKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.event.kind"),
    /** The place level the event is for (national, county, constituency, ward); a feature kind value. */
    scopeLevelKindId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.geo.feature.kind"),
    /** The one place it concerns when it is not national. */
    scopeFeatureId: belongsTo(() => Features).maybe(),
    /** The body that organises it. */
    organiserEntityId: belongsTo(() => Entities).maybe(),
    /** The law that sets or recognises it (for example the provision fixing a holiday or an election date). */
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("events")
      .index("countryId", "eventKindId")
      .index("scopeFeatureId")
      .index("organiserEntityId")
      .index("basisProvisionId")
      .index("sourceCitationId"),
  });

/*---------------- event.event_names ----------------*/
export const Names = event
  .schema("Names", {
    eventId: belongsTo(() => Events),
    languageId: belongsTo(() => Language),
    name: dryv.field(sharedProperties.Name),
    isPreferred: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .description("The name of an event in one language; at most one preferred name per event and language.")
  .role("entity");

const preferredName = event.expression(
  "PreferredName",
  Names.check((v) => v.isPreferred.eq(true)),
);

Names.facets({
  storage: dryv
    .storage("names")
    .unique("eventId", "languageId", "name")
    .unique("eventId", "languageId")
    .where(preferredName)
    .index("languageId"),
});

/*---------------- event.event_rules ----------------*/
export const Rules = event
  .schema("Rules", {
    eventId: belongsTo(() => Events),
    /** Scheme evt.rule.kind: fixed date, nth weekday of a month, every n years from an anchor, once. */
    ruleKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.rule.kind"),
    month: dryv.field(sharedProperties.PositiveInteger).maybe(),
    dayOfMonth: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** 1 (Monday) to 7 (Sunday) for a weekday rule. */
    weekday: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** Which weekday of the month: 1 first, 2 second, and so on. */
    nthWeekday: dryv.field(sharedProperties.PositiveInteger).maybe(),
    intervalYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** The same rule as an iCalendar RRULE (FREQ=YEARLY;BYMONTH=8;BYDAY=2TU), kept so calendars can be exported and imported. */
    rrule: dryv.field(sharedProperties.NonEmptyString500).maybe(),
    /** The first occurrence a repeating rule counts from. */
    anchorOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Scheme evt.rule.adjustment: none, next weekday when on a rest day, previous weekday, next Monday when on a Sunday. */
    adjustmentId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.evt.rule.adjustment"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.PeriodEntity)
  .description(
    "How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("rules").index("eventId").index("ruleKindId").index("sourceCitationId") });

/*---------------- event.occurrences ----------------*/
export const Occurrences = event
  .schema("Occurrences", {
    eventId: belongsTo(() => Events),
    plannedStartsOn: dryv.field(sharedProperties.CalendarDate),
    plannedEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualStartsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Time of day when known; the dates above are the calendar days. */
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    /** IANA time zone the times are read in (Africa/Nairobi). */
    timezone: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    isAllDay: dryv.field(sharedProperties.Flag),
    /** Scheme evt.occurrence.status: scheduled, rescheduled, postponed, adjourned, cancelled, held. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.evt.occurrence.status"),
    /** Scheme evt.occurrence.knowledge: projected from a rule, announced, confirmed. How we know the date. */
    knowledgeId: belongsTo(() => Value).tags("scheme:ref.sch.evt.occurrence.knowledge"),
    /** Where it happens, as a place (a stadium, a hall, a town). */
    venueFeatureId: belongsTo(() => Features).maybe(),
    venueNote: dryv.field(sharedProperties.Description).maybe(),
    /** Scheme evt.occurrence.format: in person, online, hybrid, broadcast. How it happens. */
    formatId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.evt.occurrence.format"),
    organiserEntityId: belongsTo(() => Entities).maybe(),
    /** The occurrence this continues after an adjournment. */
    continuesOccurrenceId: belongsTo(() => Occurrences).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("PlannedDatesAreOrdered", rule.ordered("plannedStartsOn", "plannedEndsOn", { allowEqual: true }))
  .rule("ActualDatesAreOrdered", rule.ordered("actualStartsOn", "actualEndsOn", { allowEqual: true }))
  .description(
    "One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("occurrences")
      .index("eventId", "plannedStartsOn")
      .index("statusId")
      .index("knowledgeId")
      .index("venueFeatureId")
      .index("organiserEntityId")
      .index("continuesOccurrenceId")
      .index("sourceCitationId"),
  });

/*---------------- event.occurrence_changes ----------------*/
export const Changes = event
  .schema("Changes", {
    occurrenceId: belongsTo(() => Occurrences),
    /** Scheme evt.change.kind: reschedule, postpone, adjourn, cancel, confirm, move venue. */
    changeKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.change.kind"),
    /** Scheme evt.change.reason: falls on a rest day, court order, emergency, declared by authority, security, weather, legal requirement. */
    reasonId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.evt.change.reason"),
    fromOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    toOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    decidedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    authorityEntityId: belongsTo(() => Entities).maybe(),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    /** The occurrence that replaces this one, when the change creates a new one. */
    replacementOccurrenceId: belongsTo(() => Occurrences).maybe(),
    explanation: dryv.field(sharedProperties.Description).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("changes")
      .index("occurrenceId", "decidedOn")
      .index("changeKindId")
      .index("reasonId")
      .index("authorityEntityId")
      .index("basisProvisionId")
      .index("replacementOccurrenceId")
      .index("sourceCitationId"),
  });

/*---------------- event.event_subjects ----------------*/
export const Subjects = event
  .schema("Subjects", {
    eventId: belongsTo(() => Events),
    /** Scheme evt.subject.role: about, milestone of, venue for, concerns. How the event relates to the subject. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.evt.subject.role"),
  })
  .extends(baseSchemas.CodedSubjectEntity)
  .description(
    "What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("subjects")
      .unique("eventId", "subjectTable", "subjectId", "roleId")
      .index("subjectTable", "subjectId"),
  });

/*---------------- event.event_participants ----------------*/
export const Participants = event
  .schema("Participants", {
    occurrenceId: belongsTo(() => Occurrences),
    entityId: belongsTo(() => Entities).maybe(),
    individualId: belongsTo(() => Individuals).maybe(),
    /** Scheme evt.participant.role: organiser, host, guest of honour, attendee, observer, speaker. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.evt.participant.role"),
  })
  .extends(baseSchemas.Entity)
  .rule("ExactlyOneParticipant", rule.exactlyOne("entityId", "individualId"))
  .description("One organisation or person taking part in one occurrence in a role.")
  .role("entity")
  .facets({
    storage: dryv.storage("participants").index("occurrenceId").index("entityId").index("individualId").index("roleId"),
  });

/*---------------- event.schedules ----------------*/
export const Schedules = event
  .schema("Schedules", {
    countryId: belongsTo(() => Country).maybe(),
    /** Scheme evt.schedule.kind: election timetable, school calendar, parliamentary calendar, budget calendar, public holidays of a year. */
    scheduleKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.schedule.kind"),
    /** The event the offsets count from (the polling day of an election timetable). */
    anchorEventId: belongsTo(() => Events).maybe(),
    anchorOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    issuerEntityId: belongsTo(() => Entities).maybe(),
    basisProvisionId: belongsTo(() => Provisions).maybe(),
    /** Scheme evt.schedule.status: draft, published, amended, superseded, withdrawn. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.evt.schedule.status"),
    /** The schedule this one replaces or amends. */
    supersedesScheduleId: belongsTo(() => Schedules).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("schedules")
      .index("countryId", "scheduleKindId")
      .index("anchorEventId")
      .index("issuerEntityId")
      .index("statusId")
      .index("supersedesScheduleId")
      .index("sourceCitationId"),
  });

/*---------------- event.items ----------------*/
export const Items = event
  .schema("Items", {
    scheduleId: belongsTo(() => Schedules),
    /** The event this item is a dated instance of (nominations close, registration opens). */
    eventId: belongsTo(() => Events),
    /** The occurrence produced once the plan is dated. */
    occurrenceId: belongsTo(() => Occurrences).maybe(),
    /** Days from the anchor: negative before it, zero on it, positive after it. */
    offsetDays: dryv.field(sharedProperties.Integer).maybe(),
    /** True when the offset counts working days. */
    countsWorkingDays: dryv.field(sharedProperties.Flag),
    position: dryv.field(sharedProperties.NonNegativeInteger),
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became.")
  .role("entity")
  .facets({ storage: dryv.storage("items").unique("scheduleId", "position").index("eventId").index("occurrenceId") });

/*---------------- event.seasons ----------------*/
export const Seasons = event
  .schema("Seasons", {
    countryId: belongsTo(() => Country),
    /** The place the season applies to; absent for the whole country. */
    scopeFeatureId: belongsTo(() => Features).maybe(),
    /** Scheme evt.season.kind: long rains, short rains, dry season, harvest, planting, flood risk, cold season, school term. */
    seasonKindId: belongsTo(() => Value).tags("scheme:ref.sch.evt.season.kind"),
    /** The yearly window; the end may be earlier in the calendar than the start when the season crosses the year end. */
    startMonth: dryv.field(sharedProperties.PositiveInteger),
    startDay: dryv.field(sharedProperties.PositiveInteger).maybe(),
    endMonth: dryv.field(sharedProperties.PositiveInteger),
    endDay: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** True for natural cycles (rains, drought risk), false for human calendars (school terms). */
    isNatural: dryv.field(sharedProperties.Flag),
    description: dryv.field(sharedProperties.Description).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .description(
    "A recurring yearly window, natural or human: the long rains, a planting season, a school term, for a country or a place. Gives the calendar its seasonal context and explains recurring patterns in data.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("seasons").index("countryId", "seasonKindId").index("scopeFeatureId").index("sourceCitationId"),
  });

/*---------------- event.venues ----------------*/
export const Venues = event
  .schema("Venues", {
    occurrenceId: belongsTo(() => Occurrences),
    /** A place where it happens: a stadium, a town, a county, or one of thousands of polling places. */
    featureId: belongsTo(() => Features),
    /** Scheme evt.venue.role: main venue, additional venue, area covered, broadcast point. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.evt.venue.role"),
    /** How the place is used (the stand, the hall, the ward polling for the whole election). */
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "One place an occurrence happens at. An occurrence can have many: a national election covers every county and polling place.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("venues").unique("occurrenceId", "featureId", "roleId").index("featureId").index("roleId"),
  });
