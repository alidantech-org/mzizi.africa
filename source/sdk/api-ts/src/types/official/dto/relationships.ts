/** A kinship, business or political tie between public figures and organisations, always with a source link. */
export interface OfficialRelationships {
  basisTerm: string;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromId: string;
  fromYear?: number | null;
  id: string;
  kindTerm: string;
  sharePercentage?: number | null;
  startsOn?: string | null;
  statusTerm: string;
  toId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
