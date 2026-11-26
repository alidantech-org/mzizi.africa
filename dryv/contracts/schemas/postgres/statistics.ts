/**
 * Schema: statistics | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 29 (approved 2026-11-25), following SDMX.
 * Contract authors: screens read `figures`, never raw `observations`. `observations`, `breakdowns` and `figures` are
 * hash-partitioned by `country_id`; every read filters by country first and every link into them carries it.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, identity, identityKindField, identityReference, term } from "./_links.ts";
import { measureProperties } from "./_measures.ts";
import { Features } from "./geography.ts";
import { Countries, Units } from "./reference.ts";
import { Schemes, Terms } from "./vocabulary.ts";

export const statistics = dryv
  .group({ name: "statistics" })
  .description(
    "Published statistics: indicators, their dimensions, collections, priorities, observations, breakdowns, metrics and prepared figures.",
  )
  .facets({ storage: { namespace: "statistics", store: "main" } });

const statisticsProperties = statistics.properties({
  Frequency: dryv.property.enum({
    Monthly: "monthly",
    Quarterly: "quarterly",
    Annual: "annual",
    Intercensal: "intercensal",
    Decennial: "decennial",
  }),
  Aggregation: dryv.property.enum({ Sum: "sum", Mean: "mean", Weighted: "weighted", None: "none" }),
  Decimals: dryv.property.number.integer({ range: { min: 0, max: 10 } }),
});

const figureFields = {
  indicatorId: belongsTo(() => Indicators)
    .maybe()
    .description("The indicator measured; exactly one of indicator and metric on figures."),
  featureId: belongsTo(() => Features).description("The place the figure describes."),
  subjectId: identity("A thing the figure is about (the Swahili language for speakers of Swahili).").maybe(),
  countryId: belongsTo(() => Countries).description("Partition key; every read filters by it first."),
  ...periodFields,
  startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  value: dryv
    .field(sharedProperties.Number)
    .maybe()
    .description("In the indicator's base unit; empty when missing or suppressed."),
  lower: dryv.field(sharedProperties.Number).maybe().description("Lower bound of the uncertainty interval."),
  upper: dryv.field(sharedProperties.Number).maybe().description("Upper bound of the uncertainty interval."),
  status: dryv.field(measureProperties.FigureStatus),
  basis: dryv.field(measureProperties.FigureBasis),
  cell: dryv
    .field(measureProperties.Cell)
    .description("Fingerprint of the sorted breakdown term codes; the empty string is the total."),
};

/*---------------- statistics.indicators ----------------*/
export const Indicators = statistics
  .schema("Indicators", {
    identityKind: identityKindField("indicator"),
    kind: dryv.field(enums.IndicatorKind).description("count, rate, ratio, index, share."),
    unitId: belongsTo(() => Units).maybe(),
    decimals: dryv.field(statisticsProperties.Decimals).maybe().description("Decimals to show."),
    frequency: dryv.field(statisticsProperties.Frequency).maybe(),
    topicTerm: term("topic", "The topic (Demographics)."),
    aggregation: dryv
      .field(statisticsProperties.Aggregation)
      .description("How lower levels may build a total; rates are never summed."),
    higherIsBetter: dryv.field(sharedProperties.Flag).maybe(),
    roleTerm: term("sta.indicator.role", "The part it plays on screens (population, density, area).").maybe(),
    isDerived: dryv.field(sharedProperties.Flag).description("True when computed from components."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("IndicatorKind", (v) => v.identityKind.eq("indicator"))
  .description("The concept measured (Population). Its names and short definitions are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("indicators")
      .index("topicTerm")
      .index("roleTerm")
      .references("IndicatorIsIdentity", identityReference),
  });

/*---------------- statistics.dimensions ----------------*/
export const Dimensions = statistics
  .schema("Dimensions", {
    indicatorId: belongsTo(() => Indicators, { onDelete: "cascade" }),
    schemeId: belongsTo(() => Schemes).description("The breakdown scheme (sex, age group, residence)."),
    position: dryv.field(sharedProperties.NonNegativeInteger),
    isRequired: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Association)
  .description("Which breakdowns an indicator allows, in order.")
  .role("entity")
  .facets({ storage: dryv.storage("dimensions").unique("indicatorId", "schemeId").index("schemeId") });

/*---------------- statistics.collections ----------------*/
export const Collections = statistics
  .schema("Collections", {
    identityKind: identityKindField("collection"),
    kindTerm: term("sta.collection.kind", "census, survey, administrative, model, compilation, cost schedule."),
    stewardId: identity("The producer (KNBS, NBS, the World Bank, IEBC).").maybe(),
    ...periodFields,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("CollectionKind", (v) => v.identityKind.eq("collection"))
  .description("The programme that produced figures (census 2019, KDHS 2022, WDI).")
  .role("entity")
  .facets({ storage: dryv.storage("collections").index("stewardId").references("CollectionIsIdentity", identityReference) });

/*---------------- statistics.priorities ----------------*/
export const Priorities = statistics
  .schema("Priorities", {
    countryId: belongsTo(() => Countries),
    stewardId: identity("A producer ranked for this country.").maybe(),
    collectionId: belongsTo(() => Collections).maybe(),
    position: dryv.field(sharedProperties.NonNegativeInteger).description("Rank; 0 is trusted first."),
  })
  .extends(baseSchemas.Entity)
  .rule("PriorityHasOneSource", rule.exactlyOne("stewardId", "collectionId"))
  .description("Per-country order of trust for choosing the figure to show (Kenya ranks KNBS first).")
  .role("entity")
  .facets({ storage: dryv.storage("priorities").unique("countryId", "position").index("collectionId") });

/*---------------- statistics.observations ----------------*/
export const Observations = statistics
  .schema("Observations", {
    ...figureFields,
    indicatorId: belongsTo(() => Indicators),
    collectionId: belongsTo(() => Collections).maybe(),
    revision: dryv
      .field(sharedProperties.PositiveInteger)
      .description("1 first; a correction is a new row with a higher revision."),
    supersedesId: belongsTo(dryv.self).maybe().description("The earlier figure this revision replaces."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("ObservationPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("BoundsAreOrdered", rule.ordered("lower", "upper", { allowEqual: true }))
  .description(
    "One published figure for an indicator, place, subject, period and breakdown cell, by collection and revision.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("observations")
      .partitioning(byCountry("observations"))
      .primaryKey("id", "countryId")
      .unique("countryId", "indicatorId", "featureId", "subjectId", "fromYear", "toYear", "cell", "collectionId", "revision")
      .index("countryId", "featureId")
      .index("collectionId")
      .references("ObservationSupersedes", {
        fields: ["supersedesId", "countryId"],
        target: () => Observations,
        targetFields: ["id", "countryId"],
      }),
  });

/*---------------- statistics.breakdowns ----------------*/
export const Breakdowns = statistics
  .schema("Breakdowns", {
    observationId: belongsTo(() => Observations).description(
      "The observation cut; with `country_id` a composite foreign key.",
    ),
    countryId: belongsTo(() => Countries).description("Partition key, the observation's country."),
    termId: belongsTo(() => Terms).description("The category (female, 15–19, urban)."),
    schemeId: dryv
      .field(sharedProperties.Id)
      .description("The term's scheme (the dimension), copied so one term per scheme is a unique key."),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description("The categories that cut one observation: at most one term per dimension.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("breakdowns")
      .partitioning(byCountry("breakdowns"))
      .primaryKey("id", "countryId")
      .unique("countryId", "observationId", "schemeId")
      .index("termId")
      .references("BreakdownOfObservation", {
        fields: ["observationId", "countryId"],
        target: () => Observations,
        targetFields: ["id", "countryId"],
      })
      .references("BreakdownTermInScheme", {
        fields: ["termId", "schemeId"],
        target: () => Terms,
        targetFields: ["id", "schemeId"],
      }),
  });

/*---------------- statistics.metrics ----------------*/
export const Metrics = statistics
  .schema("Metrics", {
    identityKind: identityKindField("metric"),
    numeratorId: belongsTo(() => Indicators),
    denominatorId: belongsTo(() => Indicators).maybe(),
    perFactor: dryv.field(sharedProperties.Number).maybe().description("Factor after dividing (1000 for per 1,000 people)."),
    unitId: belongsTo(() => Units).maybe(),
    higherIsBetter: dryv.field(sharedProperties.Flag).maybe(),
    isRankable: dryv.field(sharedProperties.Flag),
    levelTerm: term("geo.level.kind", "The level shown first.").maybe(),
    topicTerm: term("topic", "The topic."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("MetricKind", (v) => v.identityKind.eq("metric"))
  .description("A figure calculated from indicators (a rate per 1,000); computed when `figures` is refreshed.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("metrics")
      .index("numeratorId")
      .index("denominatorId")
      .index("topicTerm")
      .references("MetricIsIdentity", identityReference),
  });

/*---------------- statistics.components ----------------*/
export const Components = statistics
  .schema("Components", {
    indicatorId: belongsTo(() => Indicators, { onDelete: "cascade" }).description("The composite index."),
    componentId: belongsTo(() => Indicators).description("One indicator it is made from."),
    weight: dryv.field(sharedProperties.Number),
    transform: dryv.field(enums.ComponentTransform).description("as is, normalised, inverted."),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
  })
  .extends(baseSchemas.Association)
  .rule("ComponentIsNotItself", (v) => v.indicatorId.ne(v.componentId))
  .rule("WeightIsPositive", (v) => v.weight.gt(0))
  .description("One part of a composite index, with its weight and transform.")
  .role("entity")
  .facets({ storage: dryv.storage("components").unique("indicatorId", "componentId").index("componentId") });

/*---------------- statistics.figures ----------------*/
export const Figures = statistics
  .schema("Figures", {
    ...figureFields,
    metricId: belongsTo(() => Metrics).maybe(),
    observationId: belongsTo(() => Observations)
      .maybe()
      .description("The observation chosen; empty for a computed metric."),
    refreshedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.PartitionedRecord)
  .rule("FigureHasOneMeasure", rule.exactlyOne("indicatorId", "metricId"))
  .description(
    "Prepared: the one value to show per indicator or metric, place, subject, period and cell; refreshed after every load.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("figures")
      .partitioning(byCountry("figures"))
      .primaryKey("id", "countryId")
      .index("countryId", "indicatorId", "featureId", "fromYear")
      .index("countryId", "metricId", "featureId", "fromYear")
      .references("FigureOfObservation", {
        fields: ["observationId", "countryId"],
        target: () => Observations,
        targetFields: ["id", "countryId"],
      }),
  });
