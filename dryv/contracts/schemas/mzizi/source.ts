/**
 * Schema: source | Database: mzizi
 * Implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns accepted publication channels, immutable captures, evidence and manifest releases.
 * Generation excluded until the SQL pack faithfully preserves constraints.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/source.md
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { filesystemSchemas } from "./filesystem.ts";
import { officialSchemas } from "./official.ts";
import { referenceSchemas } from "./reference.ts";
export const source = dryv
  .group({ name: "source" })
  .description("Accepted sources, evidence and publication receipts.")
  .facets({ storage: { namespace: "source" } });
export const sourceEnums = source.properties({
  ReleaseStatus: dryv.property.enum({ Approved: "approved", Retired: "retired", Withdrawn: "withdrawn" }),
  VerificationOutcome: dryv.property.enum({
    Supported: "supported",
    Contradicted: "contradicted",
    Insufficient: "insufficient",
    Disputed: "disputed",
  }),
});
// biome-ignore lint/suspicious/noExplicitAny: forward references resolve after all schema definitions register.
export const sourceSchemas: Record<string, any> = {};

export const Publishers = source.schemas({
  Publishers: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      name: dryv.field(sharedProperties.Name),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      official_entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      country_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Country.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("Accepted publisher; an optional official identity distinguishes organization from publication channel.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("publishers")
        .primaryKey("id")
        .indexes(
          { name: "uq_publishers_0", fields: ["code"], unique: true },
          { name: "idx_publishers_1", fields: ["kind_id"] },
          { name: "idx_publishers_2", fields: ["country_id"] },
        ),
    }),
});
sourceSchemas.Publishers = Publishers.Publishers;
/*---------------- End source.publishers ----------------*/

export const Sources = source.schemas({
  Sources: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      publisher_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Publishers.field("id"),
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
      official_entity_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => officialSchemas.Entities.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      title: dryv.field(sharedProperties.Name),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .description("Stable publication-channel identity independent of any public website.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("sources")
        .primaryKey("id")
        .indexes(
          { name: "uq_sources_0", fields: ["code"], unique: true },
          { name: "idx_sources_1", fields: ["publisher_id"] },
          { name: "idx_sources_2", fields: ["kind_id"] },
        ),
    }),
});
sourceSchemas.Sources = Sources.Sources;
/*---------------- End source.sources ----------------*/

export const Websites = source.schemas({
  Websites: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Sources.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      canonical_url: dryv.field(sharedProperties.Url),
      title: dryv.field(sharedProperties.Name),
    })
    .description("Website-specific identity attached to a source channel.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("websites")
        .primaryKey("id")
        .indexes(
          { name: "uq_websites_0", fields: ["source_id"], unique: true },
          { name: "uq_websites_1", fields: ["canonical_url"], unique: true },
        ),
    }),
});
sourceSchemas.Websites = Websites.Websites;
/*---------------- End source.websites ----------------*/

export const Apis = source.schemas({
  Apis: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Sources.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      base_url: dryv.field(sharedProperties.Url),
      credential_binding: dryv.field(sharedProperties.NonEmptyString255).optional().nullable(),
    })
    .description("API channel with named credential binding only; request behavior is pinned in manifest releases.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("apis")
        .primaryKey("id")
        .indexes({ name: "uq_apis_0", fields: ["source_id"], unique: true }),
    }),
});
sourceSchemas.Apis = Apis.Apis;
/*---------------- End source.apis ----------------*/

export const Documents = source.schemas({
  Documents: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      source_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Sources.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      publisher_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Publishers.field("id"),
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
      title: dryv.field(sharedProperties.Name),
      canonical_url: dryv.field(sharedProperties.Url).optional().nullable(),
      published_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .description("Stable published document identity; repeated captures retain independent retrieval history.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("documents")
        .primaryKey("id")
        .indexes(
          { name: "uq_documents_0", fields: ["code"], unique: true },
          { name: "idx_documents_1", fields: ["source_id"] },
          { name: "idx_documents_2", fields: ["publisher_id"] },
          { name: "idx_documents_3", fields: ["kind_id"] },
        ),
    }),
});
sourceSchemas.Documents = Documents.Documents;
/*---------------- End source.documents ----------------*/

