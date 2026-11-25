/** A good's weight in a basket. */
export interface EconomyWeights {
  basketId: string;
  createdAt: string;
  deletedAt?: string | null;
  goodId: string;
  id: string;
  weight: number;
}
