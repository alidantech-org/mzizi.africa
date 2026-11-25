/** One part of a composite index, with its weight and transform. */
export interface StatisticsComponents {
  componentId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  indicatorId: string;
  position?: number | null;
  transformTerm: string;
  weight: number;
}