export const Manifests = source.schemas({
  Manifests: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.Name),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .description("Stable API, website or extraction configuration identity; contents remain versioned artifacts.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("manifests")
        .primaryKey("id")
        .indexes({ name: "uq_manifests_0", fields: ["code"], unique: true }, { name: "idx_manifests_1", fields: ["kind_id"] }),
    }),
});
sourceSchemas.Manifests = Manifests.Manifests;
/*---------------- End source.manifests ----------------*/

export const ManifestReleases = source.schemas({
  ManifestReleases: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      manifest_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Manifests.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      version: dryv.field(sharedProperties.NonEmptyString100),
      file_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      content_hash: dryv.field(sharedProperties.Sha256),
      input_schema_code: dryv.field(sharedProperties.IdentityCode),
      input_schema_version: dryv.field(sharedProperties.NonEmptyString100),
      required_capabilities: dryv.field(sharedProperties.JsonText),
      approved_by_snapshot: dryv.field(sharedProperties.JsonText),
      approved_at: dryv.field(sharedProperties.Instant),
      effective_from: dryv.field(sharedProperties.Instant),
      effective_until: dryv.field(sharedProperties.Instant).optional().nullable(),
      status: dryv.field(sourceEnums.ReleaseStatus),
    })
    .description("Pinned approved manifest content; schema and capabilities are immutable release inputs.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("manifest_releases")
        .primaryKey("id")
        .indexes(
          { name: "uq_manifest_releases_0", fields: ["manifest_id", "version"], unique: true },
          { name: "idx_manifest_releases_1", fields: ["file_version_id"] },
        ),
    }),
});
sourceSchemas.ManifestReleases = ManifestReleases.ManifestReleases;
/*---------------- End source.manifest_releases ----------------*/

export const ManifestBindings = source.schemas({
  ManifestBindings: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Sources.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      manifest_release_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.ManifestReleases.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      activated_at: dryv.field(sharedProperties.Instant),
      deactivated_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      effective_from: dryv.field(sharedProperties.Instant),
      effective_until: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .description("Dated release binding; activation never changes releases already pinned by running jobs.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("manifest_bindings")
        .primaryKey("id")
        .indexes(
          { name: "uq_manifest_bindings_0", fields: ["source_id", "manifest_release_id", "effective_from"], unique: true },
          { name: "idx_manifest_bindings_1", fields: ["manifest_release_id"] },
        ),
    }),
});
sourceSchemas.ManifestBindings = ManifestBindings.ManifestBindings;
/*---------------- End source.manifest_bindings ----------------*/

export const Captures = source.schemas({
  Captures: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Sources.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      document_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Documents.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      file_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      manifest_release_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.ManifestReleases.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      retrieved_url: dryv.field(sharedProperties.Url),
      retrieved_at: dryv.field(sharedProperties.Instant),
      content_hash: dryv.field(sharedProperties.Sha256),
      response_metadata: dryv.field(sharedProperties.JsonText),
    })
    .description("Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("captures")
        .primaryKey("id")
        .indexes(
          { name: "idx_captures_0", fields: ["source_id"] },
          { name: "idx_captures_1", fields: ["document_id"] },
          { name: "idx_captures_2", fields: ["file_version_id"] },
          { name: "idx_captures_3", fields: ["manifest_release_id"] },
        ),
    }),
});
sourceSchemas.Captures = Captures.Captures;
/*---------------- End source.captures ----------------*/

export const Evidence = source.schemas({
  Evidence: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      title: dryv.field(sharedProperties.Name),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      assembled_at: dryv.field(sharedProperties.Instant),
      assembled_by_snapshot: dryv.field(sharedProperties.JsonText),
    })
    .description("Durable evidence bundle whose exact supporting items are normalized citations.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("evidence")
        .primaryKey("id")
        .indexes({ name: "uq_evidence_0", fields: ["code"], unique: true }, { name: "idx_evidence_1", fields: ["kind_id"] }),
    }),
});
sourceSchemas.Evidence = Evidence.Evidence;
/*---------------- End source.evidence ----------------*/

