/** Base for versioned records: id, version, created/updated timestamps and soft delete. */
export interface SharedEntity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}
