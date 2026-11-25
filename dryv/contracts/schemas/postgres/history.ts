/**
 * Schema: history | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 27.1–27.2 (approved 2026-11-25).
 * Contract authors: history records what happened and mattered (significance, often approximate dates); planned and
 * recurring civic happenings are in `event`. One real happening may have rows in both.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields, periodProperties } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Countries } from "./reference.ts";

export const history = dryv
  .group({ name: "history" })
  .description("Historical occurrences and eras: what happened, who and what was involved, and how occurrences relate.")
  .facets({ storage: { namespace: "history", store: "main" } });

const historyProperties = history.properties({
  LinkKind: dryv.property.enum({
    PartOf: "part-of",
    Caused: "caused",
    LedTo: "led-to",
    Followed: "followed",
    Replaced: "replaced",
  }),
});

/*---------------- history.occurrences ----------------*/
export const Occurrences = history
  .schema("Occurrences", {
    identityKind: identityKindField("occurrence"),
    kindTerm: term("his.occurrence.kind", "independence, reform, war, treaty, disaster, founding."),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    precision: dryv
      .field(periodProperties.DatePrecision)
      .description("How precise the dates are: day, month, year, decade or circa."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country it mainly concerns, when there is one."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("OccurrenceKind", (v) => v.identityKind.eq("occurrence"))
  .rule("OccurrencePeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("OccurrenceDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("A historical occurrence of significance (Kenya's independence, the 2010 constitution, devolution in 2013).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("occurrences")
      .index("countryId", "fromYear")
      .index("kindTerm")
      .references("OccurrenceIsIdentity", identityReference),
  });

/*---------------- history.eras ----------------*/
export const Eras = history
  .schema("Eras", {
    identityKind: identityKindField("era"),
    kindTerm: term("his.era.kind", "colonial, post-independence, presidency."),
    ...periodFields,
    countryId: belongsTo(() => Countries).maybe(),
    parentId: belongsTo(dryv.self).maybe().description("The era this one sits inside."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("EraKind", (v) => v.identityKind.eq("era"))
  .rule("EraPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A named period, possibly inside another.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("eras")
      .index("countryId", "fromYear")
      .index("parentId")
      .acyclic("EraParentsHaveNoCycle", { field: "parentId" })
      .references("EraIsIdentity", identityReference),
  });

/*---------------- history.roles ----------------*/
export const Roles = history
  .schema("Roles", {
    occurrenceId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    identityId: identity("The person, organisation or place involved."),
    roleTerm: term("his.role", "leader, signatory, affected place, venue, opponent."),
  })
  .extends(baseSchemas.Entity)
  .description("Who and what took part in a historical occurrence, and how.")
  .role("entity")
  .facets({ storage: dryv.storage("roles").unique("occurrenceId", "identityId", "roleTerm").index("identityId") });

/*---------------- history.links ----------------*/
export const Links = history
  .schema("Links", {
    fromId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    toId: belongsTo(() => Occurrences, { onDelete: "cascade" }),
    kind: dryv.field(historyProperties.LinkKind).description("part of, caused, led to, followed or replaced."),
  })
  .extends(baseSchemas.Association)
  .rule("HistoryLinkIsNotSelf", rule.differs("fromId", "toId"))
  .description("How historical occurrences relate to one another.")
  .role("entity")
  .facets({ storage: dryv.storage("links").unique("fromId", "toId", "kind").index("toId") });
