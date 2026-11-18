/** One fiscal reporting period for a country, with explicit date bounds and source citation. */
export interface FinanceFiscalPeriods {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn: string;
  id: string;
  periodKindId: string;
  sourceCitationId?: string | null;
  startsOn: string;
  updatedAt: string;
  version: number;
}
