// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SLUGS_RELATION_KEYS,
  SLUGS_SORTABLE_FIELDS,
  SLUGS_SEARCHABLE_FIELDS,
  SLUGS_FILTERABLE_FIELDS,
  SLUGS_DATE_RANGE_FIELDS,
  SLUGS_SELECTABLE_FIELDS,
  SLUGS_DEFAULT_SELECT_FIELDS,
  SLUGS_EDITABLE_FIELDS,
} from "./slugs.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables. */
export interface ISlugs extends B.IBase {
  canonicalSlugId: string | null;
  code: string;
  countryId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  languageId: string | null;
  namespaceId: string;
  parentSlugId: string | null;
  slug: string;
  subjectId: string;
  subjectTable: SubjectTable;
  toYear: number | null;
  readonly canonicalSlug?: ISlugs;
  readonly country?: CountryTypes.ICountry;
  readonly language?: LanguageTypes.ILanguage;
  readonly namespace?: ValueTypes.IValue;
  readonly parentSlug?: ISlugs;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SlugsKey = keyof ISlugs;

export type SlugsRelationKey = (typeof SLUGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISlugsReadonlyFields = B.IBaseReadonlyFields;

export type ISlugsContextualFields = never;

export type ISlugsSensitiveFields = never;

export type ISlugsTransitionFields = never;

export type ISlugsImmutableFields =
  ISlugsReadonlyFields | ISlugsContextualFields | ISlugsSensitiveFields | ISlugsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISlugsCreatable = Omit<ISlugs, ISlugsImmutableFields | SlugsRelationKey>;

export type ISlugsSystemWritable = Omit<ISlugs, B.IBaseReadonlyFields | SlugsRelationKey>;

export type ISlugsUpdatable = Partial<Omit<ISlugs, ISlugsImmutableFields | SlugsRelationKey>>;

export interface ISlugsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SlugsSortableField = (typeof SLUGS_SORTABLE_FIELDS)[number];

export type SlugsSearchableField = (typeof SLUGS_SEARCHABLE_FIELDS)[number];

export type SlugsFilterableField = (typeof SLUGS_FILTERABLE_FIELDS)[number];

export type SlugsDateRangeField = (typeof SLUGS_DATE_RANGE_FIELDS)[number];

export type SlugsSelectableField = (typeof SLUGS_SELECTABLE_FIELDS)[number];

export type SlugsDefaultSelectField = (typeof SLUGS_DEFAULT_SELECT_FIELDS)[number];

export type SlugsEditableField = (typeof SLUGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISlugsAsOneRelationConfig = Q.IOneRelationConfig<"slugs", SlugsSelectableField>;

export type ISlugsAsManyRelationConfig = Q.IManyRelationConfig<
  "slugs",
  SlugsSelectableField,
  SlugsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISlugsAsOneRelationQuery = Q.IAsOneRelationQuery<ISlugs, SlugsSelectableField>;

export type ISlugsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISlugs,
  SlugsSelectableField,
  SlugsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISlugsRelationMap extends Record<SlugsRelationKey, unknown> {
  canonicalSlug: ISlugsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  namespace: ValueTypes.IValueAsOneRelationQuery;
  parentSlug: ISlugsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISlugsRelationQueries = Q.IBaseRelationQueries<
  ISlugs,
  SlugsRelationKey,
  ISlugsRelationMap
>;

export type ISlugsItemQuery = Q.IBaseItemQuery<
  ISlugs,
  SlugsRelationKey,
  SlugsSelectableField,
  SlugsRelationKey,
  SlugsSelectableField,
  ISlugsRelationMap,
  ISlugsRelationQueries
>;

export type ISlugsListQuery = Q.IBaseListQuery<
  ISlugs,
  SlugsRelationKey,
  SlugsSelectableField,
  SlugsSortableField,
  SlugsRelationKey,
  SlugsSelectableField,
  SlugsSortableField,
  SlugsDateRangeField,
  SlugsFilterableField,
  ISlugsRelationMap,
  ISlugsRelationQueries,
  ISlugsItemQuery
>;
