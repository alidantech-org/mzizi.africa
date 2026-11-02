
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { AttachmentRole } from "#/types/filesystem/attachment-role.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** File Attachment List Query */
export interface FileAttachmentListQuery {
  fileId?: Id;
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  role?: AttachmentRole;
  sort?: SortDirection;
  targetId?: Id;
  targetKind?: TargetKind;
}