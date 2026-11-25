/**
 * Schema: filesystem | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 9 and 22.3 (approved 2026-11-25).
 * Contract authors: filesystem keeps bytes only (folders, files, versions, formats), with no meaning and no language.
 * Readable and visual material is in `media`. The caller of an operation decides folders, names, access and retention.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, term } from "./_links.ts";

export const filesystem = dryv
  .group({ name: "filesystem" })
  .description("Stored bytes: logical folders and files, their immutable versions and technical formats.")
  .facets({ storage: { namespace: "filesystem", store: "main" } });

export const filesystemEnums = filesystem.properties({
  Access: dryv.property.enum(["public", "restricted", "internal", "private"]),
  Retention: dryv.property.enum(["preserve_history", "replace_current"]),
  FileTag: dryv.property.string().length({ min: 1, max: 100 }),
});

/*---------------- filesystem.folders ----------------*/
export const Folders = filesystem
  .schema("Folders", {
    parentId: belongsTo(dryv.self).maybe().description("The folder this one sits in."),
    name: dryv.field(sharedProperties.Name).description("Technical path segment, not display text."),
    access: dryv.field(filesystemEnums.Access).description("Who may read files under the folder."),
    authorization: dryv
      .field(sharedProperties.String)
      .maybe()
      .description("The recorded authorization for an access escalation."),
    roleTerm: term("fil.folder.role", "What the folder holds: raw, derived or public material."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("FolderIsNotItsOwnParent", rule.differs("id", "parentId"))
  .description("Logical folder hierarchy; access escalation needs a recorded authorization, independent of object keys.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("folders")
      .acyclic("FolderParentsHaveNoCycle", { field: "parentId" })
      .index("parentId")
      .index("roleTerm"),
  });

/*---------------- filesystem.files ----------------*/
export const Files = filesystem
  .schema("Files", {
    folderId: belongsTo(() => Folders),
    name: dryv.field(sharedProperties.Name).description("Technical file name inside its folder."),
    retention: dryv
      .field(filesystemEnums.Retention)
      .description("Whether new versions keep history or replace the current one."),
    currentVersionId: belongsTo(() => Versions)
      .maybe()
      .description("The version served by default."),
    tags: dryv
      .field(filesystemEnums.FileTag)
      .array()
      .maybe()
      .description("Plain technical tags on the file; files are not identities, so they have no tag rows."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A stable logical file; equal content hashes may belong to different files.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("files")
      .references("CurrentVersionBelongsToFile", {
        fields: ["currentVersionId", "id"],
        target: () => Versions,
        targetFields: ["id", "fileId"],
      })
      .index("folderId")
      .index("currentVersionId"),
  });

/*---------------- filesystem.formats ----------------*/
export const Formats = filesystem
  .schema("Formats", {
    extension: dryv.field(sharedProperties.NonEmptyString100).description("File name suffix without the dot (pdf)."),
    contentType: dryv.field(sharedProperties.NonEmptyString255).description("Media type hint (application/pdf)."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A technical file format: suffix and media type, never a document classification.")
  .role("entity")
  .facets({ storage: dryv.storage("formats").unique("extension") });

/*---------------- filesystem.versions ----------------*/
export const Versions = filesystem
  .schema("Versions", {
    fileId: belongsTo(() => Files),
    revision: dryv.field(sharedProperties.PositiveInteger).description("1 for the first version of the file."),
    s3Key: dryv.field(sharedProperties.NonEmptyString1000).description("Object key of the bytes in the mzizi bucket."),
    sha256: dryv.field(sharedProperties.Sha256).description("SHA-256 of the exact bytes."),
    sizeBytes: dryv.field(sharedProperties.NonNegativeInt64),
    contentType: dryv.field(sharedProperties.NonEmptyString255),
    formatId: belongsTo(() => Formats).maybe(),
    originalFilename: dryv.field(sharedProperties.NonEmptyString500).maybe(),
    access: dryv.field(filesystemEnums.Access),
    provenance: dryv
      .field(sharedProperties.String)
      .description("Technical record of how the bytes were written (tool, run); evidence links are in `source`."),
    pinned: dryv.field(sharedProperties.Flag).description("True when retention must never remove these bytes."),
    createdBySnapshot: dryv.field(sharedProperties.String).description("Who or what wrote the bytes, as recorded then."),
    verifiedAt: dryv.field(sharedProperties.Instant).description("When hash, size and access were last verified."),
  })
  .extends(baseSchemas.Entity)
  .description("Immutable exact bytes in object storage, with hash, size and access.")
  .role("entity")
  .facets({
    storage: dryv.storage("versions").unique("fileId", "revision").index("sha256").index("s3Key").index("formatId"),
  });
