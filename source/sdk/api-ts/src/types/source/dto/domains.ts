/** A host name a source publishes on. */
export interface SourceDomains {
  code: string;
  contactId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  host: string;
  id: string;
  lastCheckedAt?: string | null;
  ownerId?: string | null;
  sourceId?: string | null;
  startsOn?: string | null;
  statusTerm: string;
  templateId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
