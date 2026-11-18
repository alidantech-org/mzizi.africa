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
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One measured quantity, for example total population, registered voters or audit opinion score.")
  .role("entity")
  .facets({ storage: dryv.storage("indicators").index("topicId").index("measureKindId").index("sourceCitationId") });

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
