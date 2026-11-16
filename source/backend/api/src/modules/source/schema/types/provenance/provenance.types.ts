// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CapturesTypes from "#/modules/source/schema/types/captures/captures.types";
import type * as DatasetsTypes from "#/modules/source/schema/types/datasets/datasets.types";
import type * as DocumentsTypes from "#/modules/source/schema/types/documents/documents.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROVENANCE_RELATION_KEYS,
  PROVENANCE_SORTABLE_FIELDS,
  PROVENANCE_SEARCHABLE_FIELDS,
  PROVENANCE_FILTERABLE_FIELDS,
  PROVENANCE_DATE_RANGE_FIELDS,
  PROVENANCE_SELECTABLE_FIELDS,
  PROVENANCE_DEFAULT_SELECT_FIELDS,
  PROVENANCE_EDITABLE_FIELDS,
} from "./provenance.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from. */
export interface IProvenance extends B.IBase {
  captureId: string | null;
  columnName: string | null;
  datasetId: string;
  documentId: string | null;
  line: number | null;
  recordId: string;
  tableName: string;
  readonly capture?: CapturesTypes.ICaptures;
  readonly dataset?: DatasetsTypes.IDatasets;
  readonly document?: DocumentsTypes.IDocuments;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProvenanceKey = keyof IProvenance;

export type ProvenanceRelationKey = (typeof PROVENANCE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProvenanceReadonlyFields = B.IBaseReadonlyFields;

export type IProvenanceContextualFields = never;

export type IProvenanceSensitiveFields = never;

export type IProvenanceTransitionFields = never;

export type IProvenanceImmutableFields =
  | IProvenanceReadonlyFields
  | IProvenanceContextualFields
  | IProvenanceSensitiveFields
  | IProvenanceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProvenanceCreatable = Omit<
  IProvenance,
  IProvenanceImmutableFields | ProvenanceRelationKey
>;

export type IProvenanceSystemWritable = Omit<
  IProvenance,
  B.IBaseReadonlyFields | ProvenanceRelationKey
>;

export type IProvenanceUpdatable = Partial<
  Omit<IProvenance, IProvenanceImmutableFields | ProvenanceRelationKey>
>;

export interface IProvenanceTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProvenanceSortableField = (typeof PROVENANCE_SORTABLE_FIELDS)[number];

export type ProvenanceSearchableField = (typeof PROVENANCE_SEARCHABLE_FIELDS)[number];

export type ProvenanceFilterableField = (typeof PROVENANCE_FILTERABLE_FIELDS)[number];

export type ProvenanceDateRangeField = (typeof PROVENANCE_DATE_RANGE_FIELDS)[number];

export type ProvenanceSelectableField = (typeof PROVENANCE_SELECTABLE_FIELDS)[number];

export type ProvenanceDefaultSelectField = (typeof PROVENANCE_DEFAULT_SELECT_FIELDS)[number];

export type ProvenanceEditableField = (typeof PROVENANCE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProvenanceAsOneRelationConfig = Q.IOneRelationConfig<
  "provenance",
  ProvenanceSelectableField
>;

export type IProvenanceAsManyRelationConfig = Q.IManyRelationConfig<
  "provenances",
  ProvenanceSelectableField,
  ProvenanceSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProvenanceAsOneRelationQuery = Q.IAsOneRelationQuery<
  IProvenance,
  ProvenanceSelectableField
>;

export type IProvenanceAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProvenance,
  ProvenanceSelectableField,
  ProvenanceSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProvenanceRelationMap extends Record<ProvenanceRelationKey, unknown> {
  capture: CapturesTypes.ICapturesAsOneRelationQuery;
  dataset: DatasetsTypes.IDatasetsAsOneRelationQuery;
  document: DocumentsTypes.IDocumentsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProvenanceRelationQueries = Q.IBaseRelationQueries<
  IProvenance,
  ProvenanceRelationKey,
  IProvenanceRelationMap
>;

export type IProvenanceItemQuery = Q.IBaseItemQuery<
  IProvenance,
  ProvenanceRelationKey,
  ProvenanceSelectableField,
  ProvenanceRelationKey,
  ProvenanceSelectableField,
  IProvenanceRelationMap,
  IProvenanceRelationQueries
>;

export type IProvenanceListQuery = Q.IBaseListQuery<
  IProvenance,
  ProvenanceRelationKey,
  ProvenanceSelectableField,
  ProvenanceSortableField,
  ProvenanceRelationKey,
  ProvenanceSelectableField,
  ProvenanceSortableField,
  ProvenanceDateRangeField,
  ProvenanceFilterableField,
  IProvenanceRelationMap,
  IProvenanceRelationQueries,
  IProvenanceItemQuery
>;
