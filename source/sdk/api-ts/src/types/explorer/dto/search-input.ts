/** Search Input */
export interface ExplorerSearchInput {
  countryCode: string;
  depth?: number;
  languageCode?: string;
  limit?: number;
  page?: number;
  parentFeatureId?: string;
  query: string;
}
