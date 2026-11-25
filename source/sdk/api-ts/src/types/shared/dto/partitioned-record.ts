/** Base for append-only rows of partitioned tables: the table declares its own primary key. */
export interface SharedPartitionedRecord {
  createdAt: string;
  id: string;
}
