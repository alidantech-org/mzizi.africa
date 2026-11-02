// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ClassifierMethod } from '#/types/source/classifier-method.enum';
import type { RouteStatus } from '#/types/source/route-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOCUMENT_CLASSIFICATION_RELATION_KEYS,
  DOCUMENT_CLASSIFICATION_SORTABLE_FIELDS,
  DOCUMENT_CLASSIFICATION_SEARCHABLE_FIELDS,
  DOCUMENT_CLASSIFICATION_FILTERABLE_FIELDS,
  DOCUMENT_CLASSIFICATION_DATE_RANGE_FIELDS,
  DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS,
  DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS,
  DOCUMENT_CLASSIFICATION_EDITABLE_FIELDS
} from './document-classification.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Document Classification */
export interface IDocumentClassification extends B.IBase {
  classifiedAt: Date;
  classifierVersion: string;
  documentId: string;
  evidence: string | null;
  facts: string | null;
  kind: string;
  method: ClassifierMethod;
  routeParser: string | null;
  routeStatus: RouteStatus;
  score: number;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DocumentClassificationKey = keyof IDocumentClassification;

export type DocumentClassificationRelationKey = (typeof DOCUMENT_CLASSIFICATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDocumentClassificationReadonlyFields = B.IBaseReadonlyFields;

export type IDocumentClassificationContextualFields = never;

export type IDocumentClassificationSensitiveFields = never;

export type IDocumentClassificationTransitionFields = never;

export type IDocumentClassificationImmutableFields =
  | IDocumentClassificationReadonlyFields
  | IDocumentClassificationContextualFields
  | IDocumentClassificationSensitiveFields
  | IDocumentClassificationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDocumentClassificationCreatable = Omit<IDocumentClassification, IDocumentClassificationImmutableFields | DocumentClassificationRelationKey>;

export type IDocumentClassificationSystemWritable = Omit<IDocumentClassification, B.IBaseReadonlyFields | DocumentClassificationRelationKey>;

export type IDocumentClassificationUpdatable = Partial<Omit<IDocumentClassification, IDocumentClassificationImmutableFields | DocumentClassificationRelationKey>>;

export interface IDocumentClassificationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DocumentClassificationSortableField = (typeof DOCUMENT_CLASSIFICATION_SORTABLE_FIELDS)[number];

export type DocumentClassificationSearchableField = (typeof DOCUMENT_CLASSIFICATION_SEARCHABLE_FIELDS)[number];

export type DocumentClassificationFilterableField = (typeof DOCUMENT_CLASSIFICATION_FILTERABLE_FIELDS)[number];

export type DocumentClassificationDateRangeField = (typeof DOCUMENT_CLASSIFICATION_DATE_RANGE_FIELDS)[number];

export type DocumentClassificationSelectableField = (typeof DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS)[number];

export type DocumentClassificationDefaultSelectField = (typeof DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS)[number];

export type DocumentClassificationEditableField = (typeof DOCUMENT_CLASSIFICATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDocumentClassificationAsOneRelationConfig = Q.IOneRelationConfig<'documentClassification', DocumentClassificationSelectableField>;

export type IDocumentClassificationAsManyRelationConfig = Q.IManyRelationConfig<'documentClassifications', DocumentClassificationSelectableField, DocumentClassificationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDocumentClassificationAsOneRelationQuery = Q.IAsOneRelationQuery<IDocumentClassification, DocumentClassificationSelectableField>;

export type IDocumentClassificationAsManyRelationQuery = Q.IAsManyRelationQuery<IDocumentClassification, DocumentClassificationSelectableField, DocumentClassificationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDocumentClassificationRelationMap extends Record<DocumentClassificationRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDocumentClassificationRelationQueries = Q.IBaseRelationQueries<IDocumentClassification, DocumentClassificationRelationKey, IDocumentClassificationRelationMap>;

export type IDocumentClassificationItemQuery = Q.IBaseItemQuery<
  IDocumentClassification,
  DocumentClassificationRelationKey,
  DocumentClassificationSelectableField,
  DocumentClassificationRelationKey,
  DocumentClassificationSelectableField,
  IDocumentClassificationRelationMap,
  IDocumentClassificationRelationQueries
>;

export type IDocumentClassificationListQuery = Q.IBaseListQuery<
  IDocumentClassification,
  DocumentClassificationRelationKey,
  DocumentClassificationSelectableField,
  DocumentClassificationSortableField,
  DocumentClassificationRelationKey,
  DocumentClassificationSelectableField,
  DocumentClassificationSortableField,
  DocumentClassificationDateRangeField,
  DocumentClassificationFilterableField,
  IDocumentClassificationRelationMap,
  IDocumentClassificationRelationQueries,
  IDocumentClassificationItemQuery
>;