/** Which breakdowns an indicator allows, in order. */
export interface StatisticsDimensions {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  indicatorId: string;
  isRequired: boolean;
  position: number;
  schemeId: string;
}
