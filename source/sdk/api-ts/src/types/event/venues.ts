/** One place an occurrence happens at. An occurrence can have many: a national election covers every county and polling place. */
export interface EventVenues {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  note?: string | null;
  occurrenceId: string;
  roleId: string;
  updatedAt: string;
  version: number;
}
