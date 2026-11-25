/** A fiscal period of a country (FY 2023/24). */
export interface FinancePeriods {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn: string;
  fromYear?: number | null;
  id: string;
  kindTerm: string;
  startsOn: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
