/** Base for identity-backed records: the id is the identity's id; with a unique code. */
export interface SharedIdentityEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}
