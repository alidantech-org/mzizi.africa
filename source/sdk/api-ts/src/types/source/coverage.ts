/** What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero. */
export interface SourceCoverage {
  checkedOn: string;
  code: string;
  countryId: string;
  coverageSubjectId: string;
  createdAt: string;
  deletedAt?: string | null;
  expectedPublicationUrl?: string | null;
  id: string;
  levelId: string;
  note?: string | null;
  periodFrom?: string | null;
  periodUntil?: string | null;
  productId?: string | null;
  publisherEntityId?: string | null;
  scopeUnitFeatureId?: string | null;
  sourceId?: string | null;
  updatedAt: string;
  version: number;
}
