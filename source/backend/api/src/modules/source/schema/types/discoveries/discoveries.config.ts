// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AddressesConfig from "#/modules/source/schema/types/addresses/addresses.config";
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDiscoveries,
  DiscoveriesKey,
  DiscoveriesRelationKey,
  DiscoveriesSortableField,
  DiscoveriesFilterableField,
  DiscoveriesDateRangeField,
  DiscoveriesSelectableField,
  IDiscoveriesAsOneRelationConfig,
  IDiscoveriesAsManyRelationConfig,
} from "./discoveries.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DISCOVERIES_RELATION_KEYS = [
  "address",
  "foundOnAddress",
  "source",
] as const satisfies readonly DiscoveriesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DISCOVERIES_SORTABLE_FIELDS = [
  "addressId",
  "anchorText",
  "context",
  "createdAt",
  "deletedAt",
  "discoveredAt",
  "foundOnAddressId",
  "id",
  "observedUrl",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly DiscoveriesKey[];

export const DISCOVERIES_SEARCHABLE_FIELDS = [
  "anchorText",
  "context",
] as const satisfies readonly DiscoveriesKey[];

export const DISCOVERIES_FILTERABLE_FIELDS = [
  "addressId",
  "foundOnAddressId",
  "id",
  "sourceId",
] as const satisfies readonly DiscoveriesKey[];

export const DISCOVERIES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "discoveredAt",
  "updatedAt",
] as const satisfies readonly DiscoveriesKey[];

export const DISCOVERIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDiscoveries> = {
  searchableFields: [...DISCOVERIES_SEARCHABLE_FIELDS],
  filterFields: [...DISCOVERIES_FILTERABLE_FIELDS],
  dateRangeFields: [...DISCOVERIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DISCOVERIES_SELECTABLE_FIELDS = [
  "addressId",
  "anchorText",
  "context",
  "createdAt",
  "deletedAt",
  "discoveredAt",
  "foundOnAddressId",
  "id",
  "observedUrl",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly DiscoveriesKey[];

export const DISCOVERIES_DEFAULT_SELECT_FIELDS = [
  "addressId",
  "anchorText",
  "context",
  "createdAt",
  "deletedAt",
  "discoveredAt",
  "foundOnAddressId",
  "id",
  "observedUrl",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly DiscoveriesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DISCOVERIES_EDITABLE_FIELDS = [
  "addressId",
  "anchorText",
  "context",
  "discoveredAt",
  "foundOnAddressId",
  "observedUrl",
  "sourceId",
] as const satisfies readonly DiscoveriesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DISCOVERIES_AS_ONE_RELATION_CONFIG = {
  relation: "discoveries",
  type: ERelationType.One,
  selectableFields: DISCOVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DISCOVERIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IDiscoveriesAsOneRelationConfig;

export const DISCOVERIES_AS_MANY_RELATION_CONFIG = {
  relation: "discoveries",
  type: ERelationType.Many,
  selectableFields: DISCOVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DISCOVERIES_DEFAULT_SELECT_FIELDS,
  sortableFields: DISCOVERIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDiscoveriesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DISCOVERIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DiscoveriesRelationKey>().one(
    () => AddressesConfig.ADDRESSES_AS_ONE_RELATION_CONFIG,
    "address",
  ),
  Q.createRelationKeyMapper<DiscoveriesRelationKey>().one(
    () => AddressesConfig.ADDRESSES_AS_ONE_RELATION_CONFIG,
    "foundOnAddress",
  ),
  Q.createRelationKeyMapper<DiscoveriesRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
] as const;

export const DISCOVERIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DISCOVERIES_QUERY_OPTIONS = {
  searchableFields: DISCOVERIES_SEARCHABLE_FIELDS,
  selectableFields: DISCOVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DISCOVERIES_DEFAULT_SELECT_FIELDS,
  sortableFields: DISCOVERIES_SORTABLE_FIELDS,
  filterFields: DISCOVERIES_FILTERABLE_FIELDS,
  dateRangeFields: DISCOVERIES_DATE_RANGE_FIELDS,
  relationKeys: DISCOVERIES_RELATION_KEYS,
  editableFields: DISCOVERIES_EDITABLE_FIELDS,
  asOne: DISCOVERIES_AS_ONE_RELATION_CONFIG,
  asMany: DISCOVERIES_AS_MANY_RELATION_CONFIG,
  oneRelations: DISCOVERIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DISCOVERIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDiscoveries,
  DiscoveriesSortableField,
  DiscoveriesSelectableField,
  DiscoveriesFilterableField,
  DiscoveriesDateRangeField,
  DiscoveriesRelationKey,
  typeof DISCOVERIES_ONE_RELATION_QUERY_OPTIONS,
  typeof DISCOVERIES_MANY_RELATION_QUERY_OPTIONS
>;
