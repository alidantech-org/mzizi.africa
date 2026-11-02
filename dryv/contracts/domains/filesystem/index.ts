import * as dryv from "@dryvcode/author";

import { optionalId, plainId, relationTo, searchable, systemRecord } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Files and media (FILESYSTEM_DESIGN.md).
 *
 * Metadata only: bytes live in an object store. A logical file has immutable versions; a version
 * points at a content-addressed, deduplicated object; renditions are variants of an object. Any
 * record in any schema links to media through attachments (schema.table + id), so other schemas
 * hold no file columns and no foreign keys here. Stores, objects, uploads and events are private:
 * the public API shows file metadata, never object keys, buckets or store configuration.
 */
export const filesystem = dryv.group({ name: "filesystem" }).description("Stores, formats, folders, objects, files, versions, variants, attachments, uploads and events.").tags("public", "filesystem").facets({ storage: { namespace: "filesystem" } });

export const filesystemProperties = filesystem.properties({
  StoreKind: dryv.property.enum({ objectStore: "object_store", localDirectory: "local_directory" }),
  StorageTier: dryv.property.enum({ hot: "hot", warm: "warm", cold: "cold", archive: "archive" }),
  FormatCategory: dryv.property.enum({ document: "document", image: "image", audio: "audio", video: "video", archive: "archive", dataset: "dataset", other: "other" }),
  ScanStatus: dryv.property.enum({ pending: "pending", clean: "clean", infected: "infected", skipped: "skipped" }),
  FileStatus: dryv.property.enum({ active: "active", trashed: "trashed", purged: "purged" }),
  Visibility: dryv.property.enum({ public: "public", restricted: "restricted" }),
  VariantKind: dryv.property.enum({ thumbnail: "thumbnail", preview: "preview", resized: "resized", text: "text", ocr: "ocr" }),
  UploadState: dryv.property.enum({ pending: "pending", completed: "completed", expired: "expired", aborted: "aborted" }),
  EventKind: dryv.property.enum({ created: "created", downloaded: "downloaded", versioned: "versioned", moved: "moved", renamed: "renamed", trashed: "trashed", restored: "restored", purged: "purged" }),
  MimeType: dryv.property.string().length({ min: 3, max: 200 }),
  Extension: dryv.property.string().length({ min: 1, max: 20 }),
  FileName: dryv.property.string().length({ min: 1, max: 255 }),
  FolderPath: dryv.property.string().length({ min: 1, max: 1000 }),
  ObjectKey: dryv.property.string().length({ min: 1, max: 500 }),
  Dimension: dryv.property.number.integer({ range: { min: 0 } }),
  Seconds: dryv.property.number.decimal({ precision: 12, scale: 3 }),
  AttachmentRole: dryv.property.string().length({ min: 1, max: 100 }),
});

const stores = filesystem.schemas({
  Store: systemRecord(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      kind: dryv.field(filesystemProperties.StoreKind),
      region: dryv.field(sharedProperties.Label).optional().nullable(),
      configurationName: dryv.field(sharedProperties.Label),
      tier: dryv.field(filesystemProperties.StorageTier),
      isActive: dryv.field(sharedProperties.Flag),
    },
    "stores",
    [{ name: "idx_store_code", fields: ["code"], unique: true }],
  ),

  Format: systemRecord(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      mimeType: dryv.field(filesystemProperties.MimeType).query({ filter: ["equal"] }),
      extension: dryv.field(filesystemProperties.Extension).query({ filter: ["equal"] }),
      category: dryv.field(filesystemProperties.FormatCategory).query({ filter: ["equal", "in"] }),
      isPreviewable: dryv.field(sharedProperties.Flag),
      maxSizeBytes: dryv.field(sharedProperties.ByteCount).optional().nullable(),
      processingStrategy: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "formats",
    [{ name: "idx_format_code", fields: ["code"], unique: true }, { name: "idx_format_mime", fields: ["mimeType"] }],
  ),

  Folder: systemRecord(
    {
      parentId: optionalId(),
      name: dryv.field(filesystemProperties.FileName).query(searchable),
      path: dryv.field(filesystemProperties.FolderPath).query({ filter: ["equal", "startsWith"] }),
      depth: dryv.field(sharedProperties.Count).query({ filter: ["equal"], sort: true }),
      visibility: dryv.field(filesystemProperties.Visibility).query({ filter: ["equal"] }),
    },
    "folders",
    [{ name: "idx_folder_path", fields: ["path"], unique: true }, { name: "idx_folder_parent", fields: ["parentId"] }],
  ),
});

const objects = filesystem.schemas({
  /** Immutable, content-addressed bytes. Identical content in one store is one object. */
  StoredObject: systemRecord(
    {
      storeId: relationTo(() => stores.Store.field("id")),
      formatId: optionalId(),
      contentHash: dryv.field(sharedProperties.Checksum).query({ filter: ["equal"] }),
      sizeBytes: dryv.field(sharedProperties.ByteCount),
      objectKey: dryv.field(filesystemProperties.ObjectKey),
      mediaWidth: dryv.field(filesystemProperties.Dimension).optional().nullable(),
      mediaHeight: dryv.field(filesystemProperties.Dimension).optional().nullable(),
      durationSeconds: dryv.field(filesystemProperties.Seconds).optional().nullable(),
      pageCount: dryv.field(filesystemProperties.Dimension).optional().nullable(),
      scanStatus: dryv.field(filesystemProperties.ScanStatus),
    },
    "objects",
    [
      { name: "idx_object_content", fields: ["storeId", "contentHash", "sizeBytes"], unique: true },
      { name: "idx_object_key", fields: ["storeId", "objectKey"], unique: true },
    ],
  ),
});

