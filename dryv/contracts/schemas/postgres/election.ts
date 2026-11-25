/**
 * Schema: election | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 30.7 and 32 (approved 2026-11-25).
 * Contract authors: results reuse the statistics patterns (collections, priorities, status, revisions); `results` and
 * the prepared `tallies` are hash-partitioned by `country_id`, so links into them carry `country_id`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodProperties } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, identity, identityKindField, identityReference, term } from "./_links.ts";
import { measureProperties } from "./_measures.ts";
import { Events } from "./event.ts";
import { Features } from "./geography.ts";
import { GovernanceTerms, Holders, Offices } from "./governance.ts";
import { Articles, Assets } from "./media.ts";
import { Individuals } from "./official.ts";
import { Parties } from "./politics.ts";
import { Countries, Languages } from "./reference.ts";
import { Collections } from "./statistics.ts";

export const election = dryv
  .group({ name: "election" })
  .description(
    "The contest for office: elections, contests, candidates, referendum choices, stations, turnouts, results, tallies and forms.",
  )
  .facets({ storage: { namespace: "election", store: "main" } });

const electionProperties = election.properties({
  FormStatus: dryv.property.enum({ Provisional: "provisional", Final: "final" }),
  ChoiceText: dryv.property.string().length({ min: 1, max: 1000 }),
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
  Seconds: dryv.property.number().range({ min: 0 }),
});

/*---------------- election.elections ----------------*/
export const Elections = election
  .schema("Elections", {
    identityKind: identityKindField("election"),
    countryId: belongsTo(() => Countries),
    eventId: belongsTo(() => Events)
      .maybe()
      .description("The civic-calendar event; its occurrences hold polling day, reruns and timetable items."),
    kindTerm: term("ele.election.kind", "general, by-election, referendum, primary."),
    statusTerm: term("ele.election.status", "scheduled, held, annulled."),
    heldOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    fromYear: dryv.field(periodProperties.Year).description("The election year."),
    parentId: belongsTo(dryv.self).maybe().description("The general election a by-election or rerun belongs to."),
    termId: belongsTo(() => GovernanceTerms)
      .maybe()
      .description("The term the election fills."),
    authorityId: identity("The body that runs the election (IEBC).").maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ElectionKind", (v) => v.identityKind.eq("election"))
  .description("An election or referendum. Its names are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("elections")
      .index("countryId", "fromYear")
      .index("eventId")
      .index("parentId")
      .references("ElectionIsIdentity", identityReference),
  });

/*---------------- election.contests ----------------*/
export const Contests = election
  .schema("Contests", {
    electionId: belongsTo(() => Elections, { onDelete: "cascade" }),
    officeId: belongsTo(() => Offices)
      .maybe()
      .description("The seat contested; empty for a referendum question."),
    featureId: belongsTo(() => Features)
      .maybe()
      .description("The place that votes."),
    kindTerm: term("ele.contest.kind", "presidential, governor, member of parliament, referendum question."),
    reasonTerm: term("ele.contest.reason", "Why the contest is held (term end, vacancy, nullification).").maybe(),
    previousHolderId: belongsTo(() => Holders).maybe(),
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One contest in an election: one seat or one referendum question for one place.")
  .role("entity")
  .facets({ storage: dryv.storage("contests").index("electionId", "featureId").index("officeId") });

/*---------------- election.candidates ----------------*/
export const Candidates = election
  .schema("Candidates", {
    contestId: belongsTo(() => Contests, { onDelete: "cascade" }),
    individualId: belongsTo(() => Individuals),
    partyId: belongsTo(() => Parties).maybe(),
    kindTerm: term("ele.candidate.kind", "party candidate, independent, running mate."),
    ballotOrder: dryv.field(sharedProperties.PositiveInteger).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A person standing in a contest.")
  .role("entity")
  .facets({
    storage: dryv.storage("candidates").unique("contestId", "individualId").index("individualId").index("partyId"),
  });

/*---------------- election.choices ----------------*/
export const Choices = election
  .schema("Choices", {
    contestId: belongsTo(() => Contests, { onDelete: "cascade" }),
    text: dryv.field(electionProperties.ChoiceText).description("The choice as printed on the ballot."),
    languageId: belongsTo(() => Languages),
    ballotOrder: dryv.field(sharedProperties.PositiveInteger),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A referendum choice (yes, no).")
  .role("entity")
  .facets({ storage: dryv.storage("choices").unique("contestId", "ballotOrder") });

/*---------------- election.stations ----------------*/
export const Stations = election
  .schema("Stations", {
    electionId: belongsTo(() => Elections, { onDelete: "cascade" }),
    featureId: belongsTo(() => Features).description("The polling place as a geography feature."),
    hostId: identity("The institution hosting the station (a school).").maybe(),
    statusTerm: term("ele.station.status", "gazetted, open, relocated, closed.").maybe(),
    registeredVoters: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    streams: dryv.field(sharedProperties.PositiveInteger).maybe(),
    opensAt: dryv.field(sharedProperties.Instant).maybe(),
    closesAt: dryv.field(sharedProperties.Instant).maybe(),
    note: dryv.field(electionProperties.Note).maybe(),
    noteLanguageId: belongsTo(() => Languages).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("StationNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("A polling station in an election.")
  .role("entity")
  .facets({ storage: dryv.storage("stations").unique("electionId", "featureId").index("featureId") });

/*---------------- election.turnouts ----------------*/
export const Turnouts = election
  .schema("Turnouts", {
    contestId: belongsTo(() => Contests, { onDelete: "cascade" }),
    featureId: belongsTo(() => Features),
    registered: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    cast: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    valid: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    rejected: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    spoilt: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    status: dryv.field(measureProperties.FigureStatus),
    collectionId: belongsTo(() => Collections).maybe(),
    revision: dryv.field(sharedProperties.PositiveInteger),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("Registered and cast votes of a contest in one place, by revision.")
  .role("entity")
  .facets({
    storage: dryv.storage("turnouts").unique("contestId", "featureId", "collectionId", "revision").index("featureId"),
  });

/*---------------- election.forms ----------------*/
export const Forms = election
  .schema("Forms", {
    contestId: belongsTo(() => Contests, { onDelete: "cascade" }),
    stationId: belongsTo(() => Stations).maybe(),
    featureId: belongsTo(() => Features).maybe(),
    formTerm: term("ele.form", "The results form (Kenya's 34A, 34B, 34C)."),
    assetId: belongsTo(() => Assets).description("The form as an image, PDF or link to the official portal."),
    status: dryv.field(electionProperties.FormStatus),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("FormHasOnePlace", rule.exactlyOne("stationId", "featureId"))
  .description("An original results document, so a reader can open the form behind any result.")
  .role("entity")
  .facets({ storage: dryv.storage("forms").index("contestId").index("stationId").index("featureId") });

/*---------------- election.results ----------------*/
export const Results = election
  .schema("Results", {
    candidateId: belongsTo(() => Candidates).maybe(),
    choiceId: belongsTo(() => Choices).maybe(),
    featureId: belongsTo(() => Features).description("The place the votes were counted for."),
    votes: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    status: dryv.field(measureProperties.FigureStatus),
    basis: dryv.field(measureProperties.FigureBasis),
    collectionId: belongsTo(() => Collections)
      .maybe()
      .description("The tally or publication the figure belongs to."),
    formId: belongsTo(() => Forms)
      .maybe()
      .description("The form the figure was read from."),
    revision: dryv.field(sharedProperties.PositiveInteger),
    supersedesId: belongsTo(dryv.self).maybe().description("The earlier figure this revision replaces."),
    countryId: belongsTo(() => Countries).description("Partition key."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("ResultHasOneOption", rule.exactlyOne("candidateId", "choiceId"))
  .description("Votes for exactly one candidate or one choice in one place, by collection and revision.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("results")
      .partitioning(byCountry("results"))
      .primaryKey("id", "countryId")
      .index("countryId", "candidateId", "featureId")
      .index("countryId", "choiceId", "featureId")
      .index("countryId", "featureId")
      .index("formId")
      .references("ResultSupersedes", {
        fields: ["supersedesId", "countryId"],
        target: () => Results,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- election.tallies ----------------*/
export const Tallies = election
  .schema("Tallies", {
    contestId: belongsTo(() => Contests),
    candidateId: belongsTo(() => Candidates).maybe(),
    choiceId: belongsTo(() => Choices).maybe(),
    featureId: belongsTo(() => Features),
    votes: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    share: dryv.field(sharedProperties.Percentage).maybe().description("Share of valid votes in the place."),
    status: dryv.field(measureProperties.FigureStatus),
    basis: dryv.field(measureProperties.FigureBasis),
    resultId: belongsTo(() => Results).description("The result chosen with `statistics.priorities`."),
    countryId: belongsTo(() => Countries).description("Partition key."),
    refreshedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.PartitionedRecord)
  .rule("TallyHasOneOption", rule.exactlyOne("candidateId", "choiceId"))
  .description(
    "Prepared: the one result to show per contest, option and place, chosen by the country's priorities (IEBC first).",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("tallies")
      .partitioning(byCountry("tallies"))
      .primaryKey("id", "countryId")
      .index("countryId", "contestId", "featureId")
      .references("TallyOfResult", {
        fields: ["resultId", "countryId"],
        target: () => Results,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- election.attachments ----------------*/
export const Attachments = election
  .schema("Attachments", {
    electionId: belongsTo(() => Elections, { onDelete: "cascade" }).maybe(),
    contestId: belongsTo(() => Contests, { onDelete: "cascade" }).maybe(),
    candidateId: belongsTo(() => Candidates, { onDelete: "cascade" }).maybe(),
    assetId: belongsTo(() => Assets).maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    purposeTerm: term("med.attachment.purpose", "video, document, photo, transcript."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    startSecond: dryv.field(electionProperties.Seconds).maybe(),
    endSecond: dryv.field(electionProperties.Seconds).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("AttachmentHasOneRow", rule.exactlyOne("electionId", "contestId", "candidateId"))
  .rule("AttachmentHasOneMedia", rule.exactlyOne("assetId", "articleId"))
  .description("Media on elections, contests and candidates (a debate video).")
  .role("entity")
  .facets({ storage: dryv.storage("attachments").index("electionId").index("contestId").index("candidateId") });
