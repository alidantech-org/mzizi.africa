// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';
import type * as PublishersTypes from '#/modules/source/types/publishers.types';
import type * as SourcesTypes from '#/modules/source/types/sources.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOCUMENTS_RELATION_KEYS,
  DOCUMENTS_SORTABLE_FIELDS,
  DOCUMENTS_SEARCHABLE_FIELDS,
  DOCUMENTS_FILTERABLE_FIELDS,
  DOCUMENTS_DATE_RANGE_FIELDS,
  DOCUMENTS_SELECTABLE_FIELDS,
  DOCUMENTS_DEFAULT_SELECT_FIELDS,
  DOCUMENTS_EDITABLE_FIELDS
} from './documents.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable published document identity; repeated captures retain independent retrieval history. */
export interface IDocuments extends B.IBase {
  canonicalUrl: string | null;
  code: string;
  kindId: string;
  publishedOn: Date | null;
  publisherId: string;
  sourceId: string;
  title: string;
  readonly kind?: ValueTypes.IValue;
  readonly publisher?: PublishersTypes.IPublishers;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DocumentsKey = keyof IDocuments;

export type DocumentsRelationKey = (typeof DOCUMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDocumentsReadonlyFields = B.IBaseReadonlyFields;

export type IDocumentsContextualFields = never;

export type IDocumentsSensitiveFields = never;

export type IDocumentsTransitionFields = never;

export type IDocumentsImmutableFields =
  | IDocumentsReadonlyFields
  | IDocumentsContextualFields
  | IDocumentsSensitiveFields
  | IDocumentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDocumentsCreatable = Omit<IDocuments, IDocumentsImmutableFields | DocumentsRelationKey>;

export type IDocumentsSystemWritable = Omit<IDocuments, B.IBaseReadonlyFields | DocumentsRelationKey>;

export type IDocumentsUpdatable = Partial<Omit<IDocuments, IDocumentsImmutableFields | DocumentsRelationKey>>;

export interface IDocumentsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DocumentsSortableField = (typeof DOCUMENTS_SORTABLE_FIELDS)[number];

export type DocumentsSearchableField = (typeof DOCUMENTS_SEARCHABLE_FIELDS)[number];

export type DocumentsFilterableField = (typeof DOCUMENTS_FILTERABLE_FIELDS)[number];

export type DocumentsDateRangeField = (typeof DOCUMENTS_DATE_RANGE_FIELDS)[number];

export type DocumentsSelectableField = (typeof DOCUMENTS_SELECTABLE_FIELDS)[number];

export type DocumentsDefaultSelectField = (typeof DOCUMENTS_DEFAULT_SELECT_FIELDS)[number];

export type DocumentsEditableField = (typeof DOCUMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDocumentsAsOneRelationConfig = Q.IOneRelationConfig<'documents', DocumentsSelectableField>;

export type IDocumentsAsManyRelationConfig = Q.IManyRelationConfig<'documentss', DocumentsSelectableField, DocumentsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDocumentsAsOneRelationQuery = Q.IAsOneRelationQuery<IDocuments, DocumentsSelectableField>;

export type IDocumentsAsManyRelationQuery = Q.IAsManyRelationQuery<IDocuments, DocumentsSelectableField, DocumentsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDocumentsRelationMap extends Record<DocumentsRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  publisher: PublishersTypes.IPublishersAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDocumentsRelationQueries = Q.IBaseRelationQueries<IDocuments, DocumentsRelationKey, IDocumentsRelationMap>;

export type IDocumentsItemQuery = Q.IBaseItemQuery<
  IDocuments,
  DocumentsRelationKey,
  DocumentsSelectableField,
  DocumentsRelationKey,
  DocumentsSelectableField,
  IDocumentsRelationMap,
  IDocumentsRelationQueries
>;

export type IDocumentsListQuery = Q.IBaseListQuery<
  IDocuments,
  DocumentsRelationKey,
  DocumentsSelectableField,
  DocumentsSortableField,
  DocumentsRelationKey,
  DocumentsSelectableField,
  DocumentsSortableField,
  DocumentsDateRangeField,
  DocumentsFilterableField,
  IDocumentsRelationMap,
  IDocumentsRelationQueries,
  IDocumentsItemQuery
>;