/** Media on projects, contracts and deliveries (site photos, signed contracts). */
export interface CivicAttachments {
  articleId?: string | null;
  assetId?: string | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  deliveryId?: string | null;
  endSecond?: number | null;
  id: string;
  position?: number | null;
  projectId?: string | null;
  purposeTerm: string;
  startSecond?: number | null;
  updatedAt: string;
  version: number;
}
