/** A person's dated membership of a party. */
export interface PoliticsMemberships {
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  individualId: string;
  kindTerm: string;
  partyId: string;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
