// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOMAINS_RELATION_KEYS,
  DOMAINS_SORTABLE_FIELDS,
  DOMAINS_SEARCHABLE_FIELDS,
  DOMAINS_FILTERABLE_FIELDS,
  DOMAINS_DATE_RANGE_FIELDS,
  DOMAINS_SELECTABLE_FIELDS,
  DOMAINS_DEFAULT_SELECT_FIELDS,
  DOMAINS_EDITABLE_FIELDS,
} from "./domains.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A host name a source is served from. A host belongs to one source at a time; its validity period records moves. */
export interface IDomains extends B.IBase {
  code: string;
  endsOn: Date | null;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  host: string;
  sourceId: string;
  startsOn: Date | null;
  toYear: number | null;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DomainsKey = keyof IDomains;

export type DomainsRelationKey = (typeof DOMAINS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDomainsReadonlyFields = B.IBaseReadonlyFields;

export type IDomainsContextualFields = never;

export type IDomainsSensitiveFields = never;

export type IDomainsTransitionFields = never;

export type IDomainsImmutableFields =
  | IDomainsReadonlyFields
  | IDomainsContextualFields
  | IDomainsSensitiveFields
  | IDomainsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDomainsCreatable = Omit<IDomains, IDomainsImmutableFields | DomainsRelationKey>;

export type IDomainsSystemWritable = Omit<IDomains, B.IBaseReadonlyFields | DomainsRelationKey>;

export type IDomainsUpdatable = Partial<
  Omit<IDomains, IDomainsImmutableFields | DomainsRelationKey>
>;

export interface IDomainsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DomainsSortableField = (typeof DOMAINS_SORTABLE_FIELDS)[number];

export type DomainsSearchableField = (typeof DOMAINS_SEARCHABLE_FIELDS)[number];

export type DomainsFilterableField = (typeof DOMAINS_FILTERABLE_FIELDS)[number];

export type DomainsDateRangeField = (typeof DOMAINS_DATE_RANGE_FIELDS)[number];

export type DomainsSelectableField = (typeof DOMAINS_SELECTABLE_FIELDS)[number];

export type DomainsDefaultSelectField = (typeof DOMAINS_DEFAULT_SELECT_FIELDS)[number];

export type DomainsEditableField = (typeof DOMAINS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDomainsAsOneRelationConfig = Q.IOneRelationConfig<"domains", DomainsSelectableField>;

export type IDomainsAsManyRelationConfig = Q.IManyRelationConfig<
  "domains",
  DomainsSelectableField,
  DomainsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDomainsAsOneRelationQuery = Q.IAsOneRelationQuery<IDomains, DomainsSelectableField>;

export type IDomainsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDomains,
  DomainsSelectableField,
  DomainsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDomainsRelationMap extends Record<DomainsRelationKey, unknown> {
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDomainsRelationQueries = Q.IBaseRelationQueries<
  IDomains,
  DomainsRelationKey,
  IDomainsRelationMap
>;

export type IDomainsItemQuery = Q.IBaseItemQuery<
  IDomains,
  DomainsRelationKey,
  DomainsSelectableField,
  DomainsRelationKey,
  DomainsSelectableField,
  IDomainsRelationMap,
  IDomainsRelationQueries
>;

export type IDomainsListQuery = Q.IBaseListQuery<
  IDomains,
  DomainsRelationKey,
  DomainsSelectableField,
  DomainsSortableField,
  DomainsRelationKey,
  DomainsSelectableField,
  DomainsSortableField,
  DomainsDateRangeField,
  DomainsFilterableField,
  IDomainsRelationMap,
  IDomainsRelationQueries,
  IDomainsItemQuery
>;
