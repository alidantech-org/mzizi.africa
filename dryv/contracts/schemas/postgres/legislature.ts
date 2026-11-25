/**
 * Schema: legislature | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 30.5 and 32 (approved 2026-11-25).
 * Contract authors: `votes` and `speeches` are hash-partitioned by `country_id` (section 18), so their keys and every
 * link into them carry `country_id`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, identityKindField, identityReference, term } from "./_links.ts";
import { Occurrences } from "./event.ts";
import { Periods, Revisions } from "./finance.ts";
import { Versions } from "./filesystem.ts";
import { GovernanceTerms, Holders, Institutions } from "./governance.ts";
import { Instruments, Provisions } from "./legal.ts";
import { Articles, Assets } from "./media.ts";
import { Parties } from "./politics.ts";
import { Countries, Languages } from "./reference.ts";

export const legislature = dryv
  .group({ name: "legislature" })
  .description(
    "Lawmaking proceedings: sittings, agenda, bills and their stages, motions, votes, Hansard, speeches, summaries and attachments.",
  )
  .facets({ storage: { namespace: "legislature", store: "main" } });

export const legislatureProperties = legislature.properties({
  VoteChoice: dryv.property.enum({ Yes: "yes", No: "no", Abstain: "abstain", Absent: "absent" }),
  HansardStatus: dryv.property.enum({ Provisional: "provisional", Final: "final" }),
  TextOrigin: dryv.property.enum({ Original: "original", Human: "human", Machine: "machine" }),
  TextStatus: dryv.property.enum({ Draft: "draft", Reviewed: "reviewed", Published: "published" }),
  Session: dryv.property.string().length({ min: 1, max: 100 }),
  Reference: dryv.property.string().length({ min: 1, max: 255 }),
  Summary: dryv.property.string().length({ min: 1, max: 8000 }),
  Seconds: dryv.property.number().range({ min: 0 }),
});

/*---------------- legislature.sittings ----------------*/
export const Sittings = legislature
  .schema("Sittings", {
    institutionId: belongsTo(() => Institutions).description("The house or committee that sat."),
    occurrenceId: belongsTo(() => Occurrences)
      .maybe()
      .description("The civic-calendar occurrence, so the sitting has real dates."),
    kindTerm: term("leg.sitting.kind", "plenary, committee, special sitting."),
    termId: belongsTo(() => GovernanceTerms).maybe(),
    session: dryv.field(legislatureProperties.Session).maybe(),
    sequence: dryv.field(sharedProperties.PositiveInteger).maybe().description("The sitting's number in the session."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One sitting of a house or committee.")
  .role("entity")
  .facets({ storage: dryv.storage("sittings").index("institutionId", "termId").index("occurrenceId") });

/*---------------- legislature.bills ----------------*/
export const Bills = legislature
  .schema("Bills", {
    identityKind: identityKindField("bill"),
    institutionId: belongsTo(() => Institutions),
    kindTerm: term("leg.bill.kind", "public, private member's, money, county bill."),
    statusTerm: term("leg.bill.status", "published, in committee, passed, assented, withdrawn, lapsed."),
    sponsorId: belongsTo(() => Holders)
      .maybe()
      .description("The member who sponsors the bill, as a holder in office."),
    termId: belongsTo(() => GovernanceTerms).maybe(),
    instrumentId: belongsTo(() => Instruments)
      .maybe()
      .description("The Act the bill became."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("BillKind", (v) => v.identityKind.eq("bill"))
  .description("A bill. Its titles are `identity.names`; its summaries are `legislature.summaries`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("bills")
      .index("institutionId", "termId")
      .index("statusTerm")
      .index("sponsorId")
      .references("BillIsIdentity", identityReference),
  });

/*---------------- legislature.motions ----------------*/
export const Motions = legislature
  .schema("Motions", {
    sittingId: belongsTo(() => Sittings),
    kindTerm: term("leg.motion.kind", "reading, amendment, approval, adjournment."),
    outcomeTerm: term("leg.motion.outcome", "carried, negatived, withdrawn.").maybe(),
    moverId: belongsTo(() => Holders).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    provisionId: belongsTo(() => Provisions).maybe(),
    revisionId: belongsTo(() => Revisions)
      .maybe()
      .description("The budget revision the motion approves."),
    periodId: belongsTo(() => Periods).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A motion debated at a sitting.")
  .role("entity")
  .facets({ storage: dryv.storage("motions").index("sittingId").index("billId").index("moverId") });

/*---------------- legislature.agenda ----------------*/
export const Agenda = legislature
  .schema("Agenda", {
    sittingId: belongsTo(() => Sittings, { onDelete: "cascade" }),
    position: dryv.field(sharedProperties.PositiveInteger),
    kindTerm: term("leg.agenda.kind", "prayers, statements, bills, motions, questions."),
    motionId: belongsTo(() => Motions).maybe(),
    billId: belongsTo(() => Bills).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("AgendaHasAtMostOneItem", rule.atMostOne("motionId", "billId"))
  .description("One item of a sitting's order paper.")
  .role("entity")
  .facets({ storage: dryv.storage("agenda").unique("sittingId", "position") });

/*---------------- legislature.stages ----------------*/
export const Stages = legislature
  .schema("Stages", {
    billId: belongsTo(() => Bills, { onDelete: "cascade" }),
    kindTerm: term("leg.stage.kind", "first reading, committee, second reading, third reading, assent."),
    sittingId: belongsTo(() => Sittings).maybe(),
    motionId: belongsTo(() => Motions).maybe(),
    onDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    outcomeTerm: term("leg.stage.outcome", "passed, rejected, deferred.").maybe(),
    sequence: dryv.field(sharedProperties.PositiveInteger),
  })
  .extends(baseSchemas.Entity)
  .description("A stage a bill passes through.")
  .role("entity")
  .facets({ storage: dryv.storage("stages").unique("billId", "sequence").index("sittingId") });

/*---------------- legislature.votes ----------------*/
export const Votes = legislature
  .schema("Votes", {
    motionId: belongsTo(() => Motions),
    holderId: belongsTo(() => Holders),
    choice: dryv.field(legislatureProperties.VoteChoice),
    partyId: belongsTo(() => Parties)
      .maybe()
      .description("The party the member voted as, recorded at the time of the vote."),
    countryId: belongsTo(() => Countries).description("Partition key."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .description("How one member voted on one motion.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("votes")
      .partitioning(byCountry("votes"))
      .primaryKey("id", "countryId")
      .unique("countryId", "motionId", "holderId")
      .index("countryId", "holderId")
      .index("partyId"),
  });

/*---------------- legislature.hansards ----------------*/
export const Hansards = legislature
  .schema("Hansards", {
    sittingId: belongsTo(() => Sittings),
    artifactId: belongsTo(() => Versions)
      .maybe()
      .description("The stored Hansard document."),
    languageId: belongsTo(() => Languages),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    reference: dryv.field(legislatureProperties.Reference).maybe(),
    status: dryv.field(legislatureProperties.HansardStatus),
  })
  .extends(baseSchemas.CodedEntity)
  .description("The official record of a sitting.")
  .role("entity")
  .facets({ storage: dryv.storage("hansards").index("sittingId") });

/*---------------- legislature.speeches ----------------*/
export const Speeches = legislature
  .schema("Speeches", {
    sittingId: belongsTo(() => Sittings),
    holderId: belongsTo(() => Holders).maybe(),
    motionId: belongsTo(() => Motions).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    hansardId: belongsTo(() => Hansards).maybe(),
    kindTerm: term("leg.speech.kind", "contribution, statement, question, answer."),
    position: dryv.field(sharedProperties.PositiveInteger).description("Order in the sitting."),
    page: dryv.field(sharedProperties.PositiveInteger).maybe().description("Hansard page."),
    wordCount: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    countryId: belongsTo(() => Countries).description("Partition key."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .description("One speech in a sitting.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("speeches")
      .partitioning(byCountry("speeches"))
      .primaryKey("id", "countryId")
      .index("countryId", "sittingId", "position")
      .index("countryId", "holderId")
      .index("billId"),
  });

/*---------------- legislature.summaries ----------------*/
export const Summaries = legislature
  .schema("Summaries", {
    billId: belongsTo(() => Bills, { onDelete: "cascade" }).maybe(),
    motionId: belongsTo(() => Motions, { onDelete: "cascade" }).maybe(),
    speechId: dryv.field(sharedProperties.Id).maybe(),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("With `speech_id`, the speech's partition key."),
    agendaId: belongsTo(() => Agenda, { onDelete: "cascade" }).maybe(),
    languageId: belongsTo(() => Languages),
    text: dryv.field(legislatureProperties.Summary),
    origin: dryv.field(legislatureProperties.TextOrigin),
    status: dryv.field(legislatureProperties.TextStatus),
  })
  .extends(baseSchemas.Entity)
  .rule("SummaryHasOneSubject", rule.exactlyOne("billId", "motionId", "speechId", "agendaId"))
  .rule("SpeechSummaryHasCountry", (v) => v.speechId.isNull().or(v.countryId.isNotNull()))
  .description("A title or summary of a bill, motion, speech or agenda item in one language.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("summaries")
      .index("billId")
      .index("motionId")
      .index("speechId")
      .references("SummaryOfSpeech", {
        fields: ["speechId", "countryId"],
        target: () => Speeches,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- legislature.attachments ----------------*/
export const Attachments = legislature
  .schema("Attachments", {
    sittingId: belongsTo(() => Sittings, { onDelete: "cascade" }).maybe(),
    billId: belongsTo(() => Bills, { onDelete: "cascade" }).maybe(),
    speechId: dryv.field(sharedProperties.Id).maybe(),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("With `speech_id`, the speech's partition key."),
    assetId: belongsTo(() => Assets).maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    purposeTerm: term("med.attachment.purpose", "video, document, photo, transcript."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    startSecond: dryv.field(legislatureProperties.Seconds).maybe(),
    endSecond: dryv.field(legislatureProperties.Seconds).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("AttachmentHasOneRow", rule.exactlyOne("sittingId", "billId", "speechId"))
  .rule("AttachmentHasOneMedia", rule.exactlyOne("assetId", "articleId"))
  .rule("SpeechAttachmentHasCountry", (v) => v.speechId.isNull().or(v.countryId.isNotNull()))
  .description("Media on proceedings that are not identities (the parliamentary video of a speech).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("attachments")
      .index("sittingId")
      .index("billId")
      .index("speechId")
      .references("AttachmentOfSpeech", {
        fields: ["speechId", "countryId"],
        target: () => Speeches,
        targetFields: ["id", "countryId"],
      }),
  });
