/**
 * Schema: reference | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Review: accepted foundation inventory; current detailed field contract requires reconciliation.
 * Countries are canonical modern-country identities; spatial units belong to Geography.
 * No fictional world country or mandatory country membership is implied.
 * Geography, Filesystem and Legal relations must be verified through same-database composition and pack generation.
 * SQL-level scheme checks, composite FKs, partial indexes and transitive cycle constraints are unsupported by the current pack.
 */
import * as dryv from "@dryvcode/author";
import { when } from "@dryvcode/author";

import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { geographySchemas } from "./geography.ts";
import { legalSchemas } from "./legal.ts";
import { officialSchemas } from "./official.ts";
import { sourceSchemas } from "./source.ts";

export const reference = dryv
  .group({ name: "reference" })
  .description("Shared country identities, controlled meanings, measurement units and reviewed patterns.")
  .facets({ storage: { namespace: "reference" } });

/*---------------- Reference schema contracts ----------------*/

export const Country = dryv
  .schema({
    name: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Canonical identity for a modern country; not a geographic unit or historical polity.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("countries")
      .indexes({ fields: ["name"] }),
  });

/** Country identity is independent of whether another record has a country relationship. */
/** The inbound Geography FK must be declared with geography.units when that contract is authored. */
/*---------------- End reference.countries ----------------*/

export const Scheme = dryv
  .schema({
    title: dryv.field(sharedProperties.Name),
    owner_snapshot: dryv.field(sharedProperties.NonEmptyString255),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable identity and stewardship snapshot for a controlled vocabulary scheme.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("schemes"),
  });
/*---------------- End reference.schemes ----------------*/

