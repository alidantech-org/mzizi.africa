/** Search Input */
export interface ExplorerSearchInput {
  countryCode: string;
  depth?: number;
  kindCode?: string;
  languageCode?: string;
  limit?: number;
  page?: number;
  parentFeatureId?: string;
  query?: string;
}
