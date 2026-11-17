// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BRANDING_RELATION_KEYS,
  BRANDING_SORTABLE_FIELDS,
  BRANDING_SEARCHABLE_FIELDS,
  BRANDING_FILTERABLE_FIELDS,
  BRANDING_DATE_RANGE_FIELDS,
  BRANDING_SELECTABLE_FIELDS,
  BRANDING_DEFAULT_SELECT_FIELDS,
  BRANDING_EDITABLE_FIELDS,
} from "./branding.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** How an entity or person presents itself: slogan, colours, a symbol or logo, a portrait. Words go in `value`; images and recordings are filesystem media that mention the entity or person. */
export interface IBranding extends B.IBase {
  code: string;
  entityId: string | null;
  individualId: string | null;
  kindId: string;
  languageId: string;
  sourceCitationId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  value: string | null;
  readonly entity?: EntitiesTypes.IEntities;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly kind?: ValueTypes.IValue;
  readonly language?: LanguageTypes.ILanguage;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BrandingKey = keyof IBranding;

export type BrandingRelationKey = (typeof BRANDING_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBrandingReadonlyFields = B.IBaseReadonlyFields;

export type IBrandingContextualFields = never;

export type IBrandingSensitiveFields = never;

export type IBrandingTransitionFields = never;

export type IBrandingImmutableFields =
  | IBrandingReadonlyFields
  | IBrandingContextualFields
  | IBrandingSensitiveFields
  | IBrandingTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBrandingCreatable = Omit<IBranding, IBrandingImmutableFields | BrandingRelationKey>;

export type IBrandingSystemWritable = Omit<IBranding, B.IBaseReadonlyFields | BrandingRelationKey>;

export type IBrandingUpdatable = Partial<
  Omit<IBranding, IBrandingImmutableFields | BrandingRelationKey>
>;

export interface IBrandingTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BrandingSortableField = (typeof BRANDING_SORTABLE_FIELDS)[number];

export type BrandingSearchableField = (typeof BRANDING_SEARCHABLE_FIELDS)[number];

export type BrandingFilterableField = (typeof BRANDING_FILTERABLE_FIELDS)[number];

export type BrandingDateRangeField = (typeof BRANDING_DATE_RANGE_FIELDS)[number];

export type BrandingSelectableField = (typeof BRANDING_SELECTABLE_FIELDS)[number];

export type BrandingDefaultSelectField = (typeof BRANDING_DEFAULT_SELECT_FIELDS)[number];

export type BrandingEditableField = (typeof BRANDING_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBrandingAsOneRelationConfig = Q.IOneRelationConfig<
  "branding",
  BrandingSelectableField
>;

export type IBrandingAsManyRelationConfig = Q.IManyRelationConfig<
  "brandings",
  BrandingSelectableField,
  BrandingSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBrandingAsOneRelationQuery = Q.IAsOneRelationQuery<IBranding, BrandingSelectableField>;

export type IBrandingAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBranding,
  BrandingSelectableField,
  BrandingSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBrandingRelationMap extends Record<BrandingRelationKey, unknown> {
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBrandingRelationQueries = Q.IBaseRelationQueries<
  IBranding,
  BrandingRelationKey,
  IBrandingRelationMap
>;

export type IBrandingItemQuery = Q.IBaseItemQuery<
  IBranding,
  BrandingRelationKey,
  BrandingSelectableField,
  BrandingRelationKey,
  BrandingSelectableField,
  IBrandingRelationMap,
  IBrandingRelationQueries
>;

export type IBrandingListQuery = Q.IBaseListQuery<
  IBranding,
  BrandingRelationKey,
  BrandingSelectableField,
  BrandingSortableField,
  BrandingRelationKey,
  BrandingSelectableField,
  BrandingSortableField,
  BrandingDateRangeField,
  BrandingFilterableField,
  IBrandingRelationMap,
  IBrandingRelationQueries,
  IBrandingItemQuery
>;
