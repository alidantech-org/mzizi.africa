/** Words and colours of a named thing (slogan, motto, party colours); images are `media`. */
export interface OfficialBranding {
  colors?: string[] | null;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  kindTerm: string;
  languageId?: string | null;
  text?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
