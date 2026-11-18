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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProcurements,
  ProcurementsKey,
  ProcurementsRelationKey,
  ProcurementsSortableField,
  ProcurementsFilterableField,
  ProcurementsDateRangeField,
  ProcurementsSelectableField,
  IProcurementsAsOneRelationConfig,
  IProcurementsAsManyRelationConfig,
} from "./procurements.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROCUREMENTS_RELATION_KEYS = [
  "buyerEntity",
  "category",
  "country",
  "nature",
  "procedureKind",
  "project",
  "sourceCitation",
  "status",
] as const satisfies readonly ProcurementsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROCUREMENTS_SORTABLE_FIELDS = [
  "awardedOn",
  "buyerEntityId",
  "categoryId",
  "closesOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "natureId",
  "procedureKindId",
  "projectId",
  "publishedOn",
  "reference",
  "sourceCitationId",
  "statusId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProcurementsKey[];

export const PROCUREMENTS_SEARCHABLE_FIELDS = [
  "code",
  "reference",
  "title",
] as const satisfies readonly ProcurementsKey[];

export const PROCUREMENTS_FILTERABLE_FIELDS = [
  "buyerEntityId",
  "categoryId",
  "countryId",
  "id",
  "natureId",
  "procedureKindId",
  "projectId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly ProcurementsKey[];

export const PROCUREMENTS_DATE_RANGE_FIELDS = [
  "awardedOn",
  "closesOn",
  "createdAt",
  "deletedAt",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly ProcurementsKey[];

export const PROCUREMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProcurements> = {
  searchableFields: [...PROCUREMENTS_SEARCHABLE_FIELDS],
  filterFields: [...PROCUREMENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...PROCUREMENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROCUREMENTS_SELECTABLE_FIELDS = [
  "awardedOn",
  "buyerEntityId",
  "categoryId",
  "closesOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "natureId",
  "procedureKindId",
  "projectId",
  "publishedOn",
  "reference",
  "sourceCitationId",
  "statusId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProcurementsKey[];

export const PROCUREMENTS_DEFAULT_SELECT_FIELDS = [
  "awardedOn",
  "buyerEntityId",
  "categoryId",
  "closesOn",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "natureId",
  "procedureKindId",
  "projectId",
  "publishedOn",
  "reference",
  "sourceCitationId",
  "statusId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProcurementsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROCUREMENTS_EDITABLE_FIELDS = [
  "awardedOn",
  "buyerEntityId",
  "categoryId",
  "closesOn",
  "code",
  "countryId",
  "natureId",
  "procedureKindId",
  "projectId",
  "publishedOn",
  "reference",
  "sourceCitationId",
  "statusId",
  "title",
] as const satisfies readonly ProcurementsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROCUREMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "procurements",
  type: ERelationType.One,
  selectableFields: PROCUREMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IProcurementsAsOneRelationConfig;

export const PROCUREMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "procurements",
  type: ERelationType.Many,
  selectableFields: PROCUREMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCUREMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProcurementsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROCUREMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "buyerEntity",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "category",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "nature",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "procedureKind",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<ProcurementsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const PROCUREMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROCUREMENTS_QUERY_OPTIONS = {
  searchableFields: PROCUREMENTS_SEARCHABLE_FIELDS,
  selectableFields: PROCUREMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCUREMENTS_SORTABLE_FIELDS,
  filterFields: PROCUREMENTS_FILTERABLE_FIELDS,
  dateRangeFields: PROCUREMENTS_DATE_RANGE_FIELDS,
  relationKeys: PROCUREMENTS_RELATION_KEYS,
  editableFields: PROCUREMENTS_EDITABLE_FIELDS,
  asOne: PROCUREMENTS_AS_ONE_RELATION_CONFIG,
  asMany: PROCUREMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: PROCUREMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROCUREMENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProcurements,
  ProcurementsSortableField,
  ProcurementsSelectableField,
  ProcurementsFilterableField,
  ProcurementsDateRangeField,
  ProcurementsRelationKey,
  typeof PROCUREMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof PROCUREMENTS_MANY_RELATION_QUERY_OPTIONS
>;
