
import type { DocumentFormat } from "#/types/exchange/document-format.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Artifact Ref */
export interface FileArtifactRef {
  captureId?: Id;
  contentHash: Sha256;
  documentId?: Id;
  fileVersionId: Id;
  mimeType: DocumentFormat;
  retrievedAt?: DateTime;
  sizeBytes: ByteCount;
  sourceUrl?: Url;
}