/**
 * Schema: reference | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Review: accepted foundation inventory; current detailed field contract requires reconciliation.
 * Countries are canonical modern-country identities; spatial units belong to Geography.
 * No fictional world country or mandatory country membership is implied.
 * Relations to Geography, Filesystem and Legal are declared here against schemas in the same database.
 * Rules the pack lowers from storage constraints: no-overlap windows, acyclic chains, same-scheme supersession.
 * Not yet enforced: cycles through an edge table such as pattern_dependencies or value_relations.
 */
import * as dryv from "@dryvcode/author";
import { when } from "@dryvcode/author";

import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { filesystemSchemas } from "./filesystem.ts";
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
    storage: dryv.storage("countries").indexes({ fields: ["name"] }),
  });

/** Country identity is independent of whether another record has a country relationship. */
/** The Geography link to a country is declared on geography.units.country_id, not here. */
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
    storage: dryv.storage("schemes"),
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
      .sameAs("SupersessionStaysInScheme", { field: "supersedes_id", match: ["scheme_id"] })
      .acyclic("SupersessionAcyclic", { field: "supersedes_id" })
      .indexes({ fields: ["scheme_id"] }, { fields: ["supersedes_id"] }),
  });
/*---------------- End reference.values ----------------*/

const unitProperties = reference.properties({
  /** Fixed precision so conversions are exact and reproducible, unlike a floating-point number. */
  Factor: dryv.property.number.decimal({ precision: 38, scale: 18 }),
});

export const Unit = dryv
  .schema({
    symbol: dryv.field(sharedProperties.NonEmptyString100),
    quantity: dryv.field(sharedProperties.NonEmptyString255),
    /** Exact conversion factor to the base unit: base = value * scale + offset. */
    scale: dryv.field(unitProperties.Factor),
    offset: dryv.field(unitProperties.Factor),
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
      .acyclic("BaseUnitAcyclic", { field: "base_id" })
      .indexes({ fields: ["base_id"] }),
  });
/*---------------- End reference.units ----------------*/

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
      .acyclic("TopicParentAcyclic", { field: "parent_id" })
      .indexes({ fields: ["parent_id"] }),
  });
/*---------------- End reference.topics ----------------*/

export const Pattern = dryv
  .schema({
    title: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable identity for a reusable, reviewed pattern definition.")
  .role("entity")
  .facets({
    storage: dryv.storage("patterns"),
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
    /** The stored file version this pattern release was built from. */
    file_version_id: dryv.field(sharedProperties.Id).relation({
      target: () => filesystemSchemas.FileVersions.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    digest: dryv.field(sharedProperties.Sha256),
  })
  .extends(baseSchemas.Entity)
  .description("Immutable, reviewed release of a pattern; Engine owns execution state.")
  .role("entity")
  .facets({
    storage: dryv.storage("pattern_versions").indexes(
      {
        fields: ["pattern_id", "edition"],
        unique: true,
      },
      {
        fields: ["file_version_id"],
      },
    ),
  });
/*---------------- End reference.pattern_versions ----------------*/

export const PatternBinding = dryv
  .schema({
    version_id: dryv.field(sharedProperties.Id).relation({
      target: PatternVersion.field("id"),
      cardinality: dryv.relation.manyToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    /** Optional geographic unit scope (geography.units, keyed by feature_id). */
    unit_id: dryv
      .field(sharedProperties.Id)
      .optional()
      .nullable()
      .relation({
        target: () => geographySchemas.Units.field("feature_id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
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
    /** Plain id: the Legal target is an open owner decision, so no foreign key is declared. */
    provision_id: dryv.field(sharedProperties.Id).optional().nullable(),
    /** Start of the window, inclusive. */
    effective_from: dryv.field(sharedProperties.CalendarDate),
    /** End of the window, exclusive; null means no known end. */
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
      // No two bindings of the same release and scope may overlap in time. Null scope values (for
      // example no country) compare equal, and a null `effective_until` is an open window.
      .noOverlap("NoOverlappingBindings", {
        scope: ["version_id", "country_id", "unit_id", "provision_id"],
        from: "effective_from",
        until: "effective_until",
      })
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
/** Open: provision_id has no foreign key until the owner decides how bindings reference Legal (see decision note). */
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
    storage: dryv.storage("pattern_dependencies").indexes(
      {
        fields: ["version_id", "requires_id"],
        unique: true,
      },
      {
        fields: ["requires_id"],
      },
    ),
  });
/** Not yet enforced: cycles through the edge graph itself need a graph-level constraint kind. */
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
    storage: dryv.storage("value_relations").indexes(
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
    storage: dryv.storage("legal_basis_links").indexes(
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
    storage: dryv.storage("geography_change_legal_bases").indexes(
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
    storage: dryv.storage("official_entity_legal_bases").indexes(
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
