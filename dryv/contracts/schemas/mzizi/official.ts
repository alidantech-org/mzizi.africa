/**
 * Schema: official
 * Database: mzizi
 * Responsibility: Canonical organization and individual identities and shared identity facts.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/official.md
 * Review: contract development authorized — 12 November 2026
 * Approved definitions: six neutral identity tables per six-domain handoff.
 * Generation: excluded until one-of/partial uniqueness constraints are emitted and verified.
 * Open items: partial preferred-name/identifier uniqueness and contact access enforcement.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { referenceSchemas } from "./reference.ts";
import { sourceSchemas } from "./source.ts";

export const official = dryv
  .group({ name: "official" })
  .description("Canonical identities for organizations and real people.")
  .facets({ storage: { namespace: "official" } });

// biome-ignore lint/suspicious/noExplicitAny: schemas are registered below and cross-reference by owner role.
export const officialSchemas: Record<string, any> = {};

export const officialExpressions = official.expressions({
  NameHasExactlyOneOwner: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
  ),
  IdentifierHasExactlyOneOwner: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
  ),
  ContactHasExactlyOneOwner: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "entity_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "individual_id"), dryv.expression.value(null)),
    ),
  ),
  RelationshipHasExactlyOneFromIdentity: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "from_entity_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "from_individual_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "from_entity_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "from_individual_id"), dryv.expression.value(null)),
    ),
  ),
  RelationshipHasExactlyOneToIdentity: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "to_entity_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "to_individual_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "to_entity_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "to_individual_id"), dryv.expression.value(null)),
    ),
  ),
  RelationshipDoesNotLinkIdentityToItself: dryv.expression.and(
    dryv.expression.notEqual(dryv.expression.context("value", "from_entity_id"), dryv.expression.context("value", "to_entity_id")),
    dryv.expression.notEqual(dryv.expression.context("value", "from_individual_id"), dryv.expression.context("value", "to_individual_id")),
  ),
  ValidityWindowIsOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "valid_from"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "valid_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "valid_from"), dryv.expression.context("value", "valid_until")),
  ),
  OrganizationDatesAreOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "registered_on"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "dissolved_on"), dryv.expression.value(null)),
    dryv.expression.lessThanOrEqual(dryv.expression.context("value", "registered_on"), dryv.expression.context("value", "dissolved_on")),
  ),
});

export const Entities = official.schemas({
  Entities: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      registration_country_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Country.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      registered_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      dissolved_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("RegistrationAndDissolutionAreOrdered", officialExpressions.OrganizationDatesAreOrdered)
    .description("Stable identity for one organization or legally identified entity; its names are stored in official.names.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("entities")
        .primaryKey("id")
        .indexes(
          { name: "uq_entities_code", fields: ["code"], unique: true },
          { name: "idx_entities_kind", fields: ["kind_id"] },
          { name: "idx_entities_registration_country", fields: ["registration_country_id"] },
          { name: "idx_entities_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Entities = Entities.Entities;
/*---------------- End official.entities ----------------*/

