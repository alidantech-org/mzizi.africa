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
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IInstitutions,
  InstitutionsKey,
  InstitutionsRelationKey,
  InstitutionsSortableField,
  InstitutionsFilterableField,
  InstitutionsDateRangeField,
  InstitutionsSelectableField,
  IInstitutionsAsOneRelationConfig,
  IInstitutionsAsManyRelationConfig,
} from "./institutions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INSTITUTIONS_RELATION_KEYS = [
  "entity",
  "institutionKind",
  "sourceCitation",
] as const satisfies readonly InstitutionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INSTITUTIONS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "institutionKindId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly InstitutionsKey[];

export const INSTITUTIONS_SEARCHABLE_FIELDS = [
  "code",
] as const satisfies readonly InstitutionsKey[];

export const INSTITUTIONS_FILTERABLE_FIELDS = [
  "entityId",
  "id",
  "institutionKindId",
  "sourceCitationId",
] as const satisfies readonly InstitutionsKey[];

export const INSTITUTIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly InstitutionsKey[];

export const INSTITUTIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IInstitutions> = {
  searchableFields: [...INSTITUTIONS_SEARCHABLE_FIELDS],
  filterFields: [...INSTITUTIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...INSTITUTIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INSTITUTIONS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "institutionKindId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly InstitutionsKey[];

export const INSTITUTIONS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "institutionKindId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly InstitutionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INSTITUTIONS_EDITABLE_FIELDS = [
  "code",
  "entityId",
  "institutionKindId",
  "sourceCitationId",
  "validFrom",
  "validUntil",
] as const satisfies readonly InstitutionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INSTITUTIONS_AS_ONE_RELATION_CONFIG = {
  relation: "institutions",
  type: ERelationType.One,
  selectableFields: INSTITUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IInstitutionsAsOneRelationConfig;

export const INSTITUTIONS_AS_MANY_RELATION_CONFIG = {
  relation: "institutions",
  type: ERelationType.Many,
  selectableFields: INSTITUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IInstitutionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INSTITUTIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<InstitutionsRelationKey>().one(
    EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "entity",
  ),
  Q.createRelationKeyMapper<InstitutionsRelationKey>().one(
    ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "institutionKind",
  ),
  Q.createRelationKeyMapper<InstitutionsRelationKey>().one(
    CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const INSTITUTIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INSTITUTIONS_QUERY_OPTIONS = {
  searchableFields: INSTITUTIONS_SEARCHABLE_FIELDS,
  selectableFields: INSTITUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTIONS_SORTABLE_FIELDS,
  filterFields: INSTITUTIONS_FILTERABLE_FIELDS,
  dateRangeFields: INSTITUTIONS_DATE_RANGE_FIELDS,
  relationKeys: INSTITUTIONS_RELATION_KEYS,
  editableFields: INSTITUTIONS_EDITABLE_FIELDS,
  asOne: INSTITUTIONS_AS_ONE_RELATION_CONFIG,
  asMany: INSTITUTIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: INSTITUTIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INSTITUTIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IInstitutions,
  InstitutionsSortableField,
  InstitutionsSelectableField,
  InstitutionsFilterableField,
  InstitutionsDateRangeField,
  InstitutionsRelationKey,
  typeof INSTITUTIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof INSTITUTIONS_MANY_RELATION_QUERY_OPTIONS
>;
