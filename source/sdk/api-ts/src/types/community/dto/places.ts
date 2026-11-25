/** A place an actor saved. */
export interface CommunityPlaces {
  actorId: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  isHome: boolean;
  label: string;
  position?: number | null;
  suggestionTerm?: string | null;
  updatedAt: string;
  version: number;
}