export const Value = dryv
  .schema({
    scheme_id: dryv.field(sharedProperties.Id).relation({
      target: Scheme.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    label: dryv.field(sharedProperties.Name),
    supersedes_id: dryv
      .field(sharedProperties.Id)
      .optional()
      .nullable()
      .relation({
        target: dryv.self("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
  })
  .extends(baseSchemas.CodedEntity)
  .rule(reference, "ValueDoesNotSupersedeItself", (v) => v.id.ne(v.supersedes_id))
  .description("A controlled classification member within one scheme, with optional supersession.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("values")
      .indexes({ fields: ["scheme_id"] }, { fields: ["supersedes_id"] }),
  });
/*---------------- End reference.values ----------------*/
/** Same-scheme supersession and transitive acyclicity require a database operation/constraint. */

export const Unit = dryv
  .schema({
    symbol: dryv.field(sharedProperties.NonEmptyString100),
    quantity: dryv.field(sharedProperties.NonEmptyString255),
    scale: dryv.field(sharedProperties.Number),
    offset: dryv.field(sharedProperties.Number),
    base_id: dryv
      .field(sharedProperties.Id)
      .optional()
      .nullable()
      .relation({
        target: dryv.self("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
  })
  .extends(baseSchemas.CodedEntity)
  .rule(reference, "UnitScaleMustBePositive", (v) => v.scale.gt(0))
  .description("Measurement unit and conversion to its optional base unit; never a spatial unit.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("units")
      .indexes({ fields: ["base_id"] }),
  });
/*---------------- End reference.units ----------------*/
/** Conversion scale precision and base-unit cycle checks require storage-pack/database verification. */

export const Topic = dryv
  .schema({
    label: dryv.field(sharedProperties.Name),
    parent_id: dryv
      .field(sharedProperties.Id)
      .optional()
      .nullable()
      .relation({
        target: dryv.self("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
  })
  .extends(baseSchemas.CodedEntity)
  .rule(reference, "TopicDoesNotParentItself", (v) => v.id.ne(v.parent_id))
  .description("Cross-domain discovery topic hierarchy; topics do not own domain records.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("topics")
      .indexes({ fields: ["parent_id"] }),
  });
/*---------------- End reference.topics ----------------*/
/** Transitive topic-cycle prevention requires a database operation/constraint. */

export const Pattern = dryv
  .schema({
    title: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable identity for a reusable, reviewed pattern definition.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("patterns"),
  });
/*---------------- End reference.patterns ----------------*/

export const PatternVersion = dryv
  .schema({
    pattern_id: dryv.field(sharedProperties.Id).relation({
      target: Pattern.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    edition: dryv.field(sharedProperties.PositiveInteger),
    /** Typed artifact identity; the active Reference vocabulary app does not compose Filesystem. */
    file_version_id: dryv.field(sharedProperties.Id),
    digest: dryv.field(sharedProperties.Sha256),
  })
  .extends(baseSchemas.Entity)
  .description("Immutable, reviewed release of a pattern; Engine owns execution state.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("pattern_versions")
      .indexes(
        {
          fields: ["pattern_id", "edition"],
          unique: true,
        },
        {
          fields: ["file_version_id"],
        },
      ),
  });
/** FK gap: Main review composition has the target; keep the active Operations vocabulary decoupled. */
/*---------------- End reference.pattern_versions ----------------*/

export const PatternBinding = dryv
  .schema({
    version_id: dryv.field(sharedProperties.Id).relation({
      target: PatternVersion.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    /** Geography target is geography.units.feature_id; active vocabulary composition omits Geography. */
    unit_id: dryv.field(sharedProperties.Id).optional().nullable(),
    /** Optional country scope; a country-wide geographic scope also identifies its country unit. */
    country_id: dryv
      .field(sharedProperties.Id)
      .optional()
      .nullable()
      .relation({
        target: Country.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    /** Existing proposal target and role need reconciliation with the Reference-owned Legal basis link. */
    provision_id: dryv.field(sharedProperties.Id).optional().nullable(),
    /** Inclusive lower date; Dryv has no native daterange storage property. */
    effective_from: dryv.field(sharedProperties.CalendarDate),
    /** Exclusive upper date; null means no known end. */
    effective_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
  })
  .extends(baseSchemas.Entity)
  // A NULL `effective_until` is an open window, and SQL CHECK treats NULL as satisfied, so no explicit open branch.
  .rule(reference, "EffectiveWindowIsOrdered", (v) => v.effective_from.lt(v.effective_until))
  .description("Country, geographic-unit and time applicability of an approved pattern release.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("pattern_bindings")
      .indexes(
        {
          fields: ["version_id", "country_id", "unit_id", "effective_from"],
        },
        { fields: ["country_id"] },
        { fields: ["unit_id"] },
        {
          fields: ["provision_id"],
        },
        {
          fields: ["effective_from"],
        },
      ),
  });
/**
 * Open relationships: Geography has not yet authored geography.units, Filesystem has not authored
 * filesystem.file_versions, and the Reference-owned Legal bridge is unresolved. Keep the typed IDs;
 * ensure country_id and unit_id identify compatible scopes; do not invent a Legal proxy or claim
 * these cross-schema FKs are enforced. The SQL pack must preserve effective interval ordering and
 * uniqueness semantics for nullable scope bindings before this contract is generation-ready.
 */
/*---------------- End reference.pattern_bindings ----------------*/

export const PatternDependency = dryv
  .schema({
    version_id: dryv.field(sharedProperties.Id).relation({
      target: PatternVersion.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    requires_id: dryv.field(sharedProperties.Id).relation({
      target: PatternVersion.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  })
  .extends(baseSchemas.Association)
  .rule(reference, "DependencyMustNotBeSelf", (v) => v.version_id.ne(v.requires_id))
  .description("Pinned dependency between two Reference pattern releases.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("pattern_dependencies")
      .indexes(
        {
          fields: ["version_id", "requires_id"],
          unique: true,
        },
        {
          fields: ["requires_id"],
        },
      ),
  });
/** Acyclicity beyond self-reference requires a transaction-level database constraint or operation. */
/*---------------- End reference.pattern_dependencies ----------------*/

export const referenceProposalEnums = reference.properties({
  ValueRelationKind: dryv.property.enum({
    BroaderThan: "broader_than",
    NarrowerThan: "narrower_than",
    RelatedTo: "related_to",
  }),
});

export const ValueRelation = dryv
  .schema({
    source_value_id: dryv.field(sharedProperties.Id).relation({
      target: Value.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    target_value_id: dryv.field(sharedProperties.Id).relation({
      target: Value.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    relation_kind: dryv.field(referenceProposalEnums.ValueRelationKind),
    valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
  })
  .extends(baseSchemas.Association)
  .rule(reference, "ValueRelationMustNotBeSelfReferential", (v) => v.source_value_id.ne(v.target_value_id))
  .rule(reference, "ValueRelationWindowMustBeOrdered", (v) =>
    when.any(v.valid_from.isNull(), v.valid_until.isNull(), v.valid_from.lt(v.valid_until)),
  )
  .description("Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("value_relations")
      .indexes(
        {
          fields: ["source_value_id", "relation_kind", "valid_from"],
        },
        {
          fields: ["target_value_id", "relation_kind"],
        },
      ),
  });

export const LegalBasisLink = dryv
  .schema({
    provision_version_id: dryv.field(sharedProperties.Id).relation({
      target: legalSchemas.ProvisionVersions.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    basis_role_id: dryv.field(sharedProperties.Id).relation({
      target: Value.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    citation_id: dryv.field(sharedProperties.Id).relation({
      target: sourceSchemas.Citations.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    effective_from: dryv.field(sharedProperties.CalendarDate),
    effective_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    interpretation: dryv.field(sharedProperties.Description),
    reviewed_by_snapshot: dryv.field(sharedProperties.JsonText),
    reviewed_at: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("One reviewed legal support assertion for an exact provision version, role, citation and effective period.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("legal_basis_links")
      .indexes(
        {
          fields: ["provision_version_id"],
        },
        { fields: ["basis_role_id"] },
        { fields: ["citation_id"] },
      ),
  });
/*---------------- End reference.legal_basis_links ----------------*/

export const GeographyChangeLegalBasis = dryv
  .schema({
    change_id: dryv.field(sharedProperties.Id).relation({
      target: geographySchemas.Changes.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    legal_basis_id: dryv.field(sharedProperties.Id).relation({
      target: LegalBasisLink.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  })
  .extends(baseSchemas.Association)
  .description("Typed legal support for a geographic change; role distinctions live on the linked basis assertion.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("geography_change_legal_bases")
      .indexes(
        {
          fields: ["change_id", "legal_basis_id"],
          unique: true,
        },
        {
          fields: ["legal_basis_id"],
        },
      ),
  });
/*---------------- End reference.geography_change_legal_bases ----------------*/

export const OfficialEntityLegalBasis = dryv
  .schema({
    entity_id: dryv.field(sharedProperties.Id).relation({
      target: officialSchemas.Entities.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    legal_basis_id: dryv.field(sharedProperties.Id).relation({
      target: LegalBasisLink.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  })
  .extends(baseSchemas.Association)
  .description("Typed legal support for an official organization identity.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("official_entity_legal_bases")
      .indexes(
        {
          fields: ["entity_id", "legal_basis_id"],
          unique: true,
        },
        {
          fields: ["legal_basis_id"],
        },
      ),
  });
/*---------------- End reference.official_entity_legal_bases ----------------*/

export const referenceSchemas = reference.schemas({
  Country,
  Scheme,
  Value,
  Unit,
  Topic,
  Pattern,
  PatternVersion,
  PatternBinding,
  PatternDependency,
  ValueRelation,
  LegalBasisLink,
  GeographyChangeLegalBasis,
  OfficialEntityLegalBasis,
});
