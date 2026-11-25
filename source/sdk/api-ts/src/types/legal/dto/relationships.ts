/** An amendment, repeal or replacement between instruments or wordings. */
export interface LegalRelationships {
  affectedWordingId?: string | null;
  authorityWordingId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  id: string;
  kindTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  objectInstrumentId?: string | null;
  resultingWordingId?: string | null;
  subjectInstrumentId?: string | null;
  updatedAt: string;
  version: number;
}
