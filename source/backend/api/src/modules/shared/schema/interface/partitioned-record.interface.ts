import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for append-only rows of partitioned tables: the table declares its own primary key. */
export interface PartitionedRecord {
  createdAt: Instant;
  id: Id;
}
