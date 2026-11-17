// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AddressesTypes from "#/modules/source/schema/types/addresses/addresses.types";
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DISCOVERIES_RELATION_KEYS,
  DISCOVERIES_SORTABLE_FIELDS,
  DISCOVERIES_SEARCHABLE_FIELDS,
  DISCOVERIES_FILTERABLE_FIELDS,
  DISCOVERIES_DATE_RANGE_FIELDS,
  DISCOVERIES_SELECTABLE_FIELDS,
  DISCOVERIES_DEFAULT_SELECT_FIELDS,
  DISCOVERIES_EDITABLE_FIELDS,
} from "./discoveries.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture. */
export interface IDiscoveries extends B.IBase {
  addressId: string | null;
  anchorText: string | null;
  context: string | null;
  discoveredAt: Date;
  foundOnAddressId: string | null;
  observedUrl: string;
  sourceId: string | null;
  readonly address?: AddressesTypes.IAddresses;
  readonly foundOnAddress?: AddressesTypes.IAddresses;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DiscoveriesKey = keyof IDiscoveries;

export type DiscoveriesRelationKey = (typeof DISCOVERIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDiscoveriesReadonlyFields = B.IBaseReadonlyFields;

export type IDiscoveriesContextualFields = never;

export type IDiscoveriesSensitiveFields = never;

export type IDiscoveriesTransitionFields = never;

export type IDiscoveriesImmutableFields =
  | IDiscoveriesReadonlyFields
  | IDiscoveriesContextualFields
  | IDiscoveriesSensitiveFields
  | IDiscoveriesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDiscoveriesCreatable = Omit<
  IDiscoveries,
  IDiscoveriesImmutableFields | DiscoveriesRelationKey
>;

export type IDiscoveriesSystemWritable = Omit<
  IDiscoveries,
  B.IBaseReadonlyFields | DiscoveriesRelationKey
>;

export type IDiscoveriesUpdatable = Partial<
  Omit<IDiscoveries, IDiscoveriesImmutableFields | DiscoveriesRelationKey>
>;

export interface IDiscoveriesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DiscoveriesSortableField = (typeof DISCOVERIES_SORTABLE_FIELDS)[number];

export type DiscoveriesSearchableField = (typeof DISCOVERIES_SEARCHABLE_FIELDS)[number];

export type DiscoveriesFilterableField = (typeof DISCOVERIES_FILTERABLE_FIELDS)[number];

export type DiscoveriesDateRangeField = (typeof DISCOVERIES_DATE_RANGE_FIELDS)[number];

export type DiscoveriesSelectableField = (typeof DISCOVERIES_SELECTABLE_FIELDS)[number];

export type DiscoveriesDefaultSelectField = (typeof DISCOVERIES_DEFAULT_SELECT_FIELDS)[number];

export type DiscoveriesEditableField = (typeof DISCOVERIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDiscoveriesAsOneRelationConfig = Q.IOneRelationConfig<
  "discoveries",
  DiscoveriesSelectableField
>;

export type IDiscoveriesAsManyRelationConfig = Q.IManyRelationConfig<
  "discoveries",
  DiscoveriesSelectableField,
  DiscoveriesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDiscoveriesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IDiscoveries,
  DiscoveriesSelectableField
>;

export type IDiscoveriesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDiscoveries,
  DiscoveriesSelectableField,
  DiscoveriesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDiscoveriesRelationMap extends Record<DiscoveriesRelationKey, unknown> {
  address: AddressesTypes.IAddressesAsOneRelationQuery;
  foundOnAddress: AddressesTypes.IAddressesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDiscoveriesRelationQueries = Q.IBaseRelationQueries<
  IDiscoveries,
  DiscoveriesRelationKey,
  IDiscoveriesRelationMap
>;

export type IDiscoveriesItemQuery = Q.IBaseItemQuery<
  IDiscoveries,
  DiscoveriesRelationKey,
  DiscoveriesSelectableField,
  DiscoveriesRelationKey,
  DiscoveriesSelectableField,
  IDiscoveriesRelationMap,
  IDiscoveriesRelationQueries
>;

export type IDiscoveriesListQuery = Q.IBaseListQuery<
  IDiscoveries,
  DiscoveriesRelationKey,
  DiscoveriesSelectableField,
  DiscoveriesSortableField,
  DiscoveriesRelationKey,
  DiscoveriesSelectableField,
  DiscoveriesSortableField,
  DiscoveriesDateRangeField,
  DiscoveriesFilterableField,
  IDiscoveriesRelationMap,
  IDiscoveriesRelationQueries,
  IDiscoveriesItemQuery
>;
