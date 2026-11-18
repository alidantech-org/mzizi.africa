/**
 * Schema: filesystem | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns logical identities, immutable bytes metadata, version membership and media. Derivation and acquisition belong to Source.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/filesystem.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Language, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const filesystem = dryv
  .group({ name: "filesystem" })
  .description("Accepted logical files, immutable versions and the media that mention subject records.")
  .facets({ storage: { namespace: "filesystem", store: "main" } });

export const filesystemEnums = filesystem.properties({
  Access: dryv.property.enum(["public", "restricted", "internal", "private"]),
  Retention: dryv.property.enum(["preserve_history", "replace_current"]),
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
    storage: dryv
      .storage("file_versions")
      .unique("fileId", "revision")
      .index("sha256")
      .index("s3Key")
      .index("fileExtensionId"),
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
    storage: dryv
      .storage("taggings")
      .unique("tagId", "fileId")
      .unique("tagId", "folderId")
      .index("fileId")
      .index("folderId"),
  });

/** Open: access inheritance and prefix checks; immutable versions; typed Reference scheme membership;
 * transactionally verified S3 metadata. ReplaceCurrent never authorizes deleting pinned versions or
 * rewriting accepted bytes. Bucket mzizi, region us-east-1, credentials from env.
 */

/*---------------- media ----------------*/
export const Media = filesystem
  .schema("Media", {
    /** Scheme fil.media.kind: logo, symbol, flag, portrait, photograph, audio, video, document scan. */
    kindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    /** A natural description of what the media shows or says. */
    description: dryv.field(sharedProperties.Description).maybe(),
    /** Why this media is attached to this subject; the same file can be used differently by another subject. */
    purpose: dryv.field(sharedProperties.Description).maybe(),
    /** Text for people who cannot see or hear the media. */
    altText: dryv.field(sharedProperties.NonEmptyString500).maybe(),
    /** Reviewed display order among the subject's media; not unique and not a default marker. */
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    /** The exact stored bytes. Acquisition before registration is a Source discovery or capture, never a URL here. */
    fileVersionId: belongsTo(() => FileVersions).maybe(),
    /** A remote resource instead of stored bytes: a video, social post, stock photo or generated avatar, kept as the raw URL. */
    externalUrl: dryv.field(sharedProperties.Url).maybe(),
    /** Scheme fil.media.platform: youtube, tiktok, facebook, instagram, x, vimeo, pexels, dicebear, website. */
    platformId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.fil.media.platform"),
    thumbnailUrl: dryv.field(sharedProperties.Url).maybe(),
  })
  .rule("MediaHasBytesOrUrl", rule.atLeastOne("fileVersionId", "externalUrl"))
  .extends(baseSchemas.CodedSubjectEntity)
  .description(
    "One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("media").index("subjectTable", "subjectId").index("kindId").index("fileVersionId"),
  });

/*---------------- contents ----------------*/
export const Contents = filesystem
  .schema("Contents", {
    /** The page address, unique per language: `institution/iebc`, `explainer/devolution`. */
    slug: dryv.field(sharedProperties.NonEmptyString255),
    languageId: belongsTo(() => Language),
    title: dryv.field(sharedProperties.Name),
    /** One or two sentences for lists and previews. */
    summary: dryv.field(sharedProperties.Description).maybe(),
    /** Scheme fil.content.category: institution, arm, constitution, place, person, explainer, blog. */
    categoryId: belongsTo(() => Value).tags("scheme:ref.sch.fil.content.category"),
    /** Scheme fil.content.classification: how a screen places it (overview, history, how-it-works, biography, ...). */
    classificationId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.fil.content.classification"),
    /** Markdown with optional front matter. Inline images are written `![alt](media:<media code>)`; the API resolves them. */
    body: dryv.field(sharedProperties.NonEmptyString),
    /** The registered file when the text also exists as stored bytes. */
    fileVersionId: belongsTo(() => FileVersions).maybe(),
    /** True for explanatory text written for the interface and not yet sourced. */
    isDevelopmentText: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.CodedSubjectEntity)
  .description(
    "One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("contents")
      .unique("slug", "languageId")
      .index("subjectTable", "subjectId")
      .index("categoryId")
      .index("classificationId"),
  });

/*---------------- content_tags ----------------*/
export const ContentTags = filesystem
  .schema("ContentTags", {
    contentId: belongsTo(() => Contents),
    tagId: belongsTo(() => Tags),
  })
  .extends(baseSchemas.Entity)
  .description("Tags a content text; a text may have several.")
  .role("entity")
  .facets({ storage: dryv.storage("content_tags").unique("contentId", "tagId").index("tagId") });
