/** Which named thing an asset illustrates and why (Nairobi ← photo, skyline). */
export interface MediaUses {
  assetId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  position?: number | null;
  purposeTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
