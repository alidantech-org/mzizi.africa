// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PublisherTypes from '#/modules/source/types/publisher.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOCUMENT_RELATION_KEYS,
  DOCUMENT_SORTABLE_FIELDS,
  DOCUMENT_SEARCHABLE_FIELDS,
  DOCUMENT_FILTERABLE_FIELDS,
  DOCUMENT_DATE_RANGE_FIELDS,
  DOCUMENT_SELECTABLE_FIELDS,
  DOCUMENT_DEFAULT_SELECT_FIELDS,
  DOCUMENT_EDITABLE_FIELDS
} from './document.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Document */
export interface IDocument extends B.IBase {
  citation: string | null;
  jurisdictionId: string | null;
  kindId: string;
  language: string | null;
  licence: string | null;
  publishedOn: Date | null;
  publishedOnPrecision: DatePrecision | null;
  publisherId: string;
  siteId: string | null;
  title: string;
  url: string | null;
  readonly publisher?: PublisherTypes.IPublisher;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DocumentKey = keyof IDocument;

export type DocumentRelationKey = (typeof DOCUMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDocumentReadonlyFields = B.IBaseReadonlyFields;

export type IDocumentContextualFields = never;

export type IDocumentSensitiveFields = never;

export type IDocumentTransitionFields = never;

export type IDocumentImmutableFields =
  | IDocumentReadonlyFields
  | IDocumentContextualFields
  | IDocumentSensitiveFields
  | IDocumentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDocumentCreatable = Omit<IDocument, IDocumentImmutableFields | DocumentRelationKey>;

export type IDocumentSystemWritable = Omit<IDocument, B.IBaseReadonlyFields | DocumentRelationKey>;

export type IDocumentUpdatable = Partial<Omit<IDocument, IDocumentImmutableFields | DocumentRelationKey>>;

export interface IDocumentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DocumentSortableField = (typeof DOCUMENT_SORTABLE_FIELDS)[number];

export type DocumentSearchableField = (typeof DOCUMENT_SEARCHABLE_FIELDS)[number];

export type DocumentFilterableField = (typeof DOCUMENT_FILTERABLE_FIELDS)[number];

export type DocumentDateRangeField = (typeof DOCUMENT_DATE_RANGE_FIELDS)[number];

export type DocumentSelectableField = (typeof DOCUMENT_SELECTABLE_FIELDS)[number];

export type DocumentDefaultSelectField = (typeof DOCUMENT_DEFAULT_SELECT_FIELDS)[number];

export type DocumentEditableField = (typeof DOCUMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDocumentAsOneRelationConfig = Q.IOneRelationConfig<'document', DocumentSelectableField>;

export type IDocumentAsManyRelationConfig = Q.IManyRelationConfig<'documents', DocumentSelectableField, DocumentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDocumentAsOneRelationQuery = Q.IAsOneRelationQuery<IDocument, DocumentSelectableField>;

export type IDocumentAsManyRelationQuery = Q.IAsManyRelationQuery<IDocument, DocumentSelectableField, DocumentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDocumentRelationMap extends Record<DocumentRelationKey, unknown> {
  publisher: PublisherTypes.IPublisherAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDocumentRelationQueries = Q.IBaseRelationQueries<IDocument, DocumentRelationKey, IDocumentRelationMap>;

export type IDocumentItemQuery = Q.IBaseItemQuery<
  IDocument,
  DocumentRelationKey,
  DocumentSelectableField,
  DocumentRelationKey,
  DocumentSelectableField,
  IDocumentRelationMap,
  IDocumentRelationQueries
>;

export type IDocumentListQuery = Q.IBaseListQuery<
  IDocument,
  DocumentRelationKey,
  DocumentSelectableField,
  DocumentSortableField,
  DocumentRelationKey,
  DocumentSelectableField,
  DocumentSortableField,
  DocumentDateRangeField,
  DocumentFilterableField,
  IDocumentRelationMap,
  IDocumentRelationQueries,
  IDocumentItemQuery
>;