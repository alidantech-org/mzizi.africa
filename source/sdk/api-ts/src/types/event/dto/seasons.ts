/** A recurring season of a country or region. */
export interface EventSeasons {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endDay?: number | null;
  endMonth: number;
  featureId?: string | null;
  id: string;
  isNatural: boolean;
  kindTerm: string;
  startDay?: number | null;
  startMonth: number;
  updatedAt: string;
  version: number;
}
