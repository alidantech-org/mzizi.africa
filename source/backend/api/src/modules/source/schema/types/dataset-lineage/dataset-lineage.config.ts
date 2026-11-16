// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DatasetsConfig from "#/modules/source/schema/types/datasets/datasets.config";
import * as CapturesConfig from "#/modules/source/schema/types/captures/captures.config";
import * as DocumentsConfig from "#/modules/source/schema/types/documents/documents.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDatasetLineage,
  DatasetLineageKey,
  DatasetLineageRelationKey,
  DatasetLineageSortableField,
  DatasetLineageFilterableField,
  DatasetLineageDateRangeField,
  DatasetLineageSelectableField,
  IDatasetLineageAsOneRelationConfig,
  IDatasetLineageAsManyRelationConfig,
} from "./dataset-lineage.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DATASET_LINEAGE_RELATION_KEYS = [
  "dataset",
  "inputCapture",
  "inputDataset",
  "inputDocument",
] as const satisfies readonly DatasetLineageKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DATASET_LINEAGE_SORTABLE_FIELDS = [
  "createdAt",
  "datasetId",
  "deletedAt",
  "id",
  "inputCaptureId",
  "inputDatasetId",
  "inputDocumentId",
  "method",
  "role",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetLineageKey[];

export const DATASET_LINEAGE_SEARCHABLE_FIELDS = [
  "method",
] as const satisfies readonly DatasetLineageKey[];

export const DATASET_LINEAGE_FILTERABLE_FIELDS = [
  "datasetId",
  "id",
  "inputCaptureId",
  "inputDatasetId",
  "inputDocumentId",
  "role",
] as const satisfies readonly DatasetLineageKey[];

export const DATASET_LINEAGE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly DatasetLineageKey[];

export const DATASET_LINEAGE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDatasetLineage> = {
  searchableFields: [...DATASET_LINEAGE_SEARCHABLE_FIELDS],
  filterFields: [...DATASET_LINEAGE_FILTERABLE_FIELDS],
  dateRangeFields: [...DATASET_LINEAGE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DATASET_LINEAGE_SELECTABLE_FIELDS = [
  "createdAt",
  "datasetId",
  "deletedAt",
  "id",
  "inputCaptureId",
  "inputDatasetId",
  "inputDocumentId",
  "method",
  "role",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetLineageKey[];

export const DATASET_LINEAGE_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "datasetId",
  "deletedAt",
  "id",
  "inputCaptureId",
  "inputDatasetId",
  "inputDocumentId",
  "method",
  "role",
  "updatedAt",
  "version",
] as const satisfies readonly DatasetLineageSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DATASET_LINEAGE_EDITABLE_FIELDS = [
  "datasetId",
  "inputCaptureId",
  "inputDatasetId",
  "inputDocumentId",
  "method",
  "role",
] as const satisfies readonly DatasetLineageKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DATASET_LINEAGE_AS_ONE_RELATION_CONFIG = {
  relation: "datasetLineage",
  type: ERelationType.One,
  selectableFields: DATASET_LINEAGE_SELECTABLE_FIELDS,
  defaultSelectFields: DATASET_LINEAGE_DEFAULT_SELECT_FIELDS,
} as const satisfies IDatasetLineageAsOneRelationConfig;

export const DATASET_LINEAGE_AS_MANY_RELATION_CONFIG = {
  relation: "datasetLineages",
  type: ERelationType.Many,
  selectableFields: DATASET_LINEAGE_SELECTABLE_FIELDS,
  defaultSelectFields: DATASET_LINEAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: DATASET_LINEAGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDatasetLineageAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DATASET_LINEAGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DatasetLineageRelationKey>().one(
    () => DatasetsConfig.DATASETS_AS_ONE_RELATION_CONFIG,
    "dataset",
  ),
  Q.createRelationKeyMapper<DatasetLineageRelationKey>().one(
    () => CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG,
    "inputCapture",
  ),
  Q.createRelationKeyMapper<DatasetLineageRelationKey>().one(
    () => DatasetsConfig.DATASETS_AS_ONE_RELATION_CONFIG,
    "inputDataset",
  ),
  Q.createRelationKeyMapper<DatasetLineageRelationKey>().one(
    () => DocumentsConfig.DOCUMENTS_AS_ONE_RELATION_CONFIG,
    "inputDocument",
  ),
] as const;

export const DATASET_LINEAGE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DATASET_LINEAGE_QUERY_OPTIONS = {
  searchableFields: DATASET_LINEAGE_SEARCHABLE_FIELDS,
  selectableFields: DATASET_LINEAGE_SELECTABLE_FIELDS,
  defaultSelectFields: DATASET_LINEAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: DATASET_LINEAGE_SORTABLE_FIELDS,
  filterFields: DATASET_LINEAGE_FILTERABLE_FIELDS,
  dateRangeFields: DATASET_LINEAGE_DATE_RANGE_FIELDS,
  relationKeys: DATASET_LINEAGE_RELATION_KEYS,
  editableFields: DATASET_LINEAGE_EDITABLE_FIELDS,
  asOne: DATASET_LINEAGE_AS_ONE_RELATION_CONFIG,
  asMany: DATASET_LINEAGE_AS_MANY_RELATION_CONFIG,
  oneRelations: DATASET_LINEAGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DATASET_LINEAGE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDatasetLineage,
  DatasetLineageSortableField,
  DatasetLineageSelectableField,
  DatasetLineageFilterableField,
  DatasetLineageDateRangeField,
  DatasetLineageRelationKey,
  typeof DATASET_LINEAGE_ONE_RELATION_QUERY_OPTIONS,
  typeof DATASET_LINEAGE_MANY_RELATION_QUERY_OPTIONS
>;
