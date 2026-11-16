// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as UnitConfig from "#/modules/reference/schema/types/unit/unit.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDatasets,
  DatasetsKey,
  DatasetsRelationKey,
  DatasetsSortableField,
  DatasetsFilterableField,
  DatasetsDateRangeField,
  DatasetsSelectableField,
  IDatasetsAsOneRelationConfig,
  IDatasetsAsManyRelationConfig,
} from "./datasets.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DATASETS_RELATION_KEYS = [
  "coverageFeature",
  "representation",
  "resolutionUnit",
  "subject",
] as const satisfies readonly DatasetsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DATASETS_SORTABLE_FIELDS = [
  "code",
  "coverageFeatureId",
  "createdAt",
  "crs",
  "deletedAt",
  "fileVersionRefId",
  "format",
  "id",
  "qualityNotes",
  "representationId",
  "resolution",
  "resolutionUnitId",
  "sourceRefId",
  "subjectId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetsKey[];

export const DATASETS_SEARCHABLE_FIELDS = [
  "code",
  "crs",
  "format",
  "qualityNotes",
  "title",
] as const satisfies readonly DatasetsKey[];

export const DATASETS_FILTERABLE_FIELDS = [
  "coverageFeatureId",
  "fileVersionRefId",
  "id",
  "representationId",
  "resolutionUnitId",
  "sourceRefId",
  "subjectId",
] as const satisfies readonly DatasetsKey[];

export const DATASETS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly DatasetsKey[];

export const DATASETS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDatasets> = {
  searchableFields: [...DATASETS_SEARCHABLE_FIELDS],
  filterFields: [...DATASETS_FILTERABLE_FIELDS],
  dateRangeFields: [...DATASETS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DATASETS_SELECTABLE_FIELDS = [
  "code",
  "coverageFeatureId",
  "createdAt",
  "crs",
  "deletedAt",
  "fileVersionRefId",
  "format",
  "id",
  "qualityNotes",
  "representationId",
  "resolution",
  "resolutionUnitId",
  "sourceRefId",
  "subjectId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetsKey[];

export const DATASETS_DEFAULT_SELECT_FIELDS = [
  "code",
  "coverageFeatureId",
  "createdAt",
  "crs",
  "deletedAt",
  "fileVersionRefId",
  "format",
  "id",
  "qualityNotes",
  "representationId",
  "resolution",
  "resolutionUnitId",
  "sourceRefId",
  "subjectId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DATASETS_EDITABLE_FIELDS = [
  "code",
  "coverageFeatureId",
  "crs",
  "fileVersionRefId",
  "format",
  "qualityNotes",
  "representationId",
  "resolution",
  "resolutionUnitId",
  "sourceRefId",
  "subjectId",
  "title",
] as const satisfies readonly DatasetsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DATASETS_AS_ONE_RELATION_CONFIG = {
  relation: "datasets",
  type: ERelationType.One,
  selectableFields: DATASETS_SELECTABLE_FIELDS,
  defaultSelectFields: DATASETS_DEFAULT_SELECT_FIELDS,
} as const satisfies IDatasetsAsOneRelationConfig;

export const DATASETS_AS_MANY_RELATION_CONFIG = {
  relation: "datasets",
  type: ERelationType.Many,
  selectableFields: DATASETS_SELECTABLE_FIELDS,
  defaultSelectFields: DATASETS_DEFAULT_SELECT_FIELDS,
  sortableFields: DATASETS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDatasetsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DATASETS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DatasetsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "coverageFeature",
  ),
  Q.createRelationKeyMapper<DatasetsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "representation",
  ),
  Q.createRelationKeyMapper<DatasetsRelationKey>().one(
    () => UnitConfig.UNIT_AS_ONE_RELATION_CONFIG,
    "resolutionUnit",
  ),
  Q.createRelationKeyMapper<DatasetsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "subject",
  ),
] as const;

export const DATASETS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DATASETS_QUERY_OPTIONS = {
  searchableFields: DATASETS_SEARCHABLE_FIELDS,
  selectableFields: DATASETS_SELECTABLE_FIELDS,
  defaultSelectFields: DATASETS_DEFAULT_SELECT_FIELDS,
  sortableFields: DATASETS_SORTABLE_FIELDS,
  filterFields: DATASETS_FILTERABLE_FIELDS,
  dateRangeFields: DATASETS_DATE_RANGE_FIELDS,
  relationKeys: DATASETS_RELATION_KEYS,
  editableFields: DATASETS_EDITABLE_FIELDS,
  asOne: DATASETS_AS_ONE_RELATION_CONFIG,
  asMany: DATASETS_AS_MANY_RELATION_CONFIG,
  oneRelations: DATASETS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DATASETS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDatasets,
  DatasetsSortableField,
  DatasetsSelectableField,
  DatasetsFilterableField,
  DatasetsDateRangeField,
  DatasetsRelationKey,
  typeof DATASETS_ONE_RELATION_QUERY_OPTIONS,
  typeof DATASETS_MANY_RELATION_QUERY_OPTIONS
>;
