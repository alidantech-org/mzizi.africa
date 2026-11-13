/**
 * Schema: official
 * Database: mzizi
 * Responsibility: Canonical organization and individual identities and shared identity facts.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/official.md
 * Review: contract development authorized — 12 November 2026
 * Approved definitions: six neutral identity tables per six-domain handoff.
 * Open items: identifier uniqueness over nullable issuer/namespace columns, and contact access enforcement.
 */
import * as dryv from "@dryvcode/author";
import { rule, when } from "@dryvcode/author";
import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { Country, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const official = dryv
  .group({ name: "official" })
  .description("Canonical identities for organizations and real people.")
  .facets({ storage: { namespace: "official", store: "main" } });

export const Entities = official
  .schema("Entities", {
    kindId: belongsTo(() => Value),
    registrationCountryId: belongsTo(() => Country).maybe(),
    registeredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    dissolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("RegistrationAndDissolutionAreOrdered", rule.ordered("registeredOn", "dissolvedOn", { allowEqual: true }))
  .description("Stable identity for one organization or legally identified entity; its names are stored in official.names.")
  .role("entity")
  .facets({
    storage: dryv.storage("entities").index("kindId").index("registrationCountryId").index("sourceCitationId"),
  });

export const Individuals = official
  .schema("Individuals", {
    birthDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    deathDate: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One real human identity; names, identifiers and contacts are normalized in shared tables.")
  .role("entity")
  .facets({
    storage: dryv.storage("individuals").index("sourceCitationId"),
  });

export const Names = official
  .schema("Names", {
    entityId: belongsTo(() => Entities).maybe(),
    individualId: belongsTo(() => Individuals).maybe(),
    name: dryv.field(sharedProperties.Name),
    nameKindId: belongsTo(() => Value),
    languageTag: dryv.field(sharedProperties.LanguageTag).maybe(),
    isPreferred: dryv.field(sharedProperties.Flag),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .rule("HasExactlyOneIdentityOwner", rule.exactlyOne("entityId", "individualId"))
  .description("One attested name form for exactly one entity or individual, with optional language and validity.")
  .role("entity");

const preferredName = official.expression(
  "PreferredName",
  Names.check((v) => v.isPreferred.eq(true)),
);

Names.facets({
  storage: dryv
    .storage("names")
    .unique("entityId", "languageTag")
    .where(preferredName)
    .unique("individualId", "languageTag")
    .where(preferredName)
    .index("entityId")
    .index("individualId")
    .index("nameKindId")
    .index("sourceCitationId"),
});

export const Identifiers = official
  .schema("Identifiers", {
    entityId: belongsTo(() => Entities).maybe(),
    individualId: belongsTo(() => Individuals).maybe(),
    schemeId: belongsTo(() => Value),
    issuerEntityId: belongsTo(() => Entities).maybe(),
    namespace: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    value: dryv.field(sharedProperties.NonEmptyString1000),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .rule("HasExactlyOneIdentityOwner", rule.exactlyOne("entityId", "individualId"))
  .description("One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("identifiers")
      .index("entityId")
      .index("individualId")
      .unique("schemeId", "issuerEntityId", "namespace", "value")
      .index("schemeId", "value")
      .index("issuerEntityId")
      .index("sourceCitationId"),
  });

export const Contacts = official
  .schema("Contacts", {
    entityId: belongsTo(() => Entities).maybe(),
    individualId: belongsTo(() => Individuals).maybe(),
    kindId: belongsTo(() => Value),
    visibilityId: belongsTo(() => Value),
    value: dryv.field(sharedProperties.NonEmptyString1000),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .rule("HasExactlyOneIdentityOwner", rule.exactlyOne("entityId", "individualId"))
  .description("One sourced contact channel for exactly one identity; visibility class governs handling of private values.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("contacts")
      .index("entityId", "kindId")
      .index("individualId", "kindId")
      .index("visibilityId")
      .index("sourceCitationId"),
  });

export const Relationships = official
  .schema("Relationships", {
    fromEntityId: belongsTo(() => Entities).maybe(),
    fromIndividualId: belongsTo(() => Individuals).maybe(),
    toEntityId: belongsTo(() => Entities).maybe(),
    toIndividualId: belongsTo(() => Individuals).maybe(),
    kindId: belongsTo(() => Value),
    sharePercentage: dryv.field(sharedProperties.Percentage).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .rule("HasExactlyOneFromIdentity", rule.exactlyOne("fromEntityId", "fromIndividualId"))
  .rule("HasExactlyOneToIdentity", rule.exactlyOne("toEntityId", "toIndividualId"))
  .rule("DoesNotLinkIdentityToItself", (v) => when.all(v.fromEntityId.ne(v.toEntityId), v.fromIndividualId.ne(v.toIndividualId)))
  .description("One directed typed relationship between exactly two Official identities, optionally with an ownership share.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("relationships")
      .index("fromEntityId", "kindId")
      .index("fromIndividualId", "kindId")
      .index("toEntityId", "kindId")
      .index("toIndividualId", "kindId")
      .index("sourceCitationId"),
  });
