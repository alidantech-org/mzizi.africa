/**
 * Schema: activities | Database: mzizi
 * What public bodies do and decide: sittings, motions, bills, budget decisions and the vote or absence of every member.
 * It serves every kind of body (legislature, county assembly, cabinet, courts) through the institution and office
 * holder links, and ties a motion to the law provision, budget or fiscal year it concerns.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { BudgetVersions, FiscalPeriods } from "./finance.ts";
import { Holders, Institutions } from "./governance.ts";
import { Features } from "./geography.ts";
import { Instruments, Provisions } from "./legal.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Language, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const activities = dryv
  .group({ name: "activities" })
  .description("Sittings, motions, votes and contributions of public bodies.")
  .facets({ storage: { namespace: "activities", store: "main" } });

/*---------------- activities.sittings ----------------*/
export const Sittings = activities
  .schema("Sittings", {
    institutionId: belongsTo(() => Institutions),
    /** Scheme act.sitting.kind: plenary, committee, cabinet meeting, bench, county assembly sitting. */
    sittingKindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    heldOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One meeting of a public body on one day.")
  .role("entity")
  .facets({ storage: dryv.storage("sittings").index("institutionId", "heldOn").index("sourceCitationId") });

/*---------------- activities.motions ----------------*/
export const Motions = activities
  .schema("Motions", {
    sittingId: belongsTo(() => Sittings),
    /** Scheme act.motion.kind: bill, motion, budget estimate, appointment, resolution, judgment, executive decision. */
    motionKindId: belongsTo(() => Value),
    /** Scheme act.motion.outcome: passed, rejected, withdrawn, deferred, pending. */
    outcomeId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    summary: dryv.field(sharedProperties.Description).maybe(),
    movedByHolderId: belongsTo(() => Holders).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    provisionId: belongsTo(() => Provisions).maybe(),
    budgetVersionId: belongsTo(() => BudgetVersions).maybe(),
    fiscalPeriodId: belongsTo(() => FiscalPeriods).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One matter put to a sitting: a bill, motion, budget decision or other resolution, with its outcome.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("motions")
      .index("sittingId")
      .index("instrumentId")
      .index("provisionId")
      .index("budgetVersionId")
      .index("fiscalPeriodId")
      .index("sourceCitationId"),
  });

/*---------------- activities.votes ----------------*/
export const Votes = activities
  .schema("Votes", {
    motionId: belongsTo(() => Motions),
    holderId: belongsTo(() => Holders),
    /** Scheme act.vote.position: yes, no, abstain, absent. */
    positionId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One office holder's recorded position on one motion, including being absent.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("votes")
      .unique("motionId", "holderId")
      .index("holderId")
      .index("positionId")
      .index("sourceCitationId"),
  });

/*---------------- activities.contributions ----------------*/
export const Contributions = activities
  .schema("Contributions", {
    sittingId: belongsTo(() => Sittings),
    holderId: belongsTo(() => Holders),
    motionId: belongsTo(() => Motions).maybe(),
    /** Scheme act.contribution.kind: speech, question, statement, petition. */
    contributionKindId: belongsTo(() => Value),
    summary: dryv.field(sharedProperties.Description).maybe(),
    wordCount: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One member's speech, question or statement at a sitting.")
  .role("entity")
  .facets({
    storage: dryv.storage("contributions").index("sittingId").index("holderId").index("motionId").index("sourceCitationId"),
  });


/*---------------- activities.events ----------------*/
export const Events = activities
  .schema("Events", {
    countryId: belongsTo(() => Country).maybe(),
    /** Scheme act.event.kind: public holiday, national day, general election, election milestone, sitting, visit, deadline, commemoration, court date, other. */
    eventKindId: belongsTo(() => Value).tags("scheme:ref.sch.act.event.kind"),
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

/*---------------- activities.event_names ----------------*/
export const EventNames = activities
  .schema("EventNames", {
    eventId: belongsTo(() => Events),
    languageId: belongsTo(() => Language),
    name: dryv.field(sharedProperties.Name),
    isPreferred: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .description("The name of an event in one language; at most one preferred name per event and language.")
  .role("entity");

const preferredEventName = activities.expression(
  "PreferredEventName",
  EventNames.check((v) => v.isPreferred.eq(true)),
);

EventNames.facets({
  storage: dryv
    .storage("event_names")
    .unique("eventId", "languageId", "name")
    .unique("eventId", "languageId")
    .where(preferredEventName)
    .index("languageId"),
});

/*---------------- activities.event_rules ----------------*/
export const EventRules = activities
  .schema("EventRules", {
    eventId: belongsTo(() => Events),
    /** Scheme act.rule.kind: fixed date, nth weekday of a month, every n years from an anchor, once. */
    ruleKindId: belongsTo(() => Value).tags("scheme:ref.sch.act.rule.kind"),
    month: dryv.field(sharedProperties.PositiveInteger).maybe(),
    dayOfMonth: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** 1 (Monday) to 7 (Sunday) for a weekday rule. */
    weekday: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** Which weekday of the month: 1 first, 2 second, and so on. */
    nthWeekday: dryv.field(sharedProperties.PositiveInteger).maybe(),
    intervalYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** The first occurrence a repeating rule counts from. */
    anchorOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Scheme act.rule.adjustment: none, next weekday when on a rest day, previous weekday, next Monday when on a Sunday. */
    adjustmentId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.act.rule.adjustment"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.PeriodEntity)
  .description(
    "How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("event_rules").index("eventId").index("ruleKindId").index("sourceCitationId") });

/*---------------- activities.occurrences ----------------*/
export const Occurrences = activities
  .schema("Occurrences", {
    eventId: belongsTo(() => Events),
    plannedStartsOn: dryv.field(sharedProperties.CalendarDate),
    plannedEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualStartsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    actualEndsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Time of day when known; the dates above are the calendar days. */
    startsAt: dryv.field(sharedProperties.Instant).maybe(),
    /** Scheme act.occurrence.status: scheduled, rescheduled, postponed, adjourned, cancelled, held. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.act.occurrence.status"),
    /** Scheme act.occurrence.knowledge: projected from a rule, announced, confirmed. How we know the date. */
    knowledgeId: belongsTo(() => Value).tags("scheme:ref.sch.act.occurrence.knowledge"),
    /** Where it happens, as a place (a stadium, a hall, a town). */
    venueFeatureId: belongsTo(() => Features).maybe(),
    venueNote: dryv.field(sharedProperties.Description).maybe(),
    /** Scheme act.occurrence.format: in person, online, hybrid, broadcast. How it happens. */
    formatId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.act.occurrence.format"),
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

/*---------------- activities.occurrence_changes ----------------*/
export const OccurrenceChanges = activities
  .schema("OccurrenceChanges", {
    occurrenceId: belongsTo(() => Occurrences),
    /** Scheme act.change.kind: reschedule, postpone, adjourn, cancel, confirm, move venue. */
    changeKindId: belongsTo(() => Value).tags("scheme:ref.sch.act.change.kind"),
    /** Scheme act.change.reason: falls on a rest day, court order, emergency, declared by authority, security, weather, legal requirement. */
    reasonId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.act.change.reason"),
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
      .storage("occurrence_changes")
      .index("occurrenceId", "decidedOn")
      .index("changeKindId")
      .index("reasonId")
      .index("authorityEntityId")
      .index("basisProvisionId")
      .index("replacementOccurrenceId")
      .index("sourceCitationId"),
  });

/*---------------- activities.event_subjects ----------------*/
export const EventSubjects = activities
  .schema("EventSubjects", {
    eventId: belongsTo(() => Events),
    /** Scheme act.subject.role: about, milestone of, venue for, concerns. How the event relates to the subject. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.act.subject.role"),
  })
  .extends(baseSchemas.CodedSubjectEntity)
  .description(
    "What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("event_subjects").unique("eventId", "subjectTable", "subjectId", "roleId").index("subjectTable", "subjectId"),
  });

/*---------------- activities.event_participants ----------------*/
export const EventParticipants = activities
  .schema("EventParticipants", {
    occurrenceId: belongsTo(() => Occurrences),
    entityId: belongsTo(() => Entities).maybe(),
    individualId: belongsTo(() => Individuals).maybe(),
    /** Scheme act.participant.role: organiser, host, guest of honour, attendee, observer, speaker. */
    roleId: belongsTo(() => Value).tags("scheme:ref.sch.act.participant.role"),
  })
  .extends(baseSchemas.Entity)
  .rule("ExactlyOneParticipant", rule.exactlyOne("entityId", "individualId"))
  .description("One organisation or person taking part in one occurrence in a role.")
  .role("entity")
  .facets({ storage: dryv.storage("event_participants").index("occurrenceId").index("entityId").index("individualId").index("roleId") });
