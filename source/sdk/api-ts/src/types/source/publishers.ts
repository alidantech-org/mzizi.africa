/** Accepted publisher; an optional official identity distinguishes the organization from its publication channels. */
export interface SourcePublishers {
  classificationId?: string | null;
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
