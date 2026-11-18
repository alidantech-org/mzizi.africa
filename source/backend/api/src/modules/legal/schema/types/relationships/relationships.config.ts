// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as WordingsConfig from "#/modules/legal/schema/types/wordings/wordings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";

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
  "affectedWording",
  "authorityWording",
  "citation",
  "kind",
  "objectInstrument",
  "resultingWording",
  "subjectInstrument",
] as const satisfies readonly RelationshipsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_SORTABLE_FIELDS = [
  "affectedWordingId",
  "authorityWordingId",
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "explanation",
  "id",
  "kindId",
  "objectInstrumentId",
  "resultingWordingId",
  "subjectInstrumentId",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_SEARCHABLE_FIELDS = [
  "code",
  "explanation",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_FILTERABLE_FIELDS = [
  "affectedWordingId",
  "authorityWordingId",
  "citationId",
  "id",
  "kindId",
  "objectInstrumentId",
  "resultingWordingId",
  "subjectInstrumentId",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "effectiveOn",
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
  "affectedWordingId",
  "authorityWordingId",
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "explanation",
  "id",
  "kindId",
  "objectInstrumentId",
  "resultingWordingId",
  "subjectInstrumentId",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsKey[];

export const RELATIONSHIPS_DEFAULT_SELECT_FIELDS = [
  "affectedWordingId",
  "authorityWordingId",
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "effectiveOn",
  "explanation",
  "id",
  "kindId",
  "objectInstrumentId",
  "resultingWordingId",
  "subjectInstrumentId",
  "updatedAt",
  "version",
] as const satisfies readonly RelationshipsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const RELATIONSHIPS_EDITABLE_FIELDS = [
  "affectedWordingId",
  "authorityWordingId",
  "citationId",
  "code",
  "effectiveOn",
  "explanation",
  "kindId",
  "objectInstrumentId",
  "resultingWordingId",
  "subjectInstrumentId",
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
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "affectedWording",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "authorityWording",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "citation",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "objectInstrument",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "resultingWording",
  ),
  Q.createRelationKeyMapper<RelationshipsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "subjectInstrument",
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
