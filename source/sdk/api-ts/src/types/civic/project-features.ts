/** One typed relationship between a Civic project and one Geography feature. */
export interface CivicProjectFeatures {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  featureKindId: string;
  id: string;
  projectId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
