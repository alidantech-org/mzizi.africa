// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProcedures,
  ProceduresKey,
  ProceduresRelationKey,
  ProceduresSortableField,
  ProceduresFilterableField,
  ProceduresDateRangeField,
  ProceduresSelectableField,
  IProceduresAsOneRelationConfig,
  IProceduresAsManyRelationConfig,
} from "./procedures.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROCEDURES_RELATION_KEYS = [
  "basisProvision",
  "country",
  "kind",
  "sourceCitation",
] as const satisfies readonly ProceduresKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROCEDURES_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ProceduresKey[];

export const PROCEDURES_SEARCHABLE_FIELDS = [
  "code",
  "description",
] as const satisfies readonly ProceduresKey[];

export const PROCEDURES_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "countryId",
  "fromToPrecision",
  "id",
  "kindId",
  "sourceCitationId",
] as const satisfies readonly ProceduresKey[];

export const PROCEDURES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ProceduresKey[];

export const PROCEDURES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProcedures> = {
  searchableFields: [...PROCEDURES_SEARCHABLE_FIELDS],
  filterFields: [...PROCEDURES_FILTERABLE_FIELDS],
  dateRangeFields: [...PROCEDURES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROCEDURES_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ProceduresKey[];

export const PROCEDURES_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly ProceduresSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROCEDURES_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "description",
  "fromToPrecision",
  "fromYear",
  "kindId",
  "sourceCitationId",
  "toYear",
] as const satisfies readonly ProceduresKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROCEDURES_AS_ONE_RELATION_CONFIG = {
  relation: "procedures",
  type: ERelationType.One,
  selectableFields: PROCEDURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROCEDURES_DEFAULT_SELECT_FIELDS,
} as const satisfies IProceduresAsOneRelationConfig;

export const PROCEDURES_AS_MANY_RELATION_CONFIG = {
  relation: "procedures",
  type: ERelationType.Many,
  selectableFields: PROCEDURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROCEDURES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCEDURES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProceduresAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROCEDURES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProceduresRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<ProceduresRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<ProceduresRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<ProceduresRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const PROCEDURES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROCEDURES_QUERY_OPTIONS = {
  searchableFields: PROCEDURES_SEARCHABLE_FIELDS,
  selectableFields: PROCEDURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROCEDURES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCEDURES_SORTABLE_FIELDS,
  filterFields: PROCEDURES_FILTERABLE_FIELDS,
  dateRangeFields: PROCEDURES_DATE_RANGE_FIELDS,
  relationKeys: PROCEDURES_RELATION_KEYS,
  editableFields: PROCEDURES_EDITABLE_FIELDS,
  asOne: PROCEDURES_AS_ONE_RELATION_CONFIG,
  asMany: PROCEDURES_AS_MANY_RELATION_CONFIG,
  oneRelations: PROCEDURES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROCEDURES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProcedures,
  ProceduresSortableField,
  ProceduresSelectableField,
  ProceduresFilterableField,
  ProceduresDateRangeField,
  ProceduresRelationKey,
  typeof PROCEDURES_ONE_RELATION_QUERY_OPTIONS,
  typeof PROCEDURES_MANY_RELATION_QUERY_OPTIONS
>;
