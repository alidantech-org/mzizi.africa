// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOCUMENT_SIGHTING_RELATION_KEYS,
  DOCUMENT_SIGHTING_SORTABLE_FIELDS,
  DOCUMENT_SIGHTING_SEARCHABLE_FIELDS,
  DOCUMENT_SIGHTING_FILTERABLE_FIELDS,
  DOCUMENT_SIGHTING_DATE_RANGE_FIELDS,
  DOCUMENT_SIGHTING_SELECTABLE_FIELDS,
  DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS,
  DOCUMENT_SIGHTING_EDITABLE_FIELDS
} from './document-sighting.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Document Sighting */
export interface IDocumentSighting extends B.IBase {
  captureId: string | null;
  contentHash: string;
  depth: number;
  documentId: string;
  headers: string | null;
  httpStatus: number;
  pageUrl: string | null;
  ruleIndex: number | null;
  sectionLabel: string | null;
  seenAt: Date;
  siteId: string;
  sizeBytes: number;
  structureVersionId: string | null;
  url: string;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DocumentSightingKey = keyof IDocumentSighting;

export type DocumentSightingRelationKey = (typeof DOCUMENT_SIGHTING_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDocumentSightingReadonlyFields = B.IBaseReadonlyFields;

export type IDocumentSightingContextualFields = never;

export type IDocumentSightingSensitiveFields = never;

export type IDocumentSightingTransitionFields = never;

export type IDocumentSightingImmutableFields =
  | IDocumentSightingReadonlyFields
  | IDocumentSightingContextualFields
  | IDocumentSightingSensitiveFields
  | IDocumentSightingTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDocumentSightingCreatable = Omit<IDocumentSighting, IDocumentSightingImmutableFields | DocumentSightingRelationKey>;

export type IDocumentSightingSystemWritable = Omit<IDocumentSighting, B.IBaseReadonlyFields | DocumentSightingRelationKey>;

export type IDocumentSightingUpdatable = Partial<Omit<IDocumentSighting, IDocumentSightingImmutableFields | DocumentSightingRelationKey>>;

export interface IDocumentSightingTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DocumentSightingSortableField = (typeof DOCUMENT_SIGHTING_SORTABLE_FIELDS)[number];

export type DocumentSightingSearchableField = (typeof DOCUMENT_SIGHTING_SEARCHABLE_FIELDS)[number];

export type DocumentSightingFilterableField = (typeof DOCUMENT_SIGHTING_FILTERABLE_FIELDS)[number];

export type DocumentSightingDateRangeField = (typeof DOCUMENT_SIGHTING_DATE_RANGE_FIELDS)[number];

export type DocumentSightingSelectableField = (typeof DOCUMENT_SIGHTING_SELECTABLE_FIELDS)[number];

export type DocumentSightingDefaultSelectField = (typeof DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS)[number];

export type DocumentSightingEditableField = (typeof DOCUMENT_SIGHTING_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDocumentSightingAsOneRelationConfig = Q.IOneRelationConfig<'documentSighting', DocumentSightingSelectableField>;

export type IDocumentSightingAsManyRelationConfig = Q.IManyRelationConfig<'documentSightings', DocumentSightingSelectableField, DocumentSightingSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDocumentSightingAsOneRelationQuery = Q.IAsOneRelationQuery<IDocumentSighting, DocumentSightingSelectableField>;

export type IDocumentSightingAsManyRelationQuery = Q.IAsManyRelationQuery<IDocumentSighting, DocumentSightingSelectableField, DocumentSightingSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDocumentSightingRelationMap extends Record<DocumentSightingRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDocumentSightingRelationQueries = Q.IBaseRelationQueries<IDocumentSighting, DocumentSightingRelationKey, IDocumentSightingRelationMap>;

export type IDocumentSightingItemQuery = Q.IBaseItemQuery<
  IDocumentSighting,
  DocumentSightingRelationKey,
  DocumentSightingSelectableField,
  DocumentSightingRelationKey,
  DocumentSightingSelectableField,
  IDocumentSightingRelationMap,
  IDocumentSightingRelationQueries
>;

export type IDocumentSightingListQuery = Q.IBaseListQuery<
  IDocumentSighting,
  DocumentSightingRelationKey,
  DocumentSightingSelectableField,
  DocumentSightingSortableField,
  DocumentSightingRelationKey,
  DocumentSightingSelectableField,
  DocumentSightingSortableField,
  DocumentSightingDateRangeField,
  DocumentSightingFilterableField,
  IDocumentSightingRelationMap,
  IDocumentSightingRelationQueries,
  IDocumentSightingItemQuery
>;