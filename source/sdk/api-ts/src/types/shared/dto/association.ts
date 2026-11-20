/** Base for association rows: id, created timestamp and soft delete. */
export interface SharedAssociation {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
}
