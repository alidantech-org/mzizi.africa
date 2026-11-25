/**
 * Schema: civic | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 30.8 and 32 (approved 2026-11-25).
 * Contract authors: delivery of public money: services, facilities, projects and their sites, procurement, bids,
 * contracts, variations, deliveries, line items, prepared scores and the people and firms involved. Scores are
 * reviewable model output, never findings. Payments are `finance.flows`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Goods } from "./economy.ts";
import { Features } from "./geography.ts";
import { Holders, Institutions, Jurisdictions } from "./governance.ts";
import { Articles, Assets } from "./media.ts";
import { Countries, Currencies, Languages, Units } from "./reference.ts";

export const civic = dryv
  .group({ name: "civic" })
  .description(
    "The delivery of public money: services, facilities, projects, procurement, contracts, deliveries, line items, scores and roles.",
  )
  .facets({ storage: { namespace: "civic", store: "main" } });

const civicProperties = civic.properties({
  ScoreBasis: dryv.property.enum({
    Survey: "survey",
    StandardCost: "standard-cost",
    Contracts: "contracts",
    Modelled: "modelled",
  }),
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
  Seconds: dryv.property.number().range({ min: 0 }),
  SignedAmount: dryv.property.number.int64(),
});

const dates = {
  startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
};
const money = (meaning: string) => ({
  amount: dryv
    .field(sharedProperties.AmountMinorUnits)
    .maybe()
    .description(`${meaning}, in whole minor units of \`currency_id\`.`),
  currencyId: belongsTo(() => Currencies).maybe(),
});

/*---------------- civic.services ----------------*/
export const Services = civic
  .schema("Services", {
    identityKind: identityKindField("service"),
    providerId: identity("The organisation that provides the service.").maybe(),
    institutionId: belongsTo(() => Institutions)
      .maybe()
      .description("The responsible public institution."),
    kindTerm: term("civ.service.kind", "health, water, registration, licensing."),
    featureId: belongsTo(() => Features).maybe(),
    scopeId: belongsTo(() => Jurisdictions)
      .maybe()
      .description("The jurisdiction the service is offered under."),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ServiceKind", (v) => v.identityKind.eq("service"))
  .description("A public service. Its names and descriptions are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("services")
      .index("institutionId")
      .index("kindTerm")
      .references("ServiceIsIdentity", identityReference),
  });

/*---------------- civic.facilities ----------------*/
export const Facilities = civic
  .schema("Facilities", {
    identityKind: identityKindField("feature"),
    classTerm: term("civ.facility.class", "hospital, school, police station, government office."),
    countryId: belongsTo(() => Countries),
    operatorId: identity("Who runs it.").maybe(),
    ownerId: identity("Who owns it.").maybe(),
    institutionId: belongsTo(() => Institutions).maybe(),
    ownershipTerm: term("civ.facility.ownership", "public, private, faith-based, community.").maybe(),
    statusTerm: term("civ.facility.status", "operational, under construction, closed.").maybe(),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("FacilityKind", (v) => v.identityKind.eq("feature"))
  .description(
    'A public facility; it shares its geography feature\'s identity, so "near me" is a spatial query on the feature.',
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("facilities")
      .index("countryId", "classTerm")
      .index("institutionId")
      .references("FacilityIsIdentity", identityReference),
  });

/*---------------- civic.projects ----------------*/
export const Projects = civic
  .schema("Projects", {
    identityKind: identityKindField("project"),
    institutionId: belongsTo(() => Institutions).maybe(),
    sponsorId: identity("Who funds the project.").maybe(),
    implementerId: identity("Who implements it.").maybe(),
    countryId: belongsTo(() => Countries),
    scopeId: belongsTo(() => Jurisdictions).maybe(),
    statusTerm: term("civ.project.status", "planned, ongoing, complete, stalled, abandoned."),
    ...periodFields,
    ...dates,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ProjectKind", (v) => v.identityKind.eq("project"))
  .description("A public project. Its names and descriptions are `identity.names`; its places are `civic.sites`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("projects")
      .index("countryId", "statusTerm")
      .index("institutionId")
      .references("ProjectIsIdentity", identityReference),
  });

/*---------------- civic.sites ----------------*/
export const Sites = civic
  .schema("Sites", {
    projectId: belongsTo(() => Projects, { onDelete: "cascade" }),
    featureId: belongsTo(() => Features),
    kindTerm: term("civ.site.kind", "location, beneficiary area, route."),
  })
  .extends(baseSchemas.Entity)
  .description("A place a project touches.")
  .role("entity")
  .facets({ storage: dryv.storage("sites").unique("projectId", "featureId", "kindTerm").index("featureId") });

/*---------------- civic.procurements ----------------*/
export const Procurements = civic
  .schema("Procurements", {
    identityKind: identityKindField("procurement"),
    projectId: belongsTo(() => Projects).maybe(),
    categoryTerm: term("civ.procurement.category", "goods, works, services, consultancy."),
    natureTerm: term("civ.procurement.nature", "new, framework, renewal.").maybe(),
    buyerId: identity("The procuring entity."),
    countryId: belongsTo(() => Countries),
    procedureTerm: term("civ.procurement.procedure", "open tender, restricted, direct, request for quotation."),
    statusTerm: term("civ.procurement.status", "planned, open, evaluation, awarded, cancelled."),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    closesOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...money("Estimated value"),
    bidderCount: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    evaluationTerm: term("civ.procurement.evaluation", "lowest price, quality and cost, quality only.").maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ProcurementKind", (v) => v.identityKind.eq("procurement"))
  .rule("ProcurementAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A tender. Its title is an `identity.names` row and its tender number an `identity.identifiers` row.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("procurements")
      .index("countryId", "statusTerm")
      .index("buyerId")
      .index("projectId")
      .references("ProcurementIsIdentity", identityReference),
  });

/*---------------- civic.bids ----------------*/
export const Bids = civic
  .schema("Bids", {
    procurementId: belongsTo(() => Procurements, { onDelete: "cascade" }),
    bidderId: identity("The bidding organisation or person."),
    ...money("Bid price"),
    outcomeTerm: term("civ.bid.outcome", "won, lost, disqualified, withdrawn."),
    submittedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("BidAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A bid on a tender, including cheaper bids that lost.")
  .role("entity")
  .facets({ storage: dryv.storage("bids").index("procurementId").index("bidderId") });

/*---------------- civic.contracts ----------------*/
export const Contracts = civic
  .schema("Contracts", {
    procurementId: belongsTo(() => Procurements).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    natureTerm: term("civ.contract.nature", "supply, works, services, framework."),
    contractorId: identity("The contractor."),
    buyerId: identity("The buyer."),
    ...money("Contract value"),
    statusTerm: term("civ.contract.status", "signed, ongoing, completed, terminated."),
    signedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...dates,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ContractAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .rule("ContractDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("A signed contract.")
  .role("entity")
  .facets({
    storage: dryv.storage("contracts").index("procurementId").index("projectId").index("contractorId").index("buyerId"),
  });

/*---------------- civic.variations ----------------*/
export const Variations = civic
  .schema("Variations", {
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }),
    kindTerm: term("civ.variation.kind", "price change, extension, scope change."),
    amountChange: dryv
      .field(civicProperties.SignedAmount)
      .maybe()
      .description("Change in value, in whole minor units; negative for a reduction."),
    currencyId: belongsTo(() => Currencies).maybe(),
    newEndOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    signedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    note: dryv.field(civicProperties.Note).maybe().description("The stated reason, in `note_language_id`."),
    noteLanguageId: belongsTo(() => Languages).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("VariationAmountHasCurrency", (v) => v.amountChange.isNull().or(v.currencyId.isNotNull()))
  .rule("VariationNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("A change to a contract's price, period or scope.")
  .role("entity")
  .facets({ storage: dryv.storage("variations").index("contractId") });

/*---------------- civic.deliveries ----------------*/
export const Deliveries = civic
  .schema("Deliveries", {
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }),
    kindTerm: term("civ.delivery.kind", "interim certificate, completion, handover."),
    ...money("Certified value"),
    deliveredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    featureId: belongsTo(() => Features).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("DeliveryAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("Work delivered and certified under a contract.")
  .role("entity")
  .facets({ storage: dryv.storage("deliveries").index("contractId").index("featureId") });

/*---------------- civic.items ----------------*/
export const Items = civic
  .schema("Items", {
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }).maybe(),
    bidId: belongsTo(() => Bids, { onDelete: "cascade" }).maybe(),
    goodId: belongsTo(() => Goods).description("The catalogue good, service or works item."),
    quantity: dryv.field(sharedProperties.Number),
    unitId: belongsTo(() => Units),
    unitPrice: dryv.field(sharedProperties.AmountMinorUnits).maybe().description("Price per unit in whole minor units."),
    currencyId: belongsTo(() => Currencies).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("ItemHasOneOwner", rule.exactlyOne("contractId", "bidId"))
  .rule("ItemPriceHasCurrency", (v) => v.unitPrice.isNull().or(v.currencyId.isNotNull()))
  .description("A line item of a contract or bid.")
  .role("entity")
  .facets({ storage: dryv.storage("items").index("contractId").index("bidId").index("goodId") });

/*---------------- civic.scores ----------------*/
export const Scores = civic
  .schema("Scores", {
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }).maybe(),
    projectId: belongsTo(() => Projects, { onDelete: "cascade" }).maybe(),
    score: dryv
      .field(sharedProperties.Number)
      .maybe()
      .description("Price ratio against comparable prices; empty when too few."),
    low: dryv.field(sharedProperties.Number).maybe(),
    high: dryv.field(sharedProperties.Number).maybe(),
    comparables: dryv.field(sharedProperties.NonNegativeInteger).description("How many prices were compared."),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    basis: dryv.field(civicProperties.ScoreBasis),
    computedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .rule("ScoreHasOneSubject", rule.exactlyOne("contractId", "projectId"))
  .description(
    "Prepared, reviewable comparison of a contract or project with comparable prices; never a finding or accusation.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("scores").index("contractId").index("projectId") });

/*---------------- civic.roles ----------------*/
export const Roles = civic
  .schema("Roles", {
    procurementId: belongsTo(() => Procurements, { onDelete: "cascade" }).maybe(),
    bidId: belongsTo(() => Bids, { onDelete: "cascade" }).maybe(),
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }).maybe(),
    projectId: belongsTo(() => Projects, { onDelete: "cascade" }).maybe(),
    holderId: belongsTo(() => Holders)
      .maybe()
      .description("The person acting through a public office (a Chief Officer signing)."),
    identityId: identity("The person or organisation acting in their own right.").maybe(),
    roleTerm: term(
      "civ.role",
      "accounting officer, evaluator, signatory, consortium partner, subcontractor, beneficial owner, beneficiary community.",
    ),
    share: dryv.field(sharedProperties.Percentage).maybe(),
    actedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("RoleHasOneRow", rule.exactlyOne("procurementId", "bidId", "contractId", "projectId"))
  .rule("RoleHasOneActor", rule.exactlyOne("holderId", "identityId"))
  .description("The people and organisations involved in procurement, contracts and projects, and how.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("roles")
      .index("procurementId")
      .index("contractId")
      .index("projectId")
      .index("holderId")
      .index("identityId"),
  });

/*---------------- civic.attachments ----------------*/
export const Attachments = civic
  .schema("Attachments", {
    projectId: belongsTo(() => Projects, { onDelete: "cascade" }).maybe(),
    contractId: belongsTo(() => Contracts, { onDelete: "cascade" }).maybe(),
    deliveryId: belongsTo(() => Deliveries, { onDelete: "cascade" }).maybe(),
    assetId: belongsTo(() => Assets).maybe(),
    articleId: belongsTo(() => Articles).maybe(),
    purposeTerm: term("med.attachment.purpose", "photo, document, video."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    startSecond: dryv.field(civicProperties.Seconds).maybe(),
    endSecond: dryv.field(civicProperties.Seconds).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("AttachmentHasOneRow", rule.exactlyOne("projectId", "contractId", "deliveryId"))
  .rule("AttachmentHasOneMedia", rule.exactlyOne("assetId", "articleId"))
  .description("Media on projects, contracts and deliveries (site photos, signed contracts).")
  .role("entity")
  .facets({ storage: dryv.storage("attachments").index("projectId").index("contractId").index("deliveryId") });
