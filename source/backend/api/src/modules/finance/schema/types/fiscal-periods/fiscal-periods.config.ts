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
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFiscalPeriods,
  FiscalPeriodsKey,
  FiscalPeriodsRelationKey,
  FiscalPeriodsSortableField,
  FiscalPeriodsFilterableField,
  FiscalPeriodsDateRangeField,
  FiscalPeriodsSelectableField,
  IFiscalPeriodsAsOneRelationConfig,
  IFiscalPeriodsAsManyRelationConfig,
} from "./fiscal-periods.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FISCAL_PERIODS_RELATION_KEYS = [
  "country",
  "periodKind",
  "sourceCitation",
] as const satisfies readonly FiscalPeriodsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FISCAL_PERIODS_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "periodKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly FiscalPeriodsKey[];

export const FISCAL_PERIODS_SEARCHABLE_FIELDS = [
  "code",
] as const satisfies readonly FiscalPeriodsKey[];

export const FISCAL_PERIODS_FILTERABLE_FIELDS = [
  "countryId",
  "id",
  "periodKindId",
  "sourceCitationId",
] as const satisfies readonly FiscalPeriodsKey[];

export const FISCAL_PERIODS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "startsOn",
  "updatedAt",
] as const satisfies readonly FiscalPeriodsKey[];

export const FISCAL_PERIODS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFiscalPeriods> = {
  searchableFields: [...FISCAL_PERIODS_SEARCHABLE_FIELDS],
  filterFields: [...FISCAL_PERIODS_FILTERABLE_FIELDS],
  dateRangeFields: [...FISCAL_PERIODS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FISCAL_PERIODS_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "periodKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly FiscalPeriodsKey[];

export const FISCAL_PERIODS_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "endsOn",
  "id",
  "periodKindId",
  "sourceCitationId",
  "startsOn",
  "updatedAt",
  "version",
] as const satisfies readonly FiscalPeriodsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FISCAL_PERIODS_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "endsOn",
  "periodKindId",
  "sourceCitationId",
  "startsOn",
] as const satisfies readonly FiscalPeriodsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FISCAL_PERIODS_AS_ONE_RELATION_CONFIG = {
  relation: "fiscalPeriods",
  type: ERelationType.One,
  selectableFields: FISCAL_PERIODS_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_PERIODS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFiscalPeriodsAsOneRelationConfig;

export const FISCAL_PERIODS_AS_MANY_RELATION_CONFIG = {
  relation: "fiscalPeriods",
  type: ERelationType.Many,
  selectableFields: FISCAL_PERIODS_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_PERIODS_DEFAULT_SELECT_FIELDS,
  sortableFields: FISCAL_PERIODS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFiscalPeriodsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FISCAL_PERIODS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FiscalPeriodsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<FiscalPeriodsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "periodKind",
  ),
  Q.createRelationKeyMapper<FiscalPeriodsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const FISCAL_PERIODS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FISCAL_PERIODS_QUERY_OPTIONS = {
  searchableFields: FISCAL_PERIODS_SEARCHABLE_FIELDS,
  selectableFields: FISCAL_PERIODS_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_PERIODS_DEFAULT_SELECT_FIELDS,
  sortableFields: FISCAL_PERIODS_SORTABLE_FIELDS,
  filterFields: FISCAL_PERIODS_FILTERABLE_FIELDS,
  dateRangeFields: FISCAL_PERIODS_DATE_RANGE_FIELDS,
  relationKeys: FISCAL_PERIODS_RELATION_KEYS,
  editableFields: FISCAL_PERIODS_EDITABLE_FIELDS,
  asOne: FISCAL_PERIODS_AS_ONE_RELATION_CONFIG,
  asMany: FISCAL_PERIODS_AS_MANY_RELATION_CONFIG,
  oneRelations: FISCAL_PERIODS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FISCAL_PERIODS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFiscalPeriods,
  FiscalPeriodsSortableField,
  FiscalPeriodsSelectableField,
  FiscalPeriodsFilterableField,
  FiscalPeriodsDateRangeField,
  FiscalPeriodsRelationKey,
  typeof FISCAL_PERIODS_ONE_RELATION_QUERY_OPTIONS,
  typeof FISCAL_PERIODS_MANY_RELATION_QUERY_OPTIONS
>;
