/** How an entity or person presents itself: slogan, colours, a symbol or logo, a portrait. Words go in `value`; images and recordings are filesystem media that mention the entity or person. */
export interface OfficialBranding {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  kindId: string;
  languageId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  value?: string | null;
  version: number;
}
