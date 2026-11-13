/**
 * Schema: accountability | Database: mzizi (read-only analytical surface; no persisted tables).
 * Derived indicators are read models over Finance, Civic, Politics, Governance and Source evidence.
 * They describe the shape of an indicator row (dimensions, measures, provenance); they never store
 * facts. Persisting programme, contribution, review or commitment facts here would duplicate domain ownership.
 * Computing the rows is a query-layer job, not a table: see TSK-9C953AD7CBB8 for how they are produced.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Projects, Contracts, Procurements, Services } from "./civic.ts";
import { BudgetVersions, FiscalPeriods } from "./finance.ts";
import { Institutions } from "./governance.ts";
import { Units } from "./geography.ts";
import { Manifestos, ManifestoItems } from "./politics.ts";
import { Country, Topic, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const accountability = dryv
  .group({ name: "accountability" })
  .description("Read-only derived accountability indicators; intentionally contains no storage schemas.");

/** Common frame of every indicator row: when it was computed and which reporting period it covers. */
export const Indicator = accountability
  .schema("Indicator", {
    /** When the row was computed. Distinct from the reporting period the figures describe. */
    asOf: dryv.field(sharedProperties.Instant),
    periodFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    periodUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    /** How many source records the row was computed from; zero means no evidence, not a zero result. */
    sourceRecordCount: dryv.field(sharedProperties.NonNegativeInteger),
  })
  .abstract()
  .role("view-model")
  .rule("PeriodIsOrdered", rule.ordered("periodFrom", "periodUntil", { allowEqual: true }))
  .description("Base for derived indicator rows: computation time, reporting period, country and evidence volume.");

export const BudgetExecution = accountability
  .schema("BudgetExecution", {
    budgetVersionId: belongsTo(() => BudgetVersions),
    fiscalPeriodId: belongsTo(() => FiscalPeriods),
    currencyId: belongsTo(() => Value),
    appropriatedMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    spentMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    /** Spent as a share of appropriated; null when nothing was appropriated. */
    executionRate: dryv.field(sharedProperties.Percentage).maybe(),
    appropriationCount: dryv.field(sharedProperties.NonNegativeInteger),
    flowCount: dryv.field(sharedProperties.NonNegativeInteger),
  })
  .extends(Indicator)
  .role("view-model")
  .description(
    "How much of one budget version, in one currency, was spent. Computed from its appropriations and the flows recorded against them.",
  );

export const ProcurementPerformance = accountability
  .schema("ProcurementPerformance", {
    procurementId: belongsTo(() => Procurements),
    bidCount: dryv.field(sharedProperties.NonNegativeInteger),
    contractCount: dryv.field(sharedProperties.NonNegativeInteger),
    currencyId: belongsTo(() => Value).maybe(),
    awardedMinorUnits: dryv.field(sharedProperties.AmountMinorUnits).maybe(),
    /** Days from publication to the first signed contract; null when none was signed. */
    daysToAward: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    receivedSingleBid: dryv.field(sharedProperties.Flag),
  })
  .extends(Indicator)
  .role("view-model")
  .description("Competition and speed of one procurement process. Computed from its bids and the contracts it produced.");

export const ProjectPerformance = accountability
  .schema("ProjectPerformance", {
    projectId: belongsTo(() => Projects),
    contractCount: dryv.field(sharedProperties.NonNegativeInteger),
    deliveryCount: dryv.field(sharedProperties.NonNegativeInteger),
    currencyId: belongsTo(() => Value).maybe(),
    contractedMinorUnits: dryv.field(sharedProperties.AmountMinorUnits).maybe(),
    deliveredMinorUnits: dryv.field(sharedProperties.AmountMinorUnits).maybe(),
    /** Delivered as a share of contracted; null when nothing was contracted. */
    deliveryRate: dryv.field(sharedProperties.Percentage).maybe(),
    isCompleted: dryv.field(sharedProperties.Flag),
  })
  .extends(Indicator)
  .role("view-model")
  .description("Delivery against contract for one project. Computed from its contracts and the deliveries recorded under them.");

export const ServiceCoverage = accountability
  .schema("ServiceCoverage", {
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }),
    serviceKindId: belongsTo(() => Value),
    activeServiceCount: dryv.field(sharedProperties.NonNegativeInteger),
    providerCount: dryv.field(sharedProperties.NonNegativeInteger),
  })
  .extends(Indicator)
  .role("view-model")
  .description("Which kinds of service reach one geographic unit. Computed from services whose place or coverage unit lies in it.");

export const InstitutionalPerformance = accountability
  .schema("InstitutionalPerformance", {
    institutionId: belongsTo(() => Institutions),
    fiscalPeriodId: belongsTo(() => FiscalPeriods).maybe(),
    mandateCount: dryv.field(sharedProperties.NonNegativeInteger),
    projectCount: dryv.field(sharedProperties.NonNegativeInteger),
    completedProjectCount: dryv.field(sharedProperties.NonNegativeInteger),
    serviceCount: dryv.field(sharedProperties.NonNegativeInteger),
    /** Completed projects as a share of all projects; null when the institution has none. */
    completionRate: dryv.field(sharedProperties.Percentage).maybe(),
  })
  .extends(Indicator)
  .role("view-model")
  .description("What one institution is responsible for and has finished. Computed from its mandates, projects and services.");

export const PromiseProgress = accountability
  .schema("PromiseProgress", {
    manifestoId: belongsTo(() => Manifestos),
    manifestoItemId: belongsTo(() => ManifestoItems),
    topicId: belongsTo(() => Topic).maybe(),
    relatedProjectCount: dryv.field(sharedProperties.NonNegativeInteger),
    completedProjectCount: dryv.field(sharedProperties.NonNegativeInteger),
    /** Completed related projects as a share of related projects; null when no project relates to the commitment. */
    progress: dryv.field(sharedProperties.Percentage).maybe(),
  })
  .extends(Indicator)
  .role("view-model")
  .description("Evidence of action on one manifesto commitment. Computed from projects that share its topic; it asserts no causal link.");

export const OversightSignals = accountability
  .schema("OversightSignals", {
    signalKindId: belongsTo(() => Value),
    projectId: belongsTo(() => Projects).maybe(),
    procurementId: belongsTo(() => Procurements).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    institutionId: belongsTo(() => Institutions).maybe(),
    serviceId: belongsTo(() => Services).maybe(),
    /** The measured figure that triggered the signal, in the unit the signal kind defines. */
    measuredValue: dryv.field(sharedProperties.Number).maybe(),
    thresholdValue: dryv.field(sharedProperties.Number).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(Indicator)
  .role("view-model")
  .rule("ExactlyOneSubject", rule.exactlyOne("projectId", "procurementId", "contractId", "institutionId", "serviceId"))
  .description("A flagged pattern worth review on exactly one subject. A signal is a prompt for human review, never a finding.");
