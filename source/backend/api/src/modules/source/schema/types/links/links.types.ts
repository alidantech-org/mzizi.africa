// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SlugsTypes from "#/modules/source/schema/types/slugs/slugs.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LINKS_RELATION_KEYS,
  LINKS_SORTABLE_FIELDS,
  LINKS_SEARCHABLE_FIELDS,
  LINKS_FILTERABLE_FIELDS,
  LINKS_DATE_RANGE_FIELDS,
  LINKS_SELECTABLE_FIELDS,
  LINKS_DEFAULT_SELECT_FIELDS,
  LINKS_EDITABLE_FIELDS,
} from "./links.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles. */
export interface ILinks extends B.IBase {
  fromSlugId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  relationKindId: string;
  toSlugId: string;
  toYear: number | null;
  readonly fromSlug?: SlugsTypes.ISlugs;
  readonly relationKind?: ValueTypes.IValue;
  readonly toSlug?: SlugsTypes.ISlugs;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LinksKey = keyof ILinks;

export type LinksRelationKey = (typeof LINKS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILinksReadonlyFields = B.IBaseReadonlyFields;

export type ILinksContextualFields = never;

export type ILinksSensitiveFields = never;

export type ILinksTransitionFields = never;

export type ILinksImmutableFields =
  ILinksReadonlyFields | ILinksContextualFields | ILinksSensitiveFields | ILinksTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILinksCreatable = Omit<ILinks, ILinksImmutableFields | LinksRelationKey>;

export type ILinksSystemWritable = Omit<ILinks, B.IBaseReadonlyFields | LinksRelationKey>;

export type ILinksUpdatable = Partial<Omit<ILinks, ILinksImmutableFields | LinksRelationKey>>;

export interface ILinksTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LinksSortableField = (typeof LINKS_SORTABLE_FIELDS)[number];

export type LinksSearchableField = (typeof LINKS_SEARCHABLE_FIELDS)[number];

export type LinksFilterableField = (typeof LINKS_FILTERABLE_FIELDS)[number];

export type LinksDateRangeField = (typeof LINKS_DATE_RANGE_FIELDS)[number];

export type LinksSelectableField = (typeof LINKS_SELECTABLE_FIELDS)[number];

export type LinksDefaultSelectField = (typeof LINKS_DEFAULT_SELECT_FIELDS)[number];

export type LinksEditableField = (typeof LINKS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILinksAsOneRelationConfig = Q.IOneRelationConfig<"links", LinksSelectableField>;

export type ILinksAsManyRelationConfig = Q.IManyRelationConfig<
  "links",
  LinksSelectableField,
  LinksSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILinksAsOneRelationQuery = Q.IAsOneRelationQuery<ILinks, LinksSelectableField>;

export type ILinksAsManyRelationQuery = Q.IAsManyRelationQuery<
  ILinks,
  LinksSelectableField,
  LinksSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILinksRelationMap extends Record<LinksRelationKey, unknown> {
  fromSlug: SlugsTypes.ISlugsAsOneRelationQuery;
  relationKind: ValueTypes.IValueAsOneRelationQuery;
  toSlug: SlugsTypes.ISlugsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILinksRelationQueries = Q.IBaseRelationQueries<
  ILinks,
  LinksRelationKey,
  ILinksRelationMap
>;

export type ILinksItemQuery = Q.IBaseItemQuery<
  ILinks,
  LinksRelationKey,
  LinksSelectableField,
  LinksRelationKey,
  LinksSelectableField,
  ILinksRelationMap,
  ILinksRelationQueries
>;

export type ILinksListQuery = Q.IBaseListQuery<
  ILinks,
  LinksRelationKey,
  LinksSelectableField,
  LinksSortableField,
  LinksRelationKey,
  LinksSelectableField,
  LinksSortableField,
  LinksDateRangeField,
  LinksFilterableField,
  ILinksRelationMap,
  ILinksRelationQueries,
  ILinksItemQuery
>;
