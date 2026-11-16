// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEntities,
  EntitiesKey,
  EntitiesRelationKey,
  EntitiesSortableField,
  EntitiesFilterableField,
  EntitiesDateRangeField,
  EntitiesSelectableField,
  IEntitiesAsOneRelationConfig,
  IEntitiesAsManyRelationConfig,
} from "./entities.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ENTITIES_RELATION_KEYS = [
  "kind",
  "registrationCountry",
  "sourceCitation",
] as const satisfies readonly EntitiesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ENTITIES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dissolvedOn",
  "id",
  "kindId",
  "registeredOn",
  "registrationCountryId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EntitiesKey[];

export const ENTITIES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly EntitiesKey[];

export const ENTITIES_FILTERABLE_FIELDS = [
  "id",
  "kindId",
  "registrationCountryId",
  "sourceCitationId",
] as const satisfies readonly EntitiesKey[];

export const ENTITIES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "dissolvedOn",
  "registeredOn",
  "updatedAt",
] as const satisfies readonly EntitiesKey[];

export const ENTITIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IEntities> = {
  searchableFields: [...ENTITIES_SEARCHABLE_FIELDS],
  filterFields: [...ENTITIES_FILTERABLE_FIELDS],
  dateRangeFields: [...ENTITIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ENTITIES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dissolvedOn",
  "id",
  "kindId",
  "registeredOn",
  "registrationCountryId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EntitiesKey[];

export const ENTITIES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "dissolvedOn",
  "id",
  "kindId",
  "registeredOn",
  "registrationCountryId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EntitiesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ENTITIES_EDITABLE_FIELDS = [
  "code",
  "dissolvedOn",
  "kindId",
  "registeredOn",
  "registrationCountryId",
  "sourceCitationId",
] as const satisfies readonly EntitiesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ENTITIES_AS_ONE_RELATION_CONFIG = {
  relation: "entities",
  type: ERelationType.One,
  selectableFields: ENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IEntitiesAsOneRelationConfig;

export const ENTITIES_AS_MANY_RELATION_CONFIG = {
  relation: "entities",
  type: ERelationType.Many,
  selectableFields: ENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IEntitiesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ENTITIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EntitiesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<EntitiesRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "registrationCountry",
  ),
  Q.createRelationKeyMapper<EntitiesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const ENTITIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ENTITIES_QUERY_OPTIONS = {
  searchableFields: ENTITIES_SEARCHABLE_FIELDS,
  selectableFields: ENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITIES_SORTABLE_FIELDS,
  filterFields: ENTITIES_FILTERABLE_FIELDS,
  dateRangeFields: ENTITIES_DATE_RANGE_FIELDS,
  relationKeys: ENTITIES_RELATION_KEYS,
  editableFields: ENTITIES_EDITABLE_FIELDS,
  asOne: ENTITIES_AS_ONE_RELATION_CONFIG,
  asMany: ENTITIES_AS_MANY_RELATION_CONFIG,
  oneRelations: ENTITIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ENTITIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IEntities,
  EntitiesSortableField,
  EntitiesSelectableField,
  EntitiesFilterableField,
  EntitiesDateRangeField,
  EntitiesRelationKey,
  typeof ENTITIES_ONE_RELATION_QUERY_OPTIONS,
  typeof ENTITIES_MANY_RELATION_QUERY_OPTIONS
>;
