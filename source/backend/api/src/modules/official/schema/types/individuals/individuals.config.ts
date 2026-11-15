// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIndividuals,
  IndividualsKey,
  IndividualsRelationKey,
  IndividualsSortableField,
  IndividualsFilterableField,
  IndividualsDateRangeField,
  IndividualsSelectableField,
  IIndividualsAsOneRelationConfig,
  IIndividualsAsManyRelationConfig,
} from "./individuals.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INDIVIDUALS_RELATION_KEYS = [
  "sourceCitation",
] as const satisfies readonly IndividualsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INDIVIDUALS_SORTABLE_FIELDS = [
  "birthDate",
  "code",
  "createdAt",
  "deathDate",
  "deletedAt",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly IndividualsKey[];

export const INDIVIDUALS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly IndividualsKey[];

export const INDIVIDUALS_FILTERABLE_FIELDS = [
  "id",
  "sourceCitationId",
] as const satisfies readonly IndividualsKey[];

export const INDIVIDUALS_DATE_RANGE_FIELDS = [
  "birthDate",
  "createdAt",
  "deathDate",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly IndividualsKey[];

export const INDIVIDUALS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IIndividuals> = {
  searchableFields: [...INDIVIDUALS_SEARCHABLE_FIELDS],
  filterFields: [...INDIVIDUALS_FILTERABLE_FIELDS],
  dateRangeFields: [...INDIVIDUALS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INDIVIDUALS_SELECTABLE_FIELDS = [
  "birthDate",
  "code",
  "createdAt",
  "deathDate",
  "deletedAt",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly IndividualsKey[];

export const INDIVIDUALS_DEFAULT_SELECT_FIELDS = [
  "birthDate",
  "code",
  "createdAt",
  "deathDate",
  "deletedAt",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly IndividualsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INDIVIDUALS_EDITABLE_FIELDS = [
  "birthDate",
  "code",
  "deathDate",
  "sourceCitationId",
] as const satisfies readonly IndividualsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INDIVIDUALS_AS_ONE_RELATION_CONFIG = {
  relation: "individuals",
  type: ERelationType.One,
  selectableFields: INDIVIDUALS_SELECTABLE_FIELDS,
  defaultSelectFields: INDIVIDUALS_DEFAULT_SELECT_FIELDS,
} as const satisfies IIndividualsAsOneRelationConfig;

export const INDIVIDUALS_AS_MANY_RELATION_CONFIG = {
  relation: "individuals",
  type: ERelationType.Many,
  selectableFields: INDIVIDUALS_SELECTABLE_FIELDS,
  defaultSelectFields: INDIVIDUALS_DEFAULT_SELECT_FIELDS,
  sortableFields: INDIVIDUALS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IIndividualsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INDIVIDUALS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IndividualsRelationKey>().one(
    CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const INDIVIDUALS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INDIVIDUALS_QUERY_OPTIONS = {
  searchableFields: INDIVIDUALS_SEARCHABLE_FIELDS,
  selectableFields: INDIVIDUALS_SELECTABLE_FIELDS,
  defaultSelectFields: INDIVIDUALS_DEFAULT_SELECT_FIELDS,
  sortableFields: INDIVIDUALS_SORTABLE_FIELDS,
  filterFields: INDIVIDUALS_FILTERABLE_FIELDS,
  dateRangeFields: INDIVIDUALS_DATE_RANGE_FIELDS,
  relationKeys: INDIVIDUALS_RELATION_KEYS,
  editableFields: INDIVIDUALS_EDITABLE_FIELDS,
  asOne: INDIVIDUALS_AS_ONE_RELATION_CONFIG,
  asMany: INDIVIDUALS_AS_MANY_RELATION_CONFIG,
  oneRelations: INDIVIDUALS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INDIVIDUALS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IIndividuals,
  IndividualsSortableField,
  IndividualsSelectableField,
  IndividualsFilterableField,
  IndividualsDateRangeField,
  IndividualsRelationKey,
  typeof INDIVIDUALS_ONE_RELATION_QUERY_OPTIONS,
  typeof INDIVIDUALS_MANY_RELATION_QUERY_OPTIONS
>;
