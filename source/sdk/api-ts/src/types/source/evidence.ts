/** Durable evidence bundle whose exact supporting items are normalized citations. */
export interface SourceEvidence {
  assembledAt: string;
  assembledBySnapshot: string;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kindId: string;
  title: string;
  updatedAt: string;
  version: number;
}
