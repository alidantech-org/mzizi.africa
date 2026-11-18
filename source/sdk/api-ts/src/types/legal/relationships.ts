/** A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here. */
export interface LegalRelationships {
  affectedWordingId?: string | null;
  authorityWordingId?: string | null;
  citationId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  explanation?: string | null;
  id: string;
  kindId: string;
  objectInstrumentId?: string | null;
  resultingWordingId?: string | null;
  subjectInstrumentId?: string | null;
  updatedAt: string;
  version: number;
}
