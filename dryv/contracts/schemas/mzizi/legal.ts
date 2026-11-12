/**
 * Schema: legal | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Stable instrument/provision identities and immutable source-backed wording versions.
 * Generation excluded pending composite ownership and temporal constraint support.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/legal.md
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { referenceSchemas } from "./reference.ts";
import { filesystemSchemas } from "./filesystem.ts";
import { geographySchemas } from "./geography.ts";
import { sourceSchemas } from "./source.ts";
export const legal = dryv
  .group({ name: "legal" })
  .description("Legal instruments, exact wording versions and amendments.")
  .facets({ storage: { namespace: "legal" } });
// biome-ignore lint/suspicious/noExplicitAny: deferred self and cross-table references.
export const legalSchemas: Record<string, any> = {};

export const Instruments = legal.schemas({
  Instruments: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.Name),
      kind_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      issuing_unit_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Units.field("feature_id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      issuing_entity_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      enacted_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      published_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .description("Stable instrument identity with explicit issuing territorial scope; geography alone never establishes applicability.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("instruments")
        .primaryKey("id")
        .indexes(
          { name: "uq_instruments_0", fields: ["code"], unique: true },
          { name: "idx_instruments_1", fields: ["kind_id"] },
          { name: "idx_instruments_2", fields: ["issuing_unit_id"] },
        ),
    }),
});
legalSchemas.Instruments = Instruments.Instruments;
/*---------------- End legal.instruments ----------------*/

export const InstrumentVersions = legal.schemas({
  InstrumentVersions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      instrument_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.Instruments.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      edition: dryv.field(sharedProperties.NonEmptyString255),
      file_version_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      evidence_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Evidence.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      content_hash: dryv.field(sharedProperties.Sha256),
      consolidated_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      commenced_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      ceased_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      repealed_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      observed_at: dryv.field(sharedProperties.Instant),
      supersedes_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.InstrumentVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("Exact source-backed release; observed, consolidated and legally effective dates have separate meanings.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("instrument_versions")
        .primaryKey("id")
        .indexes(
          { name: "uq_instrument_versions_0", fields: ["instrument_id", "edition"], unique: true },
          { name: "idx_instrument_versions_1", fields: ["file_version_id"] },
          { name: "idx_instrument_versions_2", fields: ["evidence_id"] },
          { name: "idx_instrument_versions_3", fields: ["supersedes_id"] },
        ),
    }),
});
legalSchemas.InstrumentVersions = InstrumentVersions.InstrumentVersions;
/*---------------- End legal.instrument_versions ----------------*/

export const Provisions = legal.schemas({
  Provisions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      instrument_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.Instruments.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      parent_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.Provisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      designation: dryv.field(sharedProperties.NonEmptyString255),
      title: dryv.field(sharedProperties.Name).optional().nullable(),
    })
    .description("Stable section identity within one instrument; hierarchy must remain within that instrument.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("provisions")
        .primaryKey("id")
        .indexes(
          { name: "uq_provisions_0", fields: ["code"], unique: true },
          { name: "idx_provisions_1", fields: ["instrument_id"] },
          { name: "idx_provisions_2", fields: ["parent_id"] },
        ),
    }),
});
legalSchemas.Provisions = Provisions.Provisions;
/*---------------- End legal.provisions ----------------*/

export const ProvisionVersions = legal.schemas({
  ProvisionVersions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      provision_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.Provisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      instrument_version_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.InstrumentVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      citation_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      text: dryv.field(sharedProperties.NonEmptyString),
      text_hash: dryv.field(sharedProperties.Sha256),
      effective_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      effective_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      observed_at: dryv.field(sharedProperties.Instant),
      supersedes_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.ProvisionVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("Immutable original wording in an exact instrument release; structured interpretation is separately reviewed.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("provision_versions")
        .primaryKey("id")
        .indexes(
          { name: "uq_provision_versions_0", fields: ["provision_id", "instrument_version_id"], unique: true },
          { name: "idx_provision_versions_1", fields: ["instrument_version_id"] },
          { name: "idx_provision_versions_2", fields: ["citation_id"] },
          { name: "idx_provision_versions_3", fields: ["supersedes_id"] },
        ),
    }),
});
legalSchemas.ProvisionVersions = ProvisionVersions.ProvisionVersions;
/*---------------- End legal.provision_versions ----------------*/

export const Amendments = legal.schemas({
  Amendments: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      authority_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.ProvisionVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      affected_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.ProvisionVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      resulting_version_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => legalSchemas.ProvisionVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      kind_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      effective_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      explanation: dryv.field(sharedProperties.Description).optional().nullable(),
      citation_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Citations.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("An exact authority provision changes an exact affected wording version; both historical texts remain available.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("amendments")
        .primaryKey("id")
        .indexes(
          { name: "idx_amendments_0", fields: ["authority_id"] },
          { name: "idx_amendments_1", fields: ["affected_id"] },
          { name: "idx_amendments_2", fields: ["resulting_version_id"] },
          { name: "idx_amendments_3", fields: ["kind_id"] },
          { name: "idx_amendments_4", fields: ["citation_id"] },
        ),
    }),
});
legalSchemas.Amendments = Amendments.Amendments;
/*---------------- End legal.amendments ----------------*/

/** Persistence blockers: same-instrument provision/version/parent composite relationships;
 * hierarchy and supersession cycles; effective intervals; immutable wording and hashes.
 * issuing_entity_ref_id awaits Official.entities and is not an enforced FK. Territorial scope
 * uses geography.units.feature_id. No generic domain target pointer or automatic executable
 * legal interpretation is introduced. Reference owns incoming domain-to-Legal mediation.
 */
