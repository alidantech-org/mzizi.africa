/** Expected coverage, for acquisition planning. */
export interface SourceCoverage {
  checkedOn?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  expectedUrl?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  id: string;
  levelId?: string | null;
  note?: string | null;
  noteLanguageId?: string | null;
  productId?: string | null;
  publisherId?: string | null;
  sourceId?: string | null;
  subjectTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
