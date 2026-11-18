// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDebts,
  DebtsKey,
  DebtsRelationKey,
  DebtsSortableField,
  DebtsFilterableField,
  DebtsDateRangeField,
  DebtsSelectableField,
  IDebtsAsOneRelationConfig,
  IDebtsAsManyRelationConfig,
} from "./debts.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DEBTS_RELATION_KEYS = [
  "borrowerEntity",
  "country",
  "currency",
  "debtKind",
  "lenderEntity",
  "sourceCitation",
] as const satisfies readonly DebtsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DEBTS_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "borrowerEntityId",
  "code",
  "contractedOn",
  "countryId",
  "createdAt",
  "currencyId",
  "debtKindId",
  "deletedAt",
  "id",
  "lenderEntityId",
  "maturityOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly DebtsKey[];

export const DEBTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly DebtsKey[];

export const DEBTS_FILTERABLE_FIELDS = [
  "borrowerEntityId",
  "countryId",
  "currencyId",
  "debtKindId",
  "id",
  "lenderEntityId",
  "sourceCitationId",
] as const satisfies readonly DebtsKey[];

export const DEBTS_DATE_RANGE_FIELDS = [
  "contractedOn",
  "createdAt",
  "deletedAt",
  "maturityOn",
  "updatedAt",
] as const satisfies readonly DebtsKey[];

export const DEBTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDebts> = {
  searchableFields: [...DEBTS_SEARCHABLE_FIELDS],
  filterFields: [...DEBTS_FILTERABLE_FIELDS],
  dateRangeFields: [...DEBTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DEBTS_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "borrowerEntityId",
  "code",
  "contractedOn",
  "countryId",
  "createdAt",
  "currencyId",
  "debtKindId",
  "deletedAt",
  "id",
  "lenderEntityId",
  "maturityOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly DebtsKey[];

export const DEBTS_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "borrowerEntityId",
  "code",
  "contractedOn",
  "countryId",
  "createdAt",
  "currencyId",
  "debtKindId",
  "deletedAt",
  "id",
  "lenderEntityId",
  "maturityOn",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly DebtsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DEBTS_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "borrowerEntityId",
  "code",
  "contractedOn",
  "countryId",
  "currencyId",
  "debtKindId",
  "lenderEntityId",
  "maturityOn",
  "sourceCitationId",
] as const satisfies readonly DebtsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DEBTS_AS_ONE_RELATION_CONFIG = {
  relation: "debts",
  type: ERelationType.One,
  selectableFields: DEBTS_SELECTABLE_FIELDS,
  defaultSelectFields: DEBTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IDebtsAsOneRelationConfig;

export const DEBTS_AS_MANY_RELATION_CONFIG = {
  relation: "debts",
  type: ERelationType.Many,
  selectableFields: DEBTS_SELECTABLE_FIELDS,
  defaultSelectFields: DEBTS_DEFAULT_SELECT_FIELDS,
  sortableFields: DEBTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDebtsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DEBTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "borrowerEntity",
  ),
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "debtKind",
  ),
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "lenderEntity",
  ),
  Q.createRelationKeyMapper<DebtsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const DEBTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DEBTS_QUERY_OPTIONS = {
  searchableFields: DEBTS_SEARCHABLE_FIELDS,
  selectableFields: DEBTS_SELECTABLE_FIELDS,
  defaultSelectFields: DEBTS_DEFAULT_SELECT_FIELDS,
  sortableFields: DEBTS_SORTABLE_FIELDS,
  filterFields: DEBTS_FILTERABLE_FIELDS,
  dateRangeFields: DEBTS_DATE_RANGE_FIELDS,
  relationKeys: DEBTS_RELATION_KEYS,
  editableFields: DEBTS_EDITABLE_FIELDS,
  asOne: DEBTS_AS_ONE_RELATION_CONFIG,
  asMany: DEBTS_AS_MANY_RELATION_CONFIG,
  oneRelations: DEBTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DEBTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDebts,
  DebtsSortableField,
  DebtsSelectableField,
  DebtsFilterableField,
  DebtsDateRangeField,
  DebtsRelationKey,
  typeof DEBTS_ONE_RELATION_QUERY_OPTIONS,
  typeof DEBTS_MANY_RELATION_QUERY_OPTIONS
>;
