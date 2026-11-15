// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from '#/modules/geography/types/features.types';
import type * as ValueTypes from '#/modules/reference/types/value.types';
import type * as UnitTypes from '#/modules/reference/types/unit.types';

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
  DATASETS_EDITABLE_FIELDS
} from './datasets.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts. */
export interface IDatasets extends B.IBase {
  code: string;
  coverageFeatureId: string | null;
  crs: string | null;
  fileVersionRefId: string | null;
  format: string;
  qualityNotes: string | null;
  representationId: string;
  resolution: number | null;
  resolutionUnitId: string | null;
  sourceRefId: string | null;
  subjectId: string;
  title: string;
  readonly coverageFeature?: FeaturesTypes.IFeatures;
  readonly representation?: ValueTypes.IValue;
  readonly resolutionUnit?: UnitTypes.IUnit;
  readonly subject?: ValueTypes.IValue;
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

export type IDatasetsUpdatable = Partial<Omit<IDatasets, IDatasetsImmutableFields | DatasetsRelationKey>>;

export interface IDatasetsTransitionPayload {
}

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

export type IDatasetsAsOneRelationConfig = Q.IOneRelationConfig<'datasets', DatasetsSelectableField>;

export type IDatasetsAsManyRelationConfig = Q.IManyRelationConfig<'datasetss', DatasetsSelectableField, DatasetsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDatasetsAsOneRelationQuery = Q.IAsOneRelationQuery<IDatasets, DatasetsSelectableField>;

export type IDatasetsAsManyRelationQuery = Q.IAsManyRelationQuery<IDatasets, DatasetsSelectableField, DatasetsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDatasetsRelationMap extends Record<DatasetsRelationKey, unknown> {
  coverageFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  representation: ValueTypes.IValueAsOneRelationQuery;
  resolutionUnit: UnitTypes.IUnitAsOneRelationQuery;
  subject: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDatasetsRelationQueries = Q.IBaseRelationQueries<IDatasets, DatasetsRelationKey, IDatasetsRelationMap>;

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