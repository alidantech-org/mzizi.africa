/** Search Hit */
export interface InsightsSearchHit {
  code?: string | null;
  featureId?: string | null;
  id: string;
  imageUrl?: string | null;
  kind: string;
  kindLabel: string;
  path: string[];
  subtitle?: string | null;
  title: string;
}
