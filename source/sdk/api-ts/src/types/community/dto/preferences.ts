import { CommunityThemeChoice } from "#sdk/types/community/enums/theme-choice.ts";

/** An actor's saved country, language, theme and home place. */
export interface CommunityPreferences {
  actorId: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  homeFeatureId?: string | null;
  id: string;
  languageId?: string | null;
  theme?: CommunityThemeChoice | null;
  updatedAt: string;
  version: number;
}
