// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDeliveries,
  DeliveriesKey,
  DeliveriesRelationKey,
  DeliveriesSortableField,
  DeliveriesFilterableField,
  DeliveriesDateRangeField,
  DeliveriesSelectableField,
  IDeliveriesAsOneRelationConfig,
  IDeliveriesAsManyRelationConfig,
} from "./deliveries.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DELIVERIES_RELATION_KEYS = [
  "contract",
  "currency",
  "deliveryKind",
  "sourceCitation",
  "unitFeature",
] as const satisfies readonly DeliveriesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DELIVERIES_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "deliveredOn",
  "deliveryKindId",
  "id",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly DeliveriesKey[];

export const DELIVERIES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly DeliveriesKey[];

export const DELIVERIES_FILTERABLE_FIELDS = [
  "contractId",
  "currencyId",
  "deliveryKindId",
  "id",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly DeliveriesKey[];

export const DELIVERIES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "deliveredOn",
  "updatedAt",
] as const satisfies readonly DeliveriesKey[];

export const DELIVERIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDeliveries> = {
  searchableFields: [...DELIVERIES_SEARCHABLE_FIELDS],
  filterFields: [...DELIVERIES_FILTERABLE_FIELDS],
  dateRangeFields: [...DELIVERIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DELIVERIES_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "deliveredOn",
  "deliveryKindId",
  "id",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly DeliveriesKey[];

export const DELIVERIES_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "deliveredOn",
  "deliveryKindId",
  "id",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly DeliveriesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DELIVERIES_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractId",
  "currencyId",
  "deliveredOn",
  "deliveryKindId",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly DeliveriesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DELIVERIES_AS_ONE_RELATION_CONFIG = {
  relation: "deliveries",
  type: ERelationType.One,
  selectableFields: DELIVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DELIVERIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IDeliveriesAsOneRelationConfig;

export const DELIVERIES_AS_MANY_RELATION_CONFIG = {
  relation: "deliveries",
  type: ERelationType.Many,
  selectableFields: DELIVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DELIVERIES_DEFAULT_SELECT_FIELDS,
  sortableFields: DELIVERIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDeliveriesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DELIVERIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DeliveriesRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<DeliveriesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<DeliveriesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "deliveryKind",
  ),
  Q.createRelationKeyMapper<DeliveriesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<DeliveriesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
] as const;

export const DELIVERIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DELIVERIES_QUERY_OPTIONS = {
  searchableFields: DELIVERIES_SEARCHABLE_FIELDS,
  selectableFields: DELIVERIES_SELECTABLE_FIELDS,
  defaultSelectFields: DELIVERIES_DEFAULT_SELECT_FIELDS,
  sortableFields: DELIVERIES_SORTABLE_FIELDS,
  filterFields: DELIVERIES_FILTERABLE_FIELDS,
  dateRangeFields: DELIVERIES_DATE_RANGE_FIELDS,
  relationKeys: DELIVERIES_RELATION_KEYS,
  editableFields: DELIVERIES_EDITABLE_FIELDS,
  asOne: DELIVERIES_AS_ONE_RELATION_CONFIG,
  asMany: DELIVERIES_AS_MANY_RELATION_CONFIG,
  oneRelations: DELIVERIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DELIVERIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDeliveries,
  DeliveriesSortableField,
  DeliveriesSelectableField,
  DeliveriesFilterableField,
  DeliveriesDateRangeField,
  DeliveriesRelationKey,
  typeof DELIVERIES_ONE_RELATION_QUERY_OPTIONS,
  typeof DELIVERIES_MANY_RELATION_QUERY_OPTIONS
>;
