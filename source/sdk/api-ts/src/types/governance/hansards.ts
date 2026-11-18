/** The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages. */
export interface GovernanceHansards {
  artifactId: string;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  isProvisional: boolean;
  languageId: string;
  publishedOn?: string | null;
  reference?: string | null;
  sittingId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
