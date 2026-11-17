/** One sourced contact channel for exactly one identity; visibility class governs handling of private values. */
export interface OfficialContacts {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  kindId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  value: string;
  version: number;
  visibilityId: string;
}
