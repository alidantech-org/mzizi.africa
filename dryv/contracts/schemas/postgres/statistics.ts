/**
 * Schema: statistics | Database: mzizi
 * Published statistics (census, surveys, administrative counts) attached to any geographic feature, from the whole
 * country down to a village, with optional demographic breakdowns. Indicators are described with reference topics
 * and units; breakdown categories are reference values (labels in any language through reference.value_labels).
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Language, Topic, Unit, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const statistics = dryv
  .group({ name: "statistics" })
  .description("Statistical indicators and their observations by place, period and demographic breakdown.")
  .facets({ storage: { namespace: "statistics", store: "main" } });

/*---------------- statistics.indicators ----------------*/
export const Indicators = statistics
  .schema("Indicators", {
    name: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    /** Discovery topic, for example population, health, education, economy, audit and transparency. */
    topicId: belongsTo(() => Topic),
    unitId: belongsTo(() => Unit).maybe(),
    /** Scheme sta.measure.kind: count, rate, ratio, share, index, amount, density. */
    measureKindId: belongsTo(() => Value),
    /** True when a larger figure is the better outcome (ranking direction); empty when neither is better. */
    higherIsBetter: dryv.field(sharedProperties.Flag).maybe(),
    /** Scheme sta.indicator.role: the part an indicator plays on the screens (population, density, area); empty for the rest. */
    roleId: belongsTo(() => Value).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One measured quantity, for example total population, registered voters or audit opinion score.")
  .role("entity")
  .facets({ storage: dryv.storage("indicators").index("topicId").index("measureKindId").index("roleId").index("sourceCitationId") });

/*---------------- statistics.observations ----------------*/
export const Observations = statistics
  .schema("Observations", {
    indicatorId: belongsTo(() => Indicators),
    /** The place or area the figure describes: country, county, constituency, ward, town or village. */
    featureId: belongsTo(() => Features),
    /** First day the figure covers (a census day or the start of a year). */
    periodFrom: dryv.field(sharedProperties.CalendarDate),
    periodTo: dryv.field(sharedProperties.CalendarDate).maybe(),
    value: dryv.field(sharedProperties.Number),
    /** Scheme sta.dimension.sex, stat.dimension.age-group, stat.dimension.residence, stat.dimension.ethnicity. */
    sexId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.sta.dimension.sex"),
    ageGroupId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.sta.dimension.agegroup"),
    residenceId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.sta.dimension.residence"),
    ethnicityId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.sta.dimension.ethnicity"),
    languageId: belongsTo(() => Language).maybe(),
    /** True when the figure is a projection or estimate rather than a count. */
    estimated: dryv.field(sharedProperties.Flag).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One figure of one indicator for one place and period, optionally broken down by sex, age, residence, ethnicity or language.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("observations")
      .index("indicatorId", "featureId", "periodFrom")
      .index("featureId")
      .index("sexId")
      .index("ageGroupId")
      .index("ethnicityId")
      .index("languageId")
      .index("sourceCitationId"),
  });

/*---------------- statistics.metrics ----------------*/
export const Metrics = statistics
  .schema("Metrics", {
    topicId: belongsTo(() => Topic),
    /** The measure ranked or compared: an indicator, or the numerator of a ratio. */
    numeratorIndicatorId: belongsTo(() => Indicators),
    /** The indicator it is divided by (population for a per-person figure); absent for a plain indicator. */
    denominatorIndicatorId: belongsTo(() => Indicators).maybe(),
    /** The factor applied after dividing: 1, 1000 or 100000 for "per 100,000 people". */
    perFactor: dryv.field(sharedProperties.Number).maybe(),
    unitId: belongsTo(() => Unit).maybe(),
    higherIsBetter: dryv.field(sharedProperties.Flag).maybe(),
    /** The place level shown first, a feature kind value; the country's ladder says which levels exist. */
    defaultLevelKindId: belongsTo(() => Value)
      .tags("scheme:ref.sch.geo.feature.kind")
      .maybe(),
    /** True when the metric appears in ranking lists. */
    isRankable: dryv.field(sharedProperties.Flag),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A ranking or comparison measure defined as data: an indicator, or one indicator over another with a factor. Titles and descriptions per language are copy; no metric is coded in a read.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("metrics")
      .index("topicId")
      .index("numeratorIndicatorId")
      .index("denominatorIndicatorId")
      .index("sourceCitationId"),
  });
