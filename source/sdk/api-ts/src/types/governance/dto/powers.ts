/** How power flows between positions and institutions, by procedure and threshold. */
export interface GovernancePowers {
  createdAt: string;
  deletedAt?: string | null;
  fromId: string;
  id: string;
  isBinding: boolean;
  kindTerm: string;
  procedureId?: string | null;
  provisionId?: string | null;
  step?: number | null;
  thresholdTerm?: string | null;
  toId: string;
  updatedAt: string;
  version: number;
}
