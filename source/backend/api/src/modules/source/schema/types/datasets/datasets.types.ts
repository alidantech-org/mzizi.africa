// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatasetAssembly } from "#/modules/source/schema/enum/dataset-assembly.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DATASETS_RELATION_KEYS,
  DATASETS_SORTABLE_FIELDS,
  DATASETS_SEARCHABLE_FIELDS,
  DATASETS_FILTERABLE_FIELDS,
  DATASETS_DATE_RANGE_FIELDS,
  DATASETS_SELECTABLE_FIELDS,
  DATASETS_DEFAULT_SELECT_FIELDS,
  DATASETS_EDITABLE_FIELDS,
} from "./datasets.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs. */
export interface IDatasets extends B.IBase {
  assembly: DatasetAssembly;
  categoryId: string | null;
  code: string;
  description: string | null;
  fileVersionId: string | null;
  format: string;
  location: string | null;
  sha256: string | null;
  title: string;
  readonly category?: ValueTypes.IValue;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DatasetsKey = keyof IDatasets;

export type DatasetsRelationKey = (typeof DATASETS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDatasetsReadonlyFields = B.IBaseReadonlyFields;

export type IDatasetsContextualFields = never;

export type IDatasetsSensitiveFields = never;

export type IDatasetsTransitionFields = never;

export type IDatasetsImmutableFields =
  | IDatasetsReadonlyFields
  | IDatasetsContextualFields
  | IDatasetsSensitiveFields
  | IDatasetsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDatasetsCreatable = Omit<IDatasets, IDatasetsImmutableFields | DatasetsRelationKey>;

export type IDatasetsSystemWritable = Omit<IDatasets, B.IBaseReadonlyFields | DatasetsRelationKey>;

export type IDatasetsUpdatable = Partial<
  Omit<IDatasets, IDatasetsImmutableFields | DatasetsRelationKey>
>;

export interface IDatasetsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DatasetsSortableField = (typeof DATASETS_SORTABLE_FIELDS)[number];

export type DatasetsSearchableField = (typeof DATASETS_SEARCHABLE_FIELDS)[number];

export type DatasetsFilterableField = (typeof DATASETS_FILTERABLE_FIELDS)[number];

export type DatasetsDateRangeField = (typeof DATASETS_DATE_RANGE_FIELDS)[number];

export type DatasetsSelectableField = (typeof DATASETS_SELECTABLE_FIELDS)[number];

export type DatasetsDefaultSelectField = (typeof DATASETS_DEFAULT_SELECT_FIELDS)[number];

export type DatasetsEditableField = (typeof DATASETS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDatasetsAsOneRelationConfig = Q.IOneRelationConfig<
  "datasets",
  DatasetsSelectableField
>;

export type IDatasetsAsManyRelationConfig = Q.IManyRelationConfig<
  "datasets",
  DatasetsSelectableField,
  DatasetsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDatasetsAsOneRelationQuery = Q.IAsOneRelationQuery<IDatasets, DatasetsSelectableField>;

export type IDatasetsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDatasets,
  DatasetsSelectableField,
  DatasetsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDatasetsRelationMap extends Record<DatasetsRelationKey, unknown> {
  category: ValueTypes.IValueAsOneRelationQuery;
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDatasetsRelationQueries = Q.IBaseRelationQueries<
  IDatasets,
  DatasetsRelationKey,
  IDatasetsRelationMap
>;

export type IDatasetsItemQuery = Q.IBaseItemQuery<
  IDatasets,
  DatasetsRelationKey,
  DatasetsSelectableField,
  DatasetsRelationKey,
  DatasetsSelectableField,
  IDatasetsRelationMap,
  IDatasetsRelationQueries
>;

export type IDatasetsListQuery = Q.IBaseListQuery<
  IDatasets,
  DatasetsRelationKey,
  DatasetsSelectableField,
  DatasetsSortableField,
  DatasetsRelationKey,
  DatasetsSelectableField,
  DatasetsSortableField,
  DatasetsDateRangeField,
  DatasetsFilterableField,
  IDatasetsRelationMap,
  IDatasetsRelationQueries,
  IDatasetsItemQuery
>;