export const Individuals = official.schemas({
  Individuals: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      birth_date: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      death_date: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("One real human identity; names, identifiers and contacts are normalized in shared tables.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("individuals")
        .primaryKey("id")
        .indexes(
          { name: "uq_individuals_code", fields: ["code"], unique: true },
          { name: "idx_individuals_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Individuals = Individuals.Individuals;
/*---------------- End official.individuals ----------------*/

export const Names = official.schemas({
  Names: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      individual_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Individuals.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      name: dryv.field(sharedProperties.Name),
      name_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      language_tag: dryv.field(sharedProperties.LanguageTag).optional().nullable(),
      is_preferred: dryv.field(sharedProperties.Flag),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("HasExactlyOneIdentityOwner", officialExpressions.NameHasExactlyOneOwner)
    .invariant("ValidityWindowIsOrdered", officialExpressions.ValidityWindowIsOrdered)
    .description("One attested name form for exactly one entity or individual, with optional language and validity.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("names")
        .primaryKey("id")
        .indexes(
          { name: "idx_names_entity", fields: ["entity_id", "language_tag", "is_preferred"] },
          { name: "idx_names_individual", fields: ["individual_id", "language_tag", "is_preferred"] },
          { name: "idx_names_kind", fields: ["name_kind_id"] },
          { name: "idx_names_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Names = Names.Names;
/*---------------- End official.names ----------------*/

export const Identifiers = official.schemas({
  Identifiers: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      individual_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Individuals.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      scheme_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      issuer_entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      namespace: dryv.field(sharedProperties.NonEmptyString255).optional().nullable(),
      value: dryv.field(sharedProperties.NonEmptyString1000),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("HasExactlyOneIdentityOwner", officialExpressions.IdentifierHasExactlyOneOwner)
    .invariant("ValidityWindowIsOrdered", officialExpressions.ValidityWindowIsOrdered)
    .description("One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("identifiers")
        .primaryKey("id")
        .indexes(
          { name: "idx_identifiers_entity", fields: ["entity_id"] },
          { name: "idx_identifiers_individual", fields: ["individual_id"] },
          {
            name: "uq_identifiers_scheme_issuer_namespace_value",
            fields: ["scheme_id", "issuer_entity_id", "namespace", "value"],
            unique: true,
          },
          { name: "idx_identifiers_scheme_value", fields: ["scheme_id", "value"] },
          { name: "idx_identifiers_issuer", fields: ["issuer_entity_id"] },
          { name: "idx_identifiers_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Identifiers = Identifiers.Identifiers;
/*---------------- End official.identifiers ----------------*/

export const Contacts = official.schemas({
  Contacts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      individual_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Individuals.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      visibility_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      value: dryv.field(sharedProperties.NonEmptyString1000),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("HasExactlyOneIdentityOwner", officialExpressions.ContactHasExactlyOneOwner)
    .invariant("ValidityWindowIsOrdered", officialExpressions.ValidityWindowIsOrdered)
    .description("One sourced contact channel for exactly one identity; visibility class governs handling of private values.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("contacts")
        .primaryKey("id")
        .indexes(
          { name: "idx_contacts_entity_kind", fields: ["entity_id", "kind_id"] },
          { name: "idx_contacts_individual_kind", fields: ["individual_id", "kind_id"] },
          { name: "idx_contacts_visibility", fields: ["visibility_id"] },
          { name: "idx_contacts_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Contacts = Contacts.Contacts;
/*---------------- End official.contacts ----------------*/

export const Relationships = official.schemas({
  Relationships: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      from_entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      from_individual_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Individuals.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      to_entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      to_individual_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Individuals.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      share_percentage: dryv.field(sharedProperties.Percentage).optional().nullable(),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_citation_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("HasExactlyOneFromIdentity", officialExpressions.RelationshipHasExactlyOneFromIdentity)
    .invariant("HasExactlyOneToIdentity", officialExpressions.RelationshipHasExactlyOneToIdentity)
    .invariant("DoesNotLinkIdentityToItself", officialExpressions.RelationshipDoesNotLinkIdentityToItself)
    .invariant("ValidityWindowIsOrdered", officialExpressions.ValidityWindowIsOrdered)
    .description("One directed typed relationship between exactly two Official identities, optionally with an ownership share.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("relationships")
        .primaryKey("id")
        .indexes(
          { name: "idx_relationships_from_entity", fields: ["from_entity_id", "kind_id"] },
          { name: "idx_relationships_from_individual", fields: ["from_individual_id", "kind_id"] },
          { name: "idx_relationships_to_entity", fields: ["to_entity_id", "kind_id"] },
          { name: "idx_relationships_to_individual", fields: ["to_individual_id", "kind_id"] },
          { name: "idx_relationships_source_citation", fields: ["source_citation_id"] },
        ),
    }),
});
officialSchemas.Relationships = Relationships.Relationships;
/*---------------- End official.relationships ----------------*/
