/** Place */
export interface ExplorerPlace {
  canonicalPath: string;
  citationCount: number;
  code: string;
  countryCode: string;
  depth: number;
  featureId: string;
  kind: string;
  kindCode: string;
  name: string;
  nameLanguage?: string | null;
  parentFeatureId?: string | null;
  parentName?: string | null;
}
