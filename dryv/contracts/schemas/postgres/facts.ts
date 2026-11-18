/**
 * Schema: facts | Database: mzizi
 * Short, checkable "did you know" facts about the country, each optionally tagged to places. A fact with no place is
 * about the whole country; a fact tagged to a county shows on that county and on the places inside it.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Topic } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const facts = dryv
  .group({ name: "facts" })
  .description("Fun facts about the country, tagged to the places they are about.")
  .facets({ storage: { namespace: "facts", store: "main" } });

/*---------------- facts.facts ----------------*/
export const Facts = facts
  .schema("Facts", {
    /** The fact in one sentence. */
    statement: dryv.field(sharedProperties.Name),
    /** A sentence or two of context, shown beneath it. */
    detail: dryv.field(sharedProperties.Description).maybe(),
    topicId: belongsTo(() => Topic).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One fun fact about the country.")
  .role("entity")
  .facets({ storage: dryv.storage("facts").index("topicId").index("sourceCitationId") });

/*---------------- facts.fact_places ----------------*/
export const FactPlaces = facts
  .schema("FactPlaces", {
    factId: belongsTo(() => Facts),
    featureId: belongsTo(() => Features),
  })
  .extends(baseSchemas.Entity)
  .description("Tags a fact to a place; a fact may be tagged to several.")
  .role("entity")
  .facets({ storage: dryv.storage("fact_places").unique("factId", "featureId").index("featureId") });
