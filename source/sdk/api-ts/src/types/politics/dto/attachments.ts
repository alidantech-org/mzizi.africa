/** Media on commitments, fulfilments and manifestos (the video of a promise). */
export interface PoliticsAttachments {
  articleId?: string | null;
  assetId?: string | null;
  commitmentId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endSecond?: number | null;
  fulfilmentId?: string | null;
  id: string;
  manifestoId?: string | null;
  position?: number | null;
  purposeTerm: string;
  startSecond?: number | null;
  updatedAt: string;
  version: number;
}
