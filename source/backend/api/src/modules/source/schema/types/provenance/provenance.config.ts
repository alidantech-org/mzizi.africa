// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CapturesConfig from "#/modules/source/schema/types/captures/captures.config";
import * as DatasetsConfig from "#/modules/source/schema/types/datasets/datasets.config";
import * as DocumentsConfig from "#/modules/source/schema/types/documents/documents.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProvenance,
  ProvenanceKey,
  ProvenanceRelationKey,
  ProvenanceSortableField,
  ProvenanceFilterableField,
  ProvenanceDateRangeField,
  ProvenanceSelectableField,
  IProvenanceAsOneRelationConfig,
  IProvenanceAsManyRelationConfig,
} from "./provenance.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROVENANCE_RELATION_KEYS = [
  "capture",
  "dataset",
  "document",
] as const satisfies readonly ProvenanceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROVENANCE_SORTABLE_FIELDS = [
  "captureId",
  "columnName",
  "createdAt",
  "datasetId",
  "deletedAt",
  "documentId",
  "id",
  "line",
  "recordId",
  "tableName",
  "updatedAt",
  "version",
] as const satisfies readonly ProvenanceKey[];

export const PROVENANCE_SEARCHABLE_FIELDS = [
  "columnName",
  "tableName",
] as const satisfies readonly ProvenanceKey[];

export const PROVENANCE_FILTERABLE_FIELDS = [
  "captureId",
  "datasetId",
  "documentId",
  "id",
  "recordId",
] as const satisfies readonly ProvenanceKey[];

export const PROVENANCE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ProvenanceKey[];

export const PROVENANCE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProvenance> = {
  searchableFields: [...PROVENANCE_SEARCHABLE_FIELDS],
  filterFields: [...PROVENANCE_FILTERABLE_FIELDS],
  dateRangeFields: [...PROVENANCE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROVENANCE_SELECTABLE_FIELDS = [
  "captureId",
  "columnName",
  "createdAt",
  "datasetId",
  "deletedAt",
  "documentId",
  "id",
  "line",
  "recordId",
  "tableName",
  "updatedAt",
  "version",
] as const satisfies readonly ProvenanceKey[];

export const PROVENANCE_DEFAULT_SELECT_FIELDS = [
  "captureId",
  "columnName",
  "createdAt",
  "datasetId",
  "deletedAt",
  "documentId",
  "id",
  "line",
  "recordId",
  "tableName",
  "updatedAt",
  "version",
] as const satisfies readonly ProvenanceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROVENANCE_EDITABLE_FIELDS = [
  "captureId",
  "columnName",
  "datasetId",
  "documentId",
  "line",
  "recordId",
  "tableName",
] as const satisfies readonly ProvenanceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROVENANCE_AS_ONE_RELATION_CONFIG = {
  relation: "provenance",
  type: ERelationType.One,
  selectableFields: PROVENANCE_SELECTABLE_FIELDS,
  defaultSelectFields: PROVENANCE_DEFAULT_SELECT_FIELDS,
} as const satisfies IProvenanceAsOneRelationConfig;

export const PROVENANCE_AS_MANY_RELATION_CONFIG = {
  relation: "provenances",
  type: ERelationType.Many,
  selectableFields: PROVENANCE_SELECTABLE_FIELDS,
  defaultSelectFields: PROVENANCE_DEFAULT_SELECT_FIELDS,
  sortableFields: PROVENANCE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProvenanceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROVENANCE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProvenanceRelationKey>().one(
    () => CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG,
    "capture",
  ),
  Q.createRelationKeyMapper<ProvenanceRelationKey>().one(
    () => DatasetsConfig.DATASETS_AS_ONE_RELATION_CONFIG,
    "dataset",
  ),
  Q.createRelationKeyMapper<ProvenanceRelationKey>().one(
    () => DocumentsConfig.DOCUMENTS_AS_ONE_RELATION_CONFIG,
    "document",
  ),
] as const;

export const PROVENANCE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROVENANCE_QUERY_OPTIONS = {
  searchableFields: PROVENANCE_SEARCHABLE_FIELDS,
  selectableFields: PROVENANCE_SELECTABLE_FIELDS,
  defaultSelectFields: PROVENANCE_DEFAULT_SELECT_FIELDS,
  sortableFields: PROVENANCE_SORTABLE_FIELDS,
  filterFields: PROVENANCE_FILTERABLE_FIELDS,
  dateRangeFields: PROVENANCE_DATE_RANGE_FIELDS,
  relationKeys: PROVENANCE_RELATION_KEYS,
  editableFields: PROVENANCE_EDITABLE_FIELDS,
  asOne: PROVENANCE_AS_ONE_RELATION_CONFIG,
  asMany: PROVENANCE_AS_MANY_RELATION_CONFIG,
  oneRelations: PROVENANCE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROVENANCE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProvenance,
  ProvenanceSortableField,
  ProvenanceSelectableField,
  ProvenanceFilterableField,
  ProvenanceDateRangeField,
  ProvenanceRelationKey,
  typeof PROVENANCE_ONE_RELATION_QUERY_OPTIONS,
  typeof PROVENANCE_MANY_RELATION_QUERY_OPTIONS
>;
