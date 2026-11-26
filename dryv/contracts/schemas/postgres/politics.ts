/**
 * Schema: politics | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 30.6 and 32 (approved 2026-11-25).
 * Contract authors: parties, coalitions and memberships, manifestos, commitments (manifesto pledges, campaign promises
 * and office pledges are one concept) with their fulfilments, and political contributions. Contests are in `election`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Contracts, Projects } from "./civic.ts";
import { Candidates, Elections } from "./election.ts";
import { Occurrences } from "./event.ts";
import { Appropriations } from "./finance.ts";
import { Versions } from "./filesystem.ts";
import { Features } from "./geography.ts";
import { Offices } from "./governance.ts";
import { Instruments } from "./legal.ts";
import { Bills, Speeches } from "./legislature.ts";
import { Articles, Assets } from "./media.ts";
import { Individuals } from "./official.ts";
import { Countries, Currencies, Languages, Units } from "./reference.ts";

export const politics = dryv
  .group({ name: "politics" })
  .description(
    "Parties, coalitions, memberships, manifestos, commitments and their fulfilments, and political contributions.",
  )
  .facets({ storage: { namespace: "politics", store: "main" } });

const politicsProperties = politics.properties({
  CommitmentKind: dryv.property.enum({
    ManifestoPledge: "manifesto-pledge",
    CampaignPromise: "campaign-promise",
    OfficePledge: "office-pledge",
  }),
  Statement: dryv.property.string().length({ min: 1, max: 8000 }),
  Seconds: dryv.property.number().range({ min: 0 }),
});

const dates = {
  startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
};

/*---------------- politics.parties ----------------*/
export const Parties = politics
  .schema("Parties", {
    identityKind: identityKindField("entity"),
    kindTerm: term("pol.party.kind", "national party, regional party, independent grouping."),
    countryId: belongsTo(() => Countries),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("PartyKind", (v) => v.identityKind.eq("entity"))
  .rule("PartyPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A political party; it shares its organisation's identity (`official.entities`).")
  .role("entity")
  .facets({
    storage: dryv.storage("parties").index("countryId", "kindTerm").references("PartyIsIdentity", identityReference),
  });

/*---------------- politics.memberships ----------------*/
export const Memberships = politics
  .schema("Memberships", {
    partyId: belongsTo(() => Parties),
    individualId: belongsTo(() => Individuals),
    kindTerm: term("pol.membership.kind", "member, leader, official, nominee."),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.Entity)
  .rule("MembershipPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A person's dated membership of a party.")
  .role("entity")
  .facets({ storage: dryv.storage("memberships").index("partyId", "fromYear").index("individualId") });

/*---------------- politics.coalitions ----------------*/
export const Coalitions = politics
  .schema("Coalitions", {
    identityKind: identityKindField("coalition"),
    kindTerm: term("pol.coalition.kind", "pre-election coalition, government coalition."),
    countryId: belongsTo(() => Countries),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("CoalitionPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("CoalitionKind", (v) => v.identityKind.eq("coalition"))
  .description("A coalition of parties (Azimio, Kenya Kwanza).")
  .role("entity")
  .facets({ storage: dryv.storage("coalitions").index("countryId").references("CoalitionIsIdentity", identityReference) });

/*---------------- politics.alignments ----------------*/
export const Alignments = politics
  .schema("Alignments", {
    coalitionId: belongsTo(() => Coalitions, { onDelete: "cascade" }),
    partyId: belongsTo(() => Parties),
    kindTerm: term("pol.alignment.kind", "founding member, affiliate, observer."),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("AlignmentPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A party's dated place in a coalition.")
  .role("entity");

/*---------------- politics.manifestos ----------------*/
export const Manifestos = politics
  .schema("Manifestos", {
    partyId: belongsTo(() => Parties).maybe(),
    candidateId: belongsTo(() => Candidates).maybe(),
    electionId: belongsTo(() => Elections).maybe(),
    artifactId: belongsTo(() => Versions)
      .maybe()
      .description("The original manifesto document."),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ManifestoHasOneAuthor", rule.exactlyOne("partyId", "candidateId"))
  .description("A party's or candidate's manifesto for an election.")
  .role("entity")
  .facets({ storage: dryv.storage("manifestos").index("partyId").index("candidateId").index("electionId") });

Alignments.facets({
  storage: dryv
    .storage("alignments")
    .indexes({
      description: "One alignment per coalition, party and start year.",
      fields: ["coalitionId", "partyId", "fromYear"],
      unique: true,
      nullsNotDistinct: true,
    })
    .index("partyId"),
});

/*---------------- politics.commitments ----------------*/
export const Commitments = politics
  .schema("Commitments", {
    makerId: identity("Who made the commitment: a person, party or office."),
    kind: dryv.field(politicsProperties.CommitmentKind).description("manifesto pledge, campaign promise or office pledge."),
    manifestoId: belongsTo(() => Manifestos).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    statement: dryv.field(politicsProperties.Statement).description("The original words, in `language_id`."),
    languageId: belongsTo(() => Languages),
    topicTerm: term("topic", "The policy area.").maybe(),
    placeId: belongsTo(() => Features)
      .maybe()
      .description("The place the commitment concerns."),
    quantity: dryv.field(sharedProperties.Number).maybe().description("Promised amount (10 000 classrooms), in `unit_id`."),
    unitId: belongsTo(() => Units).maybe(),
    madeOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    dueOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...periodFields,
    occurrenceId: belongsTo(() => Occurrences)
      .maybe()
      .description("The event where it was made."),
    speechId: dryv.field(sharedProperties.Id).maybe().description("The speech where it was made."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("With `speech_id`, the speech's partition key."),
    status: dryv.field(enums.CommitmentStatus).description("not started, in progress, fulfilled, broken."),
    statusAsOf: dryv.field(sharedProperties.CalendarDate).maybe().description("Date the status was last assessed."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("QuantityHasUnit", (v) => v.quantity.isNull().or(v.unitId.isNotNull()))
  .rule("SpeechCommitmentHasCountry", (v) => v.speechId.isNull().or(v.countryId.isNotNull()))
  .description("A promise someone with public power made, in their original words, with its status.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("commitments")
      .index("makerId")
      .index("manifestoId")
      .index("officeId")
      .index("status")
      .references("CommitmentInSpeech", {
        fields: ["speechId", "countryId"],
        target: () => Speeches,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- politics.fulfilments ----------------*/
export const Fulfilments = politics
  .schema("Fulfilments", {
    commitmentId: belongsTo(() => Commitments, { onDelete: "cascade" }),
    projectId: belongsTo(() => Projects).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    appropriationId: belongsTo(() => Appropriations).maybe(),
    billId: belongsTo(() => Bills).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    kind: dryv.field(enums.FulfilmentKind).description("delivers, partly delivers, contradicts."),
    status: dryv.field(enums.FulfilmentStatus).description("claimed, verified, disputed."),
    recordedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("FulfilmentHasOneTarget", rule.exactlyOne("projectId", "contractId", "appropriationId", "billId", "instrumentId"))
  .description("What delivered (or contradicts) a commitment: a project, contract, appropriation, bill or law.")
  .role("entity")
  .facets({ storage: dryv.storage("fulfilments").index("commitmentId").index("projectId").index("contractId") });

/*---------------- politics.contributions ----------------*/
export const Contributions = politics
  .schema("Contributions", {
    donorId: identity("Who gave."),
    recipientId: identity("Who received: a party or candidate."),
    electionId: belongsTo(() => Elections).maybe(),
    amount: dryv.field(sharedProperties.AmountMinorUnits).maybe().description("Whole minor units of `currency_id`."),
    currencyId: belongsTo(() => Currencies).maybe(),
    isInKind: dryv.field(sharedProperties.Flag),
    givenOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    status: dryv.field(enums.ContributionStatus).description("declared, reported, disputed."),
    versionId: belongsTo(() => Versions)
      .maybe()
      .description("The disclosure file."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("AmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A political donation or in-kind contribution as disclosed.")
  .role("entity")
  .facets({ storage: dryv.storage("contributions").index("donorId").index("recipientId").index("electionId") });

/*---------------- politics.attachments ----------------*/
export const Attachments = politics
  .schema("Attachments", {
    commitmentId: belongsTo(() => Commitments, { onDelete: "cascade" }).maybe(),
    fulfilmentId: belongsTo(() => Fulfilments, { onDelete: "cascade" }).maybe(),
    manifestoId: belongsTo(() => Manifestos, { onDelete: "cascade" }).maybe(),
    assetId: belongsTo(() => Assets).maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    purposeTerm: term("med.attachment.purpose", "video, document, photo, transcript."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    startSecond: dryv.field(politicsProperties.Seconds).maybe(),
    endSecond: dryv.field(politicsProperties.Seconds).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("AttachmentHasOneRow", rule.exactlyOne("commitmentId", "fulfilmentId", "manifestoId"))
  .rule("AttachmentHasOneMedia", rule.exactlyOne("assetId", "articleId"))
  .description("Media on commitments, fulfilments and manifestos (the video of a promise).")
  .role("entity")
  .facets({ storage: dryv.storage("attachments").index("commitmentId").index("fulfilmentId").index("manifestoId") });
