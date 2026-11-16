// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { LineageRole } from "#/modules/source/schema/enum/lineage-role.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DatasetsTypes from "#/modules/source/schema/types/datasets/datasets.types";
import type * as CapturesTypes from "#/modules/source/schema/types/captures/captures.types";
import type * as DocumentsTypes from "#/modules/source/schema/types/documents/documents.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DATASET_LINEAGE_RELATION_KEYS,
  DATASET_LINEAGE_SORTABLE_FIELDS,
  DATASET_LINEAGE_SEARCHABLE_FIELDS,
  DATASET_LINEAGE_FILTERABLE_FIELDS,
  DATASET_LINEAGE_DATE_RANGE_FIELDS,
  DATASET_LINEAGE_SELECTABLE_FIELDS,
  DATASET_LINEAGE_DEFAULT_SELECT_FIELDS,
  DATASET_LINEAGE_EDITABLE_FIELDS,
} from "./dataset-lineage.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** What a dataset was prepared from: a capture, a document or another dataset, with the role and method. */
export interface IDatasetLineage extends B.IBase {
  datasetId: string;
  inputCaptureId: string | null;
  inputDatasetId: string | null;
  inputDocumentId: string | null;
  method: string | null;
  role: LineageRole;
  readonly dataset?: DatasetsTypes.IDatasets;
  readonly inputCapture?: CapturesTypes.ICaptures;
  readonly inputDataset?: DatasetsTypes.IDatasets;
  readonly inputDocument?: DocumentsTypes.IDocuments;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DatasetLineageKey = keyof IDatasetLineage;

export type DatasetLineageRelationKey = (typeof DATASET_LINEAGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDatasetLineageReadonlyFields = B.IBaseReadonlyFields;

export type IDatasetLineageContextualFields = never;

export type IDatasetLineageSensitiveFields = never;

export type IDatasetLineageTransitionFields = never;

export type IDatasetLineageImmutableFields =
  | IDatasetLineageReadonlyFields
  | IDatasetLineageContextualFields
  | IDatasetLineageSensitiveFields
  | IDatasetLineageTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDatasetLineageCreatable = Omit<
  IDatasetLineage,
  IDatasetLineageImmutableFields | DatasetLineageRelationKey
>;

export type IDatasetLineageSystemWritable = Omit<
  IDatasetLineage,
  B.IBaseReadonlyFields | DatasetLineageRelationKey
>;

export type IDatasetLineageUpdatable = Partial<
  Omit<IDatasetLineage, IDatasetLineageImmutableFields | DatasetLineageRelationKey>
>;

export interface IDatasetLineageTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DatasetLineageSortableField = (typeof DATASET_LINEAGE_SORTABLE_FIELDS)[number];

export type DatasetLineageSearchableField = (typeof DATASET_LINEAGE_SEARCHABLE_FIELDS)[number];

export type DatasetLineageFilterableField = (typeof DATASET_LINEAGE_FILTERABLE_FIELDS)[number];

export type DatasetLineageDateRangeField = (typeof DATASET_LINEAGE_DATE_RANGE_FIELDS)[number];

export type DatasetLineageSelectableField = (typeof DATASET_LINEAGE_SELECTABLE_FIELDS)[number];

export type DatasetLineageDefaultSelectField =
  (typeof DATASET_LINEAGE_DEFAULT_SELECT_FIELDS)[number];

export type DatasetLineageEditableField = (typeof DATASET_LINEAGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDatasetLineageAsOneRelationConfig = Q.IOneRelationConfig<
  "datasetLineage",
  DatasetLineageSelectableField
>;

export type IDatasetLineageAsManyRelationConfig = Q.IManyRelationConfig<
  "datasetLineages",
  DatasetLineageSelectableField,
  DatasetLineageSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDatasetLineageAsOneRelationQuery = Q.IAsOneRelationQuery<
  IDatasetLineage,
  DatasetLineageSelectableField
>;

export type IDatasetLineageAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDatasetLineage,
  DatasetLineageSelectableField,
  DatasetLineageSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDatasetLineageRelationMap extends Record<DatasetLineageRelationKey, unknown> {
  dataset: DatasetsTypes.IDatasetsAsOneRelationQuery;
  inputCapture: CapturesTypes.ICapturesAsOneRelationQuery;
  inputDataset: DatasetsTypes.IDatasetsAsOneRelationQuery;
  inputDocument: DocumentsTypes.IDocumentsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDatasetLineageRelationQueries = Q.IBaseRelationQueries<
  IDatasetLineage,
  DatasetLineageRelationKey,
  IDatasetLineageRelationMap
>;

export type IDatasetLineageItemQuery = Q.IBaseItemQuery<
  IDatasetLineage,
  DatasetLineageRelationKey,
  DatasetLineageSelectableField,
  DatasetLineageRelationKey,
  DatasetLineageSelectableField,
  IDatasetLineageRelationMap,
  IDatasetLineageRelationQueries
>;

export type IDatasetLineageListQuery = Q.IBaseListQuery<
  IDatasetLineage,
  DatasetLineageRelationKey,
  DatasetLineageSelectableField,
  DatasetLineageSortableField,
  DatasetLineageRelationKey,
  DatasetLineageSelectableField,
  DatasetLineageSortableField,
  DatasetLineageDateRangeField,
  DatasetLineageFilterableField,
  IDatasetLineageRelationMap,
  IDatasetLineageRelationQueries,
  IDatasetLineageItemQuery
>;
