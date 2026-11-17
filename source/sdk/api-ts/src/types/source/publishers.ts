/** Accepted publisher; an optional official identity distinguishes organization from publication channel. */
export interface SourcePublishers {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindId: string;
  name: string;
  officialEntityId?: string | null;
  updatedAt: string;
  version: number;
}
