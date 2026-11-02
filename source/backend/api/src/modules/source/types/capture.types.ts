// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DocumentTypes from '#/modules/source/types/document.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CAPTURE_RELATION_KEYS,
  CAPTURE_SORTABLE_FIELDS,
  CAPTURE_SEARCHABLE_FIELDS,
  CAPTURE_FILTERABLE_FIELDS,
  CAPTURE_DATE_RANGE_FIELDS,
  CAPTURE_SELECTABLE_FIELDS,
  CAPTURE_DEFAULT_SELECT_FIELDS,
  CAPTURE_EDITABLE_FIELDS
} from './capture.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Capture */
export interface ICapture extends B.IBase {
  assessmentId: string | null;
  contentHash: string | null;
  documentId: string;
  domainId: string | null;
  familyVersionId: string | null;
  fileVersionId: string | null;
  httpStatus: number | null;
  retrievedAt: Date;
  retrievedBy: string | null;
  retrievedUrl: string | null;
  siteId: string | null;
  structureVersionId: string | null;
  tool: string | null;
  readonly document?: DocumentTypes.IDocument;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CaptureKey = keyof ICapture;

export type CaptureRelationKey = (typeof CAPTURE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICaptureReadonlyFields = B.IBaseReadonlyFields;

export type ICaptureContextualFields = never;

export type ICaptureSensitiveFields = never;

export type ICaptureTransitionFields = never;

export type ICaptureImmutableFields =
  | ICaptureReadonlyFields
  | ICaptureContextualFields
  | ICaptureSensitiveFields
  | ICaptureTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICaptureCreatable = Omit<ICapture, ICaptureImmutableFields | CaptureRelationKey>;

export type ICaptureSystemWritable = Omit<ICapture, B.IBaseReadonlyFields | CaptureRelationKey>;

export type ICaptureUpdatable = Partial<Omit<ICapture, ICaptureImmutableFields | CaptureRelationKey>>;

export interface ICaptureTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CaptureSortableField = (typeof CAPTURE_SORTABLE_FIELDS)[number];

export type CaptureSearchableField = (typeof CAPTURE_SEARCHABLE_FIELDS)[number];

export type CaptureFilterableField = (typeof CAPTURE_FILTERABLE_FIELDS)[number];

export type CaptureDateRangeField = (typeof CAPTURE_DATE_RANGE_FIELDS)[number];

export type CaptureSelectableField = (typeof CAPTURE_SELECTABLE_FIELDS)[number];

export type CaptureDefaultSelectField = (typeof CAPTURE_DEFAULT_SELECT_FIELDS)[number];

export type CaptureEditableField = (typeof CAPTURE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICaptureAsOneRelationConfig = Q.IOneRelationConfig<'capture', CaptureSelectableField>;

export type ICaptureAsManyRelationConfig = Q.IManyRelationConfig<'captures', CaptureSelectableField, CaptureSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICaptureAsOneRelationQuery = Q.IAsOneRelationQuery<ICapture, CaptureSelectableField>;

export type ICaptureAsManyRelationQuery = Q.IAsManyRelationQuery<ICapture, CaptureSelectableField, CaptureSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICaptureRelationMap extends Record<CaptureRelationKey, unknown> {
  document: DocumentTypes.IDocumentAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICaptureRelationQueries = Q.IBaseRelationQueries<ICapture, CaptureRelationKey, ICaptureRelationMap>;

export type ICaptureItemQuery = Q.IBaseItemQuery<
  ICapture,
  CaptureRelationKey,
  CaptureSelectableField,
  CaptureRelationKey,
  CaptureSelectableField,
  ICaptureRelationMap,
  ICaptureRelationQueries
>;

export type ICaptureListQuery = Q.IBaseListQuery<
  ICapture,
  CaptureRelationKey,
  CaptureSelectableField,
  CaptureSortableField,
  CaptureRelationKey,
  CaptureSelectableField,
  CaptureSortableField,
  CaptureDateRangeField,
  CaptureFilterableField,
  ICaptureRelationMap,
  ICaptureRelationQueries,
  ICaptureItemQuery
>;