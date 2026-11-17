// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AddressesTypes from "#/modules/source/schema/types/addresses/addresses.types";
import type * as ArtifactsTypes from "#/modules/source/schema/types/artifacts/artifacts.types";
import type * as DiscoveriesTypes from "#/modules/source/schema/types/discoveries/discoveries.types";
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CAPTURES_RELATION_KEYS,
  CAPTURES_SORTABLE_FIELDS,
  CAPTURES_SEARCHABLE_FIELDS,
  CAPTURES_FILTERABLE_FIELDS,
  CAPTURES_DATE_RANGE_FIELDS,
  CAPTURES_SELECTABLE_FIELDS,
  CAPTURES_DEFAULT_SELECT_FIELDS,
  CAPTURES_EDITABLE_FIELDS,
} from "./captures.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other. */
export interface ICaptures extends B.IBase {
  addressId: string | null;
  artifactId: string | null;
  code: string;
  discoveryId: string | null;
  originalUrl: string;
  responseMetadata: string;
  retrievedAt: Date;
  retrievedUrl: string | null;
  sourceId: string | null;
  readonly address?: AddressesTypes.IAddresses;
  readonly artifact?: ArtifactsTypes.IArtifacts;
  readonly discovery?: DiscoveriesTypes.IDiscoveries;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CapturesKey = keyof ICaptures;

export type CapturesRelationKey = (typeof CAPTURES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICapturesReadonlyFields = B.IBaseReadonlyFields;

export type ICapturesContextualFields = never;

export type ICapturesSensitiveFields = never;

export type ICapturesTransitionFields = never;

export type ICapturesImmutableFields =
  | ICapturesReadonlyFields
  | ICapturesContextualFields
  | ICapturesSensitiveFields
  | ICapturesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICapturesCreatable = Omit<ICaptures, ICapturesImmutableFields | CapturesRelationKey>;

export type ICapturesSystemWritable = Omit<ICaptures, B.IBaseReadonlyFields | CapturesRelationKey>;

export type ICapturesUpdatable = Partial<
  Omit<ICaptures, ICapturesImmutableFields | CapturesRelationKey>
>;

export interface ICapturesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CapturesSortableField = (typeof CAPTURES_SORTABLE_FIELDS)[number];

export type CapturesSearchableField = (typeof CAPTURES_SEARCHABLE_FIELDS)[number];

export type CapturesFilterableField = (typeof CAPTURES_FILTERABLE_FIELDS)[number];

export type CapturesDateRangeField = (typeof CAPTURES_DATE_RANGE_FIELDS)[number];

export type CapturesSelectableField = (typeof CAPTURES_SELECTABLE_FIELDS)[number];

export type CapturesDefaultSelectField = (typeof CAPTURES_DEFAULT_SELECT_FIELDS)[number];

export type CapturesEditableField = (typeof CAPTURES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICapturesAsOneRelationConfig = Q.IOneRelationConfig<
  "captures",
  CapturesSelectableField
>;

export type ICapturesAsManyRelationConfig = Q.IManyRelationConfig<
  "captures",
  CapturesSelectableField,
  CapturesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICapturesAsOneRelationQuery = Q.IAsOneRelationQuery<ICaptures, CapturesSelectableField>;

export type ICapturesAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICaptures,
  CapturesSelectableField,
  CapturesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICapturesRelationMap extends Record<CapturesRelationKey, unknown> {
  address: AddressesTypes.IAddressesAsOneRelationQuery;
  artifact: ArtifactsTypes.IArtifactsAsOneRelationQuery;
  discovery: DiscoveriesTypes.IDiscoveriesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICapturesRelationQueries = Q.IBaseRelationQueries<
  ICaptures,
  CapturesRelationKey,
  ICapturesRelationMap
>;

export type ICapturesItemQuery = Q.IBaseItemQuery<
  ICaptures,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesRelationKey,
  CapturesSelectableField,
  ICapturesRelationMap,
  ICapturesRelationQueries
>;

export type ICapturesListQuery = Q.IBaseListQuery<
  ICaptures,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesSortableField,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesSortableField,
  CapturesDateRangeField,
  CapturesFilterableField,
  ICapturesRelationMap,
  ICapturesRelationQueries,
  ICapturesItemQuery
>;