export const Citations = source.schemas({
  Citations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      evidence_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Evidence.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      document_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Documents.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      capture_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Captures.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      file_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      locator_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      locator: dryv.field(sharedProperties.JsonText),
      quoted_hash: dryv.field(sharedProperties.Sha256).optional().nullable(),
      recorded_at: dryv.field(sharedProperties.Instant),
    })
    .description("Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("citations")
        .primaryKey("id")
        .indexes(
          { name: "idx_citations_0", fields: ["evidence_id"] },
          { name: "idx_citations_1", fields: ["document_id"] },
          { name: "idx_citations_2", fields: ["capture_id"] },
          { name: "idx_citations_3", fields: ["file_version_id"] },
          { name: "idx_citations_4", fields: ["locator_kind_id"] },
        ),
    }),
});
sourceSchemas.Citations = Citations.Citations;
/*---------------- End source.citations ----------------*/

export const Verifications = source.schemas({
  Verifications: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      evidence_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Evidence.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      method_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      outcome: dryv.field(sourceEnums.VerificationOutcome),
      confidence: dryv.field(sharedProperties.Confidence).optional().nullable(),
      explanation: dryv.field(sharedProperties.Description),
      reviewer_snapshot: dryv.field(sharedProperties.JsonText),
      assessed_at: dryv.field(sharedProperties.Instant),
      supersedes_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Verifications.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .description("Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("verifications")
        .primaryKey("id")
        .indexes(
          { name: "idx_verifications_0", fields: ["evidence_id"] },
          { name: "idx_verifications_1", fields: ["method_id"] },
          { name: "idx_verifications_2", fields: ["supersedes_id"] },
        ),
    }),
});
sourceSchemas.Verifications = Verifications.Verifications;
/*---------------- End source.verifications ----------------*/

export const Attributions = source.schemas({
  Attributions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      publisher_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => sourceSchemas.Publishers.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      file_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      license_value_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      credit: dryv.field(sharedProperties.NonEmptyString1000),
      rights_statement: dryv.field(sharedProperties.Description),
      assessed_at: dryv.field(sharedProperties.Instant),
      assessor_snapshot: dryv.field(sharedProperties.JsonText),
    })
    .description("Accepted rights and credit statement tied to exact content and publisher.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("attributions")
        .primaryKey("id")
        .indexes(
          { name: "idx_attributions_0", fields: ["publisher_id"] },
          { name: "idx_attributions_1", fields: ["file_version_id"] },
          { name: "idx_attributions_2", fields: ["license_value_id"] },
        ),
    }),
});
sourceSchemas.Attributions = Attributions.Attributions;
/*---------------- End source.attributions ----------------*/

export const PublicationReceipts = source.schemas({
  PublicationReceipts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      publication_ref_id: dryv.field(sharedProperties.Id),
      idempotency_key: dryv.field(sharedProperties.NonEmptyString255),
      request_hash: dryv.field(sharedProperties.Sha256),
      payload_hash: dryv.field(sharedProperties.Sha256),
      contract_version: dryv.field(sharedProperties.NonEmptyString255),
      published_at: dryv.field(sharedProperties.Instant),
      actor_snapshot: dryv.field(sharedProperties.JsonText),
      result_manifest: dryv.field(sharedProperties.JsonText),
    })
    .description(
      "Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("publication_receipts")
        .primaryKey("id")
        .indexes(
          { name: "uq_publication_receipts_0", fields: ["idempotency_key"], unique: true },
          { name: "uq_publication_receipts_1", fields: ["publication_ref_id"], unique: true },
        ),
    }),
});
sourceSchemas.PublicationReceipts = PublicationReceipts.PublicationReceipts;
/*---------------- End source.publication_receipts ----------------*/

/** Required persistence/runtime gates: scheme-aware value membership; ordered/non-overlapping
 * release/binding intervals; immutable releases, captures and assessments; capture/document/file
 * ownership consistency; same-key/hash replay and atomic receipt/provenance writes. The SQL pack
 * does not enforce these yet. Official identity is an explicit unresolved Main target, not a fake FK.
 * publication_ref_id refers to Operations and must never become a PostgreSQL cross-database FK.
 */
