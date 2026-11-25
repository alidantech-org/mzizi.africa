/** Base for versioned records with a unique identity code and a period of integer years. */
export interface SharedCodedPeriodEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
