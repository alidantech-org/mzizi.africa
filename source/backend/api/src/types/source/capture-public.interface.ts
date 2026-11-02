
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HttpStatus } from "#/types/source/http-status.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { Document } from "#/types/source/document.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Capture Public */
export interface CapturePublic {
  contentHash?: Checksum | null;
  createdAt: DateTime;
  documentId: Id;
  fileVersionId?: Id | null;
  httpStatus?: HttpStatus | null;
  id: Id;
  retrievedAt: DateTime;
  retrievedBy?: Id | null;
  retrievedUrl?: Url | null;
  tool?: ToolName | null;
  updatedAt: DateTime;
  version: Version;
}