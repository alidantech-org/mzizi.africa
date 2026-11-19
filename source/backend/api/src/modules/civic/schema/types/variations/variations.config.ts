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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IVariations,
  VariationsKey,
  VariationsRelationKey,
  VariationsSortableField,
  VariationsFilterableField,
  VariationsDateRangeField,
  VariationsSelectableField,
  IVariationsAsOneRelationConfig,
  IVariationsAsManyRelationConfig,
} from "./variations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VARIATIONS_RELATION_KEYS = [
  "contract",
  "currency",
  "kind",
  "sourceCitation",
] as const satisfies readonly VariationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VARIATIONS_SORTABLE_FIELDS = [
  "amountDeltaMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "kindId",
  "newEndOn",
  "reason",
  "signedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VariationsKey[];

export const VARIATIONS_SEARCHABLE_FIELDS = [
  "code",
  "reason",
] as const satisfies readonly VariationsKey[];

export const VARIATIONS_FILTERABLE_FIELDS = [
  "contractId",
  "currencyId",
  "id",
  "kindId",
  "sourceCitationId",
] as const satisfies readonly VariationsKey[];

export const VARIATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "newEndOn",
  "signedOn",
  "updatedAt",
] as const satisfies readonly VariationsKey[];

export const VARIATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IVariations> = {
  searchableFields: [...VARIATIONS_SEARCHABLE_FIELDS],
  filterFields: [...VARIATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...VARIATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VARIATIONS_SELECTABLE_FIELDS = [
  "amountDeltaMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "kindId",
  "newEndOn",
  "reason",
  "signedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VariationsKey[];

export const VARIATIONS_DEFAULT_SELECT_FIELDS = [
  "amountDeltaMinorUnits",
  "code",
  "contractId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "kindId",
  "newEndOn",
  "reason",
  "signedOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VariationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VARIATIONS_EDITABLE_FIELDS = [
  "amountDeltaMinorUnits",
  "code",
  "contractId",
  "currencyId",
  "kindId",
  "newEndOn",
  "reason",
  "signedOn",
  "sourceCitationId",
] as const satisfies readonly VariationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VARIATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "variations",
  type: ERelationType.One,
  selectableFields: VARIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VARIATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IVariationsAsOneRelationConfig;

export const VARIATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "variations",
  type: ERelationType.Many,
  selectableFields: VARIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VARIATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: VARIATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IVariationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VARIATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<VariationsRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<VariationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<VariationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<VariationsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const VARIATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VARIATIONS_QUERY_OPTIONS = {
  searchableFields: VARIATIONS_SEARCHABLE_FIELDS,
  selectableFields: VARIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VARIATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: VARIATIONS_SORTABLE_FIELDS,
  filterFields: VARIATIONS_FILTERABLE_FIELDS,
  dateRangeFields: VARIATIONS_DATE_RANGE_FIELDS,
  relationKeys: VARIATIONS_RELATION_KEYS,
  editableFields: VARIATIONS_EDITABLE_FIELDS,
  asOne: VARIATIONS_AS_ONE_RELATION_CONFIG,
  asMany: VARIATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: VARIATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VARIATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IVariations,
  VariationsSortableField,
  VariationsSelectableField,
  VariationsFilterableField,
  VariationsDateRangeField,
  VariationsRelationKey,
  typeof VARIATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof VARIATIONS_MANY_RELATION_QUERY_OPTIONS
>;
