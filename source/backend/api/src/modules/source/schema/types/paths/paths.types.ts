// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { HttpMethod } from "#/modules/source/schema/enum/http-method.enum";
import type { PathKind } from "#/modules/source/schema/enum/path-kind.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DomainsTypes from "#/modules/source/schema/types/domains/domains.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PATHS_RELATION_KEYS,
  PATHS_SORTABLE_FIELDS,
  PATHS_SEARCHABLE_FIELDS,
  PATHS_FILTERABLE_FIELDS,
  PATHS_DATE_RANGE_FIELDS,
  PATHS_SELECTABLE_FIELDS,
  PATHS_DEFAULT_SELECT_FIELDS,
  PATHS_EDITABLE_FIELDS,
} from "./paths.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A page, listing, file or API endpoint on a domain; captures hang off it. */
export interface IPaths extends B.IBase {
  code: string;
  domainId: string;
  kind: PathKind;
  method: HttpMethod | null;
  note: string | null;
  path: string;
  readonly domain?: DomainsTypes.IDomains;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PathsKey = keyof IPaths;

export type PathsRelationKey = (typeof PATHS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPathsReadonlyFields = B.IBaseReadonlyFields;

export type IPathsContextualFields = never;

export type IPathsSensitiveFields = never;

export type IPathsTransitionFields = never;

export type IPathsImmutableFields =
  IPathsReadonlyFields | IPathsContextualFields | IPathsSensitiveFields | IPathsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPathsCreatable = Omit<IPaths, IPathsImmutableFields | PathsRelationKey>;

export type IPathsSystemWritable = Omit<IPaths, B.IBaseReadonlyFields | PathsRelationKey>;

export type IPathsUpdatable = Partial<Omit<IPaths, IPathsImmutableFields | PathsRelationKey>>;

export interface IPathsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PathsSortableField = (typeof PATHS_SORTABLE_FIELDS)[number];

export type PathsSearchableField = (typeof PATHS_SEARCHABLE_FIELDS)[number];

export type PathsFilterableField = (typeof PATHS_FILTERABLE_FIELDS)[number];

export type PathsDateRangeField = (typeof PATHS_DATE_RANGE_FIELDS)[number];

export type PathsSelectableField = (typeof PATHS_SELECTABLE_FIELDS)[number];

export type PathsDefaultSelectField = (typeof PATHS_DEFAULT_SELECT_FIELDS)[number];

export type PathsEditableField = (typeof PATHS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPathsAsOneRelationConfig = Q.IOneRelationConfig<"paths", PathsSelectableField>;

export type IPathsAsManyRelationConfig = Q.IManyRelationConfig<
  "paths",
  PathsSelectableField,
  PathsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPathsAsOneRelationQuery = Q.IAsOneRelationQuery<IPaths, PathsSelectableField>;

export type IPathsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPaths,
  PathsSelectableField,
  PathsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPathsRelationMap extends Record<PathsRelationKey, unknown> {
  domain: DomainsTypes.IDomainsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPathsRelationQueries = Q.IBaseRelationQueries<
  IPaths,
  PathsRelationKey,
  IPathsRelationMap
>;

export type IPathsItemQuery = Q.IBaseItemQuery<
  IPaths,
  PathsRelationKey,
  PathsSelectableField,
  PathsRelationKey,
  PathsSelectableField,
  IPathsRelationMap,
  IPathsRelationQueries
>;

export type IPathsListQuery = Q.IBaseListQuery<
  IPaths,
  PathsRelationKey,
  PathsSelectableField,
  PathsSortableField,
  PathsRelationKey,
  PathsSelectableField,
  PathsSortableField,
  PathsDateRangeField,
  PathsFilterableField,
  IPathsRelationMap,
  IPathsRelationQueries,
  IPathsItemQuery
>;
