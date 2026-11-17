// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DomainsConfig from "#/modules/source/schema/types/domains/domains.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAddresses,
  AddressesKey,
  AddressesRelationKey,
  AddressesSortableField,
  AddressesFilterableField,
  AddressesDateRangeField,
  AddressesSelectableField,
  IAddressesAsOneRelationConfig,
  IAddressesAsManyRelationConfig,
} from "./addresses.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ADDRESSES_RELATION_KEYS = ["domain"] as const satisfies readonly AddressesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ADDRESSES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "query",
  "updatedAt",
  "version",
] as const satisfies readonly AddressesKey[];

export const ADDRESSES_SEARCHABLE_FIELDS = [
  "code",
  "note",
  "path",
  "query",
] as const satisfies readonly AddressesKey[];

export const ADDRESSES_FILTERABLE_FIELDS = [
  "domainId",
  "id",
  "kind",
  "method",
] as const satisfies readonly AddressesKey[];

export const ADDRESSES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly AddressesKey[];

export const ADDRESSES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAddresses> = {
  searchableFields: [...ADDRESSES_SEARCHABLE_FIELDS],
  filterFields: [...ADDRESSES_FILTERABLE_FIELDS],
  dateRangeFields: [...ADDRESSES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ADDRESSES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "query",
  "updatedAt",
  "version",
] as const satisfies readonly AddressesKey[];

export const ADDRESSES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "query",
  "updatedAt",
  "version",
] as const satisfies readonly AddressesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ADDRESSES_EDITABLE_FIELDS = [
  "code",
  "domainId",
  "kind",
  "method",
  "note",
  "path",
  "query",
] as const satisfies readonly AddressesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ADDRESSES_AS_ONE_RELATION_CONFIG = {
  relation: "addresses",
  type: ERelationType.One,
  selectableFields: ADDRESSES_SELECTABLE_FIELDS,
  defaultSelectFields: ADDRESSES_DEFAULT_SELECT_FIELDS,
} as const satisfies IAddressesAsOneRelationConfig;

export const ADDRESSES_AS_MANY_RELATION_CONFIG = {
  relation: "addresses",
  type: ERelationType.Many,
  selectableFields: ADDRESSES_SELECTABLE_FIELDS,
  defaultSelectFields: ADDRESSES_DEFAULT_SELECT_FIELDS,
  sortableFields: ADDRESSES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAddressesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ADDRESSES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AddressesRelationKey>().one(
    () => DomainsConfig.DOMAINS_AS_ONE_RELATION_CONFIG,
    "domain",
  ),
] as const;

export const ADDRESSES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ADDRESSES_QUERY_OPTIONS = {
  searchableFields: ADDRESSES_SEARCHABLE_FIELDS,
  selectableFields: ADDRESSES_SELECTABLE_FIELDS,
  defaultSelectFields: ADDRESSES_DEFAULT_SELECT_FIELDS,
  sortableFields: ADDRESSES_SORTABLE_FIELDS,
  filterFields: ADDRESSES_FILTERABLE_FIELDS,
  dateRangeFields: ADDRESSES_DATE_RANGE_FIELDS,
  relationKeys: ADDRESSES_RELATION_KEYS,
  editableFields: ADDRESSES_EDITABLE_FIELDS,
  asOne: ADDRESSES_AS_ONE_RELATION_CONFIG,
  asMany: ADDRESSES_AS_MANY_RELATION_CONFIG,
  oneRelations: ADDRESSES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ADDRESSES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAddresses,
  AddressesSortableField,
  AddressesSelectableField,
  AddressesFilterableField,
  AddressesDateRangeField,
  AddressesRelationKey,
  typeof ADDRESSES_ONE_RELATION_QUERY_OPTIONS,
  typeof ADDRESSES_MANY_RELATION_QUERY_OPTIONS
>;
