
import type { FormatCategory } from "#/types/filesystem/format-category.enum.ts";
import type { Extension } from "#/types/filesystem/extension.type.ts";
import type { MimeType } from "#/types/filesystem/mime-type.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Format */
export interface Format {
  category: FormatCategory;
  code: BusinessCode;
  createdAt: DateTime;
  extension: Extension;
  id: Id;
  isPreviewable: Flag;
  maxSizeBytes?: ByteCount | null;
  mimeType: MimeType;
  name: Name;
  processingStrategy?: Label | null;
  updatedAt: DateTime;
  version: Version;
}