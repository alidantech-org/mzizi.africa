/** A link found while crawling. */
export interface SourceDiscoveries {
  anchorText?: string | null;
  context?: string | null;
  createdAt: string;
  discoveredAt: string;
  foundOnId?: string | null;
  id: string;
  observedUrl: string;
  pathId?: string | null;
  sourceId?: string | null;
}
