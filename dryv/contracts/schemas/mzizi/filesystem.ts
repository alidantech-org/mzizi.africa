/**
 * Schema: filesystem | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns logical identities, immutable bytes metadata and version lineage.
 * Generation excluded pending faithful SQL constraints and object verification.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/filesystem.md
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { referenceSchemas } from "./reference.ts";

export const filesystem = dryv
  .group({ name: "filesystem" })
  .description("Accepted logical files, immutable versions and attributable derivative lineage.")
  .facets({ storage: { namespace: "filesystem" } });

export const filesystemEnums = filesystem.properties({
  Access: dryv.property.enum({ Public: "public", Restricted: "restricted", Internal: "internal", Private: "private" }),
  Retention: dryv.property.enum({ PreserveHistory: "preserve_history", ReplaceCurrent: "replace_current" }),
});

export const filesystemExpressions = filesystem.expressions({
  DifferentVersions: dryv.expression.notEqual(
    dryv.expression.context("value", "source_version_id"),
    dryv.expression.context("value", "derived_version_id"),
  ),
  DifferentParent: dryv.expression.notEqual(dryv.expression.context("value", "id"), dryv.expression.context("value", "parent_id")),
  ExactlyOneTagTarget: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "file_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "folder_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "file_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "folder_id"), dryv.expression.value(null)),
    ),
  ),
});

// biome-ignore lint/suspicious/noExplicitAny: late-bound references support cyclic file/version ownership.
export const filesystemSchemas: Record<string, any> = {};

/*---------------- folders ----------------*/
export const Folders = filesystem.schemas({
  Folders: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      parent_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Folders.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      name: dryv.field(sharedProperties.Name),
      access: dryv.field(filesystemEnums.Access),
      authorization: dryv.field(sharedProperties.JsonText).optional().nullable(),
      role_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .description("Logical hierarchy; access escalation requires recorded authorization, independent of object keys.")
    .role("entity")
    .invariant("FolderMustNotParentItself", filesystemExpressions.DifferentParent)
    .facets({
      storage: dryv
        .storage("folders")
        .primaryKey("id")
        .indexes(
          { name: "uq_folders_code", fields: ["code"], unique: true },
          { name: "idx_folders_parent", fields: ["parent_id"] },
          { name: "idx_folders_role", fields: ["role_id"] },
        ),
    }),
});
filesystemSchemas.Folders = Folders.Folders;
/*---------------- End filesystem.folders ----------------*/

/*---------------- files ----------------*/
export const Files = filesystem.schemas({
  Files: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      folder_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Folders.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      name: dryv.field(sharedProperties.Name),
      retention: dryv.field(filesystemEnums.Retention),
      current_version_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .description("Stable logical file identity; equal content hashes may belong to different files.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("files")
        .primaryKey("id")
        .indexes(
          { name: "uq_files_code", fields: ["code"], unique: true },
          { name: "idx_files_folder", fields: ["folder_id"] },
          { name: "idx_files_current_version", fields: ["current_version_id"] },
        ),
    }),
});
filesystemSchemas.Files = Files.Files;
/*---------------- End filesystem.files ----------------*/

/*---------------- file_extensions ----------------*/
export const FileExtensions = filesystem.schemas({
  FileExtensions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      extension: dryv.field(sharedProperties.NonEmptyString100),
      content_type: dryv.field(sharedProperties.NonEmptyString255),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .description("Technical filename suffix and media-type hint; never a semantic document classification.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("file_extensions")
        .primaryKey("id")
        .indexes(
          { name: "uq_file_extensions_code", fields: ["code"], unique: true },
          { name: "uq_file_extensions_suffix", fields: ["extension"], unique: true },
        ),
    }),
});
filesystemSchemas.FileExtensions = FileExtensions.FileExtensions;
/*---------------- End filesystem.file_extensions ----------------*/

