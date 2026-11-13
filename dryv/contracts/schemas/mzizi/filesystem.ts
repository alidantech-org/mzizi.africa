/**
 * Schema: filesystem | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns logical identities, immutable bytes metadata and version lineage.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/filesystem.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const filesystem = dryv
  .group({ name: "filesystem" })
  .description("Accepted logical files, immutable versions and attributable derivative lineage.")
  .facets({ storage: { namespace: "filesystem" } });

export const filesystemEnums = filesystem.properties({
  Access: dryv.property.enum({ Public: "public", Restricted: "restricted", Internal: "internal", Private: "private" }),
  Retention: dryv.property.enum({ PreserveHistory: "preserve_history", ReplaceCurrent: "replace_current" }),
});

/*---------------- folders ----------------*/
export const Folders = filesystem
  .schema("Folders", {
    parentId: belongsTo(dryv.self).maybe(),
    name: dryv.field(sharedProperties.Name),
    access: dryv.field(filesystemEnums.Access),
    authorization: dryv.field(sharedProperties.JsonText).maybe(),
    roleId: belongsTo(() => Value),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Logical hierarchy; access escalation requires recorded authorization, independent of object keys.")
  .role("entity")
  .rule("FolderMustNotParentItself", rule.differs("id", "parentId"))
  .facets({
    storage: dryv.storage("folders").acyclic("FolderParentAcyclic", { field: "parentId" }).index("parentId").index("roleId"),
  });

/*---------------- files ----------------*/
export const Files = filesystem
  .schema("Files", {
    folderId: belongsTo(() => Folders),
    name: dryv.field(sharedProperties.Name),
    retention: dryv.field(filesystemEnums.Retention),
    currentVersionId: belongsTo(() => FileVersions).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable logical file identity; equal content hashes may belong to different files.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("files")
      .references("CurrentVersionBelongsToFile", {
        fields: ["currentVersionId", "id"],
        target: () => FileVersions,
        targetFields: ["id", "fileId"],
      })
      .index("folderId")
      .index("currentVersionId"),
  });

/*---------------- file_extensions ----------------*/
export const FileExtensions = filesystem
  .schema("FileExtensions", {
    extension: dryv.field(sharedProperties.NonEmptyString100),
    contentType: dryv.field(sharedProperties.NonEmptyString255),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Technical filename suffix and media-type hint; never a semantic document classification.")
  .role("entity")
  .facets({
    storage: dryv.storage("file_extensions").unique("extension"),
  });

/*---------------- file_versions ----------------*/
export const FileVersions = filesystem
  .schema("FileVersions", {
    fileId: belongsTo(() => Files),
    revision: dryv.field(sharedProperties.PositiveInteger),
    s3Key: dryv.field(sharedProperties.NonEmptyString1000),
    sha256: dryv.field(sharedProperties.Sha256),
    sizeBytes: dryv.field(sharedProperties.NonNegativeInt64),
    contentType: dryv.field(sharedProperties.NonEmptyString255),
    fileExtensionId: belongsTo(() => FileExtensions).maybe(),
    originalFilename: dryv.field(sharedProperties.NonEmptyString500).maybe(),
    access: dryv.field(filesystemEnums.Access),
    provenance: dryv.field(sharedProperties.JsonText),
    pinned: dryv.field(sharedProperties.Flag),
    createdBySnapshot: dryv.field(sharedProperties.JsonText),
    verifiedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description("Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance.")
  .role("entity")
  .facets({
    storage: dryv.storage("file_versions").unique("fileId", "revision").index("sha256").index("s3Key").index("fileExtensionId"),
  });

/*---------------- file_relations ----------------*/
export const FileRelations = filesystem
  .schema("FileRelations", {
    sourceVersionId: belongsTo(() => FileVersions),
    derivedVersionId: belongsTo(() => FileVersions),
    kindId: belongsTo(() => Value),
    processingProvenance: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.Entity)
  .description("Directed exact input-to-output lineage with a pinned processing description; originals remain immutable.")
  .role("entity")
  .rule("VersionsMustDiffer", rule.differs("sourceVersionId", "derivedVersionId"))
  .facets({
    storage: dryv.storage("file_relations").unique("sourceVersionId", "derivedVersionId", "kindId").index("derivedVersionId").index("kindId"),
  });

/*---------------- tags ----------------*/
export const Tags = filesystem
  .schema("Tags", {
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One shared tag catalogue for files and folders.")
  .role("entity")
  .facets({
    storage: dryv.storage("tags"),
  });

/*---------------- taggings ----------------*/
export const Taggings = filesystem
  .schema("Taggings", {
    tagId: belongsTo(() => Tags),
    fileId: belongsTo(() => Files).maybe(),
    folderId: belongsTo(() => Folders).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One tag assignment to exactly one typed file or folder target.")
  .role("entity")
  .rule("ExactlyOneTarget", rule.exactlyOne("fileId", "folderId"))
  .facets({
    storage: dryv.storage("taggings").unique("tagId", "fileId").unique("tagId", "folderId").index("fileId").index("folderId"),
  });

/** Open: derivative cycle rejection through file_relations;
 * access inheritance and prefix checks; immutable versions; typed Reference scheme membership;
 * transactionally verified S3 metadata. ReplaceCurrent never authorizes deleting pinned versions or
 * rewriting accepted bytes. Bucket mzizi, region us-east-1, credentials from env.
 */
