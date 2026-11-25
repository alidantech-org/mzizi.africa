/** Base for versioned records of partitioned tables: the table declares its own primary key. */
export interface SharedPartitionedEntity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}