/*---------------- file_versions ----------------*/
export const FileVersions = filesystem.schemas({
  FileVersions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      file_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Files.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      revision: dryv.field(sharedProperties.PositiveInteger),
      s3_key: dryv.field(sharedProperties.NonEmptyString1000),
      sha256: dryv.field(sharedProperties.Sha256),
      size_bytes: dryv.field(sharedProperties.NonNegativeInt64),
      content_type: dryv.field(sharedProperties.NonEmptyString255),
      file_extension_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileExtensions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      original_filename: dryv.field(sharedProperties.NonEmptyString500).optional().nullable(),
      access: dryv.field(filesystemEnums.Access),
      provenance: dryv.field(sharedProperties.JsonText),
      pinned: dryv.field(sharedProperties.Flag),
      created_at: dryv.field(sharedProperties.Instant),
      created_by_snapshot: dryv.field(sharedProperties.JsonText),
      verified_at: dryv.field(sharedProperties.Instant),
    })
    .description("Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("file_versions")
        .primaryKey("id")
        .indexes(
          { name: "uq_file_versions_revision", fields: ["file_id", "revision"], unique: true },
          { name: "idx_file_versions_hash", fields: ["sha256"] },
          { name: "idx_file_versions_object", fields: ["s3_key"] },
          { name: "idx_file_versions_extension", fields: ["file_extension_id"] },
        ),
    }),
});
filesystemSchemas.FileVersions = FileVersions.FileVersions;
/*---------------- End filesystem.file_versions ----------------*/

/*---------------- file_relations ----------------*/
export const FileRelations = filesystem.schemas({
  FileRelations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      derived_version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.FileVersions.field("id"),
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
      processing_provenance: dryv.field(sharedProperties.JsonText),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .description("Directed exact input-to-output lineage with a pinned processing description; originals remain immutable.")
    .role("entity")
    .invariant("VersionsMustDiffer", filesystemExpressions.DifferentVersions)
    .facets({
      storage: dryv
        .storage("file_relations")
        .primaryKey("id")
        .indexes(
          { name: "uq_file_relations_edge", fields: ["source_version_id", "derived_version_id", "kind_id"], unique: true },
          { name: "idx_file_relations_derived", fields: ["derived_version_id"] },
          { name: "idx_file_relations_kind", fields: ["kind_id"] },
        ),
    }),
});
filesystemSchemas.FileRelations = FileRelations.FileRelations;
/*---------------- End filesystem.file_relations ----------------*/

/*---------------- tags ----------------*/
export const Tags = filesystem.schemas({
  Tags: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.Name),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .description("One shared tag catalogue for files and folders.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("tags")
        .primaryKey("id")
        .indexes({ name: "uq_tags_code", fields: ["code"], unique: true }),
    }),
});
filesystemSchemas.Tags = Tags.Tags;
/*---------------- End filesystem.tags ----------------*/

/*---------------- taggings ----------------*/
export const Taggings = filesystem.schemas({
  Taggings: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      tag_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Tags.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      file_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Files.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      folder_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => filesystemSchemas.Folders.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .description("One tag assignment to exactly one typed file or folder target.")
    .role("entity")
    .invariant("ExactlyOneTarget", filesystemExpressions.ExactlyOneTagTarget)
    .facets({
      storage: dryv
        .storage("taggings")
        .primaryKey("id")
        .indexes(
          { name: "uq_taggings_file", fields: ["tag_id", "file_id"], unique: true },
          { name: "uq_taggings_folder", fields: ["tag_id", "folder_id"], unique: true },
          { name: "idx_taggings_file", fields: ["file_id"] },
          { name: "idx_taggings_folder", fields: ["folder_id"] },
        ),
    }),
});
filesystemSchemas.Taggings = Taggings.Taggings;
/*---------------- End filesystem.taggings ----------------*/

/** Persistence blockers: file/current-version same-owner composite FK; transitive folder and
 * derivative cycle rejection; access inheritance and prefix checks; immutable versions; typed
 * Reference scheme membership; transactionally verified S3 metadata. Author invariants are
 * declarations, not proof of SQL enforcement. ReplaceCurrent never authorizes deleting pinned
 * versions or rewriting accepted bytes. Bucket mzizi, region us-east-1, credentials from env.
 */
