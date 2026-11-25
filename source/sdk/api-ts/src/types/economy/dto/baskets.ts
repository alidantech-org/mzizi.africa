/** A set of goods with weights (a CPI basket). */
export interface EconomyBaskets {
  code: string;
  collectionId?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
