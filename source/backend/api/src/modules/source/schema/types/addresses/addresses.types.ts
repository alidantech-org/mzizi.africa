// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { AddressKind } from "#/modules/source/schema/enum/address-kind.enum";
import type { HttpMethod } from "#/modules/source/schema/enum/http-method.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DomainsTypes from "#/modules/source/schema/types/domains/domains.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ADDRESSES_RELATION_KEYS,
  ADDRESSES_SORTABLE_FIELDS,
  ADDRESSES_SEARCHABLE_FIELDS,
  ADDRESSES_FILTERABLE_FIELDS,
  ADDRESSES_DATE_RANGE_FIELDS,
  ADDRESSES_SELECTABLE_FIELDS,
  ADDRESSES_DEFAULT_SELECT_FIELDS,
  ADDRESSES_EDITABLE_FIELDS,
} from "./addresses.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A page, listing, file or API endpoint on a domain, distinguished by method, path and query. */
export interface IAddresses extends B.IBase {
  code: string;
  domainId: string;
  kind: AddressKind;
  method: HttpMethod;
  note: string | null;
  path: string;
  query: string;
  readonly domain?: DomainsTypes.IDomains;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AddressesKey = keyof IAddresses;

export type AddressesRelationKey = (typeof ADDRESSES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAddressesReadonlyFields = B.IBaseReadonlyFields;

export type IAddressesContextualFields = never;

export type IAddressesSensitiveFields = never;

export type IAddressesTransitionFields = never;

export type IAddressesImmutableFields =
  | IAddressesReadonlyFields
  | IAddressesContextualFields
  | IAddressesSensitiveFields
  | IAddressesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAddressesCreatable = Omit<
  IAddresses,
  IAddressesImmutableFields | AddressesRelationKey
>;

export type IAddressesSystemWritable = Omit<
  IAddresses,
  B.IBaseReadonlyFields | AddressesRelationKey
>;

export type IAddressesUpdatable = Partial<
  Omit<IAddresses, IAddressesImmutableFields | AddressesRelationKey>
>;

export interface IAddressesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AddressesSortableField = (typeof ADDRESSES_SORTABLE_FIELDS)[number];

export type AddressesSearchableField = (typeof ADDRESSES_SEARCHABLE_FIELDS)[number];

export type AddressesFilterableField = (typeof ADDRESSES_FILTERABLE_FIELDS)[number];

export type AddressesDateRangeField = (typeof ADDRESSES_DATE_RANGE_FIELDS)[number];

export type AddressesSelectableField = (typeof ADDRESSES_SELECTABLE_FIELDS)[number];

export type AddressesDefaultSelectField = (typeof ADDRESSES_DEFAULT_SELECT_FIELDS)[number];

export type AddressesEditableField = (typeof ADDRESSES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAddressesAsOneRelationConfig = Q.IOneRelationConfig<
  "addresses",
  AddressesSelectableField
>;

export type IAddressesAsManyRelationConfig = Q.IManyRelationConfig<
  "addresses",
  AddressesSelectableField,
  AddressesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAddressesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IAddresses,
  AddressesSelectableField
>;

export type IAddressesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAddresses,
  AddressesSelectableField,
  AddressesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAddressesRelationMap extends Record<AddressesRelationKey, unknown> {
  domain: DomainsTypes.IDomainsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAddressesRelationQueries = Q.IBaseRelationQueries<
  IAddresses,
  AddressesRelationKey,
  IAddressesRelationMap
>;

export type IAddressesItemQuery = Q.IBaseItemQuery<
  IAddresses,
  AddressesRelationKey,
  AddressesSelectableField,
  AddressesRelationKey,
  AddressesSelectableField,
  IAddressesRelationMap,
  IAddressesRelationQueries
>;

export type IAddressesListQuery = Q.IBaseListQuery<
  IAddresses,
  AddressesRelationKey,
  AddressesSelectableField,
  AddressesSortableField,
  AddressesRelationKey,
  AddressesSelectableField,
  AddressesSortableField,
  AddressesDateRangeField,
  AddressesFilterableField,
  IAddressesRelationMap,
  IAddressesRelationQueries,
  IAddressesItemQuery
>;
