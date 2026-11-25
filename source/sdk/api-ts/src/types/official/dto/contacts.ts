/** A public or official-business contact of a named thing. */
export interface OfficialContacts {
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  kindTerm: string;
  toYear?: number | null;
  updatedAt: string;
  value: string;
  version: number;
  visibilityTerm: string;
}