const files = filesystem.schemas({
  File: systemRecord(
    {
      folderId: relationTo(() => stores.Folder.field("id")),
      name: dryv.field(filesystemProperties.FileName).query(searchable),
      currentVersionId: optionalId(),
      status: dryv.field(filesystemProperties.FileStatus).query({ filter: ["equal", "in"] }),
      visibility: dryv.field(filesystemProperties.Visibility).query({ filter: ["equal"] }),
      ownerAccountId: optionalId(),
      isLegalHold: dryv.field(sharedProperties.Flag),
      trashedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "files",
    [{ name: "idx_file_folder_name", fields: ["folderId", "name"] }, { name: "idx_file_status", fields: ["status", "visibility"] }],
  ),
});

const versions = filesystem.schemas({
  FileVersion: systemRecord(
    {
      fileId: relationTo(() => files.File.field("id")),
      objectId: plainId(),
      versionNumber: dryv.field(sharedProperties.Version).query({ filter: ["equal", "between"], sort: true }),
      uploadedBy: optionalId(),
      note: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "versions",
    [{ name: "idx_version_file_number", fields: ["fileId", "versionNumber"], unique: true }, { name: "idx_version_object", fields: ["objectId"] }],
  ),

  /** A derived rendition of an object; the original is never modified. */
  FileVariant: systemRecord(
    {
      objectId: relationTo(() => objects.StoredObject.field("id")),
      derivedObjectId: plainId(),
      kind: dryv.field(filesystemProperties.VariantKind).query({ filter: ["equal", "in"] }),
      parameters: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "variants",
    [{ name: "idx_variant_object", fields: ["objectId", "kind"] }],
  ),

  /** Links a file to any record in any schema: the one place media is linked from. */
  FileAttachment: systemRecord(
    {
      fileId: relationTo(() => files.File.field("id")),
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      role: dryv.field(filesystemProperties.AttachmentRole).query({ filter: ["equal"] }),
      position: dryv.field(sharedProperties.Count).query({ sort: true }),
    },
    "attachments",
    [{ name: "idx_attachment_target", fields: ["targetKind", "targetId", "role"] }, { name: "idx_attachment_file", fields: ["fileId"] }],
  ),
});

const flows = filesystem.schemas({
  UploadSession: systemRecord(
    {
      storeId: plainId(),
      folderId: plainId(),
      fileName: dryv.field(filesystemProperties.FileName),
      expectedSizeBytes: dryv.field(sharedProperties.ByteCount),
      expectedHash: dryv.field(sharedProperties.Checksum).optional().nullable(),
      state: dryv.field(filesystemProperties.UploadState).query({ filter: ["equal"] }),
      expiresAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"] }),
      completedFileId: optionalId(),
      requestedBy: optionalId(),
    },
    "uploads",
    [{ name: "idx_upload_state", fields: ["state", "expiresAt"] }],
  ),

  /** Append-only access and change log; the largest table in the schema. */
  FileEvent: systemRecord(
    {
      fileId: plainId(),
      versionId: optionalId(),
      kind: dryv.field(filesystemProperties.EventKind).query({ filter: ["equal", "in"] }),
      actorId: optionalId(),
      occurredAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
      detail: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "events",
    [{ name: "idx_event_file", fields: ["fileId", "occurredAt"] }],
  ),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const filesystemRead = filesystem.feature("FilesystemRead").description("Public read access to file metadata, versions and attachments.").tags("public");
const surfaces = [
  readSurface(filesystem, { singular: "Format", plural: "Formats", itemKey: "format", listKey: "formats", path: "/filesystem/formats", idParam: "formatId", entity: stores.Format, description: "media formats", filters: { category: dryv.field(filesystemProperties.FormatCategory).optional(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(filesystem, { singular: "Folder", plural: "Folders", itemKey: "folder", listKey: "folders", path: "/filesystem/folders", idParam: "folderId", entity: stores.Folder, description: "public folders", filters: { parentId: id(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(filesystem, { singular: "File", plural: "Files", itemKey: "file", listKey: "files", path: "/filesystem/files", idParam: "fileId", entity: files.File, description: "public files", filters: { folderId: id(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(filesystem, { singular: "FileVersion", plural: "FileVersions", itemKey: "version", listKey: "versions", path: "/filesystem/versions", idParam: "versionId", entity: versions.FileVersion, description: "versions of public files", filters: { fileId: id() } }),
  readSurface(filesystem, { singular: "FileAttachment", plural: "FileAttachments", itemKey: "attachment", listKey: "attachments", path: "/filesystem/attachments", idParam: "attachmentId", entity: versions.FileAttachment, description: "attachments of public files", filters: { fileId: id(), targetKind: dryv.field(sharedProperties.TargetKind).optional(), targetId: id(), role: dryv.field(filesystemProperties.AttachmentRole).optional() } }),
];
export const filesystemReadOperations = filesystemRead.operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
void objects;
void flows;
