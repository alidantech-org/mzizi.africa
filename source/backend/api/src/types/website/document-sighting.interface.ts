
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HttpStatus } from "#/types/website/http-status.type.ts";
import type { SectionLabel } from "#/types/website/section-label.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Document Sighting */
export interface DocumentSighting {
  captureId?: Id | null;
  contentHash: Checksum;
  createdAt: DateTime;
  depth: Count;
  documentId: Id;
  headers?: LongText | null;
  httpStatus: HttpStatus;
  id: Id;
  pageUrl?: Url | null;
  ruleIndex?: Count | null;
  sectionLabel?: SectionLabel | null;
  seenAt: DateTime;
  siteId: Id;
  sizeBytes: ByteCount;
  structureVersionId?: Id | null;
  updatedAt: DateTime;
  url: Url;
  version: Version;
}