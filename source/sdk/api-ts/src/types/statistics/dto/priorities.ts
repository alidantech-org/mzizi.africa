/** Per-country order of trust for choosing the figure to show (Kenya ranks KNBS first). */
export interface StatisticsPriorities {
  collectionId?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  position: number;
  stewardId?: string | null;
  updatedAt: string;
  version: number;
}
