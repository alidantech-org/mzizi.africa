/** Stable identity for one organization or legally identified entity; its names are stored in official.names. */
export interface OfficialEntities {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dissolvedOn?: string | null;
  id: string;
  kindId: string;
  registeredOn?: string | null;
  registrationCountryId?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
