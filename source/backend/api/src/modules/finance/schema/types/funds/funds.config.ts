// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFunds,
  FundsKey,
  FundsRelationKey,
  FundsSortableField,
  FundsFilterableField,
  FundsDateRangeField,
  FundsSelectableField,
  IFundsAsOneRelationConfig,
  IFundsAsManyRelationConfig,
} from "./funds.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FUNDS_RELATION_KEYS = [
  "country",
  "fundKind",
  "fundingSource",
  "managingEntity",
  "scopeUnitFeature",
  "sourceCitation",
] as const satisfies readonly FundsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FUNDS_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fundKindId",
  "fundingSourceId",
  "id",
  "managingEntityId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FundsKey[];

export const FUNDS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly FundsKey[];

export const FUNDS_FILTERABLE_FIELDS = [
  "countryId",
  "fundKindId",
  "fundingSourceId",
  "id",
  "managingEntityId",
  "scopeUnitFeatureId",
  "sourceCitationId",
] as const satisfies readonly FundsKey[];

export const FUNDS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly FundsKey[];

export const FUNDS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFunds> = {
  searchableFields: [...FUNDS_SEARCHABLE_FIELDS],
  filterFields: [...FUNDS_FILTERABLE_FIELDS],
  dateRangeFields: [...FUNDS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FUNDS_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fundKindId",
  "fundingSourceId",
  "id",
  "managingEntityId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FundsKey[];

export const FUNDS_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fundKindId",
  "fundingSourceId",
  "id",
  "managingEntityId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FundsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FUNDS_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "fundKindId",
  "fundingSourceId",
  "managingEntityId",
  "scopeUnitFeatureId",
  "sourceCitationId",
] as const satisfies readonly FundsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FUNDS_AS_ONE_RELATION_CONFIG = {
  relation: "funds",
  type: ERelationType.One,
  selectableFields: FUNDS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNDS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFundsAsOneRelationConfig;

export const FUNDS_AS_MANY_RELATION_CONFIG = {
  relation: "funds",
  type: ERelationType.Many,
  selectableFields: FUNDS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNDS_DEFAULT_SELECT_FIELDS,
  sortableFields: FUNDS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFundsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FUNDS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "fundKind",
  ),
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "fundingSource",
  ),
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "managingEntity",
  ),
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeUnitFeature",
  ),
  Q.createRelationKeyMapper<FundsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const FUNDS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FUNDS_QUERY_OPTIONS = {
  searchableFields: FUNDS_SEARCHABLE_FIELDS,
  selectableFields: FUNDS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNDS_DEFAULT_SELECT_FIELDS,
  sortableFields: FUNDS_SORTABLE_FIELDS,
  filterFields: FUNDS_FILTERABLE_FIELDS,
  dateRangeFields: FUNDS_DATE_RANGE_FIELDS,
  relationKeys: FUNDS_RELATION_KEYS,
  editableFields: FUNDS_EDITABLE_FIELDS,
  asOne: FUNDS_AS_ONE_RELATION_CONFIG,
  asMany: FUNDS_AS_MANY_RELATION_CONFIG,
  oneRelations: FUNDS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FUNDS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFunds,
  FundsSortableField,
  FundsSelectableField,
  FundsFilterableField,
  FundsDateRangeField,
  FundsRelationKey,
  typeof FUNDS_ONE_RELATION_QUERY_OPTIONS,
  typeof FUNDS_MANY_RELATION_QUERY_OPTIONS
>;
