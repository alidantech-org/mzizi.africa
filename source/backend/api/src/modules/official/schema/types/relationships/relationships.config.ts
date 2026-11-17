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
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRelationships,
  RelationshipsKey,
  RelationshipsRelationKey,
  RelationshipsSortableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsSelectableField,
  IRelationshipsAsOneRelationConfig,
  IRelationshipsAsManyRelationConfig,
} from "./relationships.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const RELATIONSHIPS_RELATION_KEYS = [
  "fromEntity",
  "fromIndividual",
  "kind",
  "sourceCitation",
  "toEntity",
  "toIndividual",
] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "endsOn",
  "fromEntityId",
  "fromIndividualId",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sharePercentage",
  "sourceCitationId",
  "startsOn",
  "toEntityId",
  "toIndividualId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_SEARCHABLE_FIELDS = [
  "code",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_FILTERABLE_FIELDS = [
  "fromEntityId",
  "fromIndividualId",
  "fromToPrecision",
  "id",
  "kindId",
  "sourceCitationId",
  "toEntityId",
  "toIndividualId",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "startsOn",
  "updatedAt",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IRelationships> = {
  searchableFields: [...RELATIONSHIPS_SEARCHABLE_FIELDS],
  filterFields: [...RELATIONSHIPS_FILTERABLE_FIELDS],
  dateRangeFields: [...RELATIONSHIPS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "endsOn",
  "fromEntityId",
  "fromIndividualId",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sharePercentage",
  "sourceCitationId",
  "startsOn",
  "toEntityId",
  "toIndividualId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "endsOn",
  "fromEntityId",
  "fromIndividualId",
  "fromToPrecision",
  "fromYear",
  "id",
  "kindId",
  "sharePercentage",
  "sourceCitationId",
  "startsOn",
  "toEntityId",
  "toIndividualId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_EDITABLE_FIELDS = [
  "code",
  "endsOn",
  "fromEntityId",
  "fromIndividualId",
  "fromToPrecision",
  "fromYear",
  "kindId",
  "sharePercentage",
  "sourceCitationId",
  "startsOn",
  "toEntityId",
  "toIndividualId",
  "toYear",
] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const RELATIONSHIPS_AS_ONE_RELATION_CONFIG = {
  relation: "relationships",
  type: ERelationType.One,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
} as const satisfies IRelationshipsAsOneRelationConfig;

export const RELATIONSHIPS_AS_MANY_RELATION_CONFIG = {
  relation: "relationships",
  type: ERelationType.Many,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IRelationshipsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "fromEntity",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "fromIndividual",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "toEntity",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "toIndividual",
  ),
] as const;

export const RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const RELATIONSHIPS_QUERY_OPTIONS = {
  searchableFields: RELATIONSHIPS_SEARCHABLE_FIELDS,
  selectableFields: RELATIONSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: RELATIONSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: RELATIONSHIPS_SORTABLE_FIELDS,
  filterFields: RELATIONSHIPS_FILTERABLE_FIELDS,
  dateRangeFields: RELATIONSHIPS_DATE_RANGE_FIELDS,
  relationKeys: RELATIONSHIPS_RELATION_KEYS,
  editableFields: RELATIONSHIPS_EDITABLE_FIELDS,
  asOne: RELATIONSHIPS_AS_ONE_RELATION_CONFIG,
  asMany: RELATIONSHIPS_AS_MANY_RELATION_CONFIG,
  oneRelations: RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IRelationships,
  RelationshipsSortableField,
  RelationshipsSelectableField,
  RelationshipsFilterableField,
  RelationshipsDateRangeField,
  RelationshipsRelationKey,
  typeof RELATIONSHIPS_ONE_RELATION_QUERY_OPTIONS,
  typeof RELATIONSHIPS_MANY_RELATION_QUERY_OPTIONS
>;
