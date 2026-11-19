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
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as TopicConfig from "#/modules/reference/schema/types/topic/topic.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFunctions,
  FunctionsKey,
  FunctionsRelationKey,
  FunctionsSortableField,
  FunctionsFilterableField,
  FunctionsDateRangeField,
  FunctionsSelectableField,
  IFunctionsAsOneRelationConfig,
  IFunctionsAsManyRelationConfig,
} from "./functions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FUNCTIONS_RELATION_KEYS = [
  "basisProvision",
  "country",
  "parentFunction",
  "sourceCitation",
  "topic",
] as const satisfies readonly FunctionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FUNCTIONS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "parentFunctionId",
  "sourceCitationId",
  "toYear",
  "topicId",
  "updatedAt",
  "version",
] as const satisfies readonly FunctionsKey[];

export const FUNCTIONS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly FunctionsKey[];

export const FUNCTIONS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "countryId",
  "fromToPrecision",
  "id",
  "parentFunctionId",
  "sourceCitationId",
  "topicId",
] as const satisfies readonly FunctionsKey[];

export const FUNCTIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly FunctionsKey[];

export const FUNCTIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFunctions> = {
  searchableFields: [...FUNCTIONS_SEARCHABLE_FIELDS],
  filterFields: [...FUNCTIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...FUNCTIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FUNCTIONS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "parentFunctionId",
  "sourceCitationId",
  "toYear",
  "topicId",
  "updatedAt",
  "version",
] as const satisfies readonly FunctionsKey[];

export const FUNCTIONS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "parentFunctionId",
  "sourceCitationId",
  "toYear",
  "topicId",
  "updatedAt",
  "version",
] as const satisfies readonly FunctionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FUNCTIONS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "countryId",
  "fromToPrecision",
  "fromYear",
  "parentFunctionId",
  "sourceCitationId",
  "toYear",
  "topicId",
] as const satisfies readonly FunctionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FUNCTIONS_AS_ONE_RELATION_CONFIG = {
  relation: "functions",
  type: ERelationType.One,
  selectableFields: FUNCTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNCTIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFunctionsAsOneRelationConfig;

export const FUNCTIONS_AS_MANY_RELATION_CONFIG = {
  relation: "functions",
  type: ERelationType.Many,
  selectableFields: FUNCTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNCTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FUNCTIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFunctionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FUNCTIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FunctionsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<FunctionsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<FunctionsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<FunctionsRelationKey>().one(
    () => TopicConfig.TOPIC_AS_ONE_RELATION_CONFIG,
    "topic",
  ),
] as const;

export const FUNCTIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FUNCTIONS_QUERY_OPTIONS = {
  searchableFields: FUNCTIONS_SEARCHABLE_FIELDS,
  selectableFields: FUNCTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FUNCTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FUNCTIONS_SORTABLE_FIELDS,
  filterFields: FUNCTIONS_FILTERABLE_FIELDS,
  dateRangeFields: FUNCTIONS_DATE_RANGE_FIELDS,
  relationKeys: FUNCTIONS_RELATION_KEYS,
  editableFields: FUNCTIONS_EDITABLE_FIELDS,
  asOne: FUNCTIONS_AS_ONE_RELATION_CONFIG,
  asMany: FUNCTIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: FUNCTIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FUNCTIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFunctions,
  FunctionsSortableField,
  FunctionsSelectableField,
  FunctionsFilterableField,
  FunctionsDateRangeField,
  FunctionsRelationKey,
  typeof FUNCTIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof FUNCTIONS_MANY_RELATION_QUERY_OPTIONS
>;
