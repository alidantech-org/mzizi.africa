/** Base for versioned records with a period of integer years. */
export interface SharedPeriodEntity {
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
