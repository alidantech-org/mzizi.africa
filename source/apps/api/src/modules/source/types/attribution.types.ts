// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { AttributionRelation } from '#/types/source/attribution-relation.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DocumentTypes from '#/modules/source/types/document.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ATTRIBUTION_RELATION_KEYS,
  ATTRIBUTION_SORTABLE_FIELDS,
  ATTRIBUTION_SEARCHABLE_FIELDS,
  ATTRIBUTION_FILTERABLE_FIELDS,
  ATTRIBUTION_DATE_RANGE_FIELDS,
  ATTRIBUTION_SELECTABLE_FIELDS,
  ATTRIBUTION_DEFAULT_SELECT_FIELDS,
  ATTRIBUTION_EDITABLE_FIELDS
} from './attribution.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Attribution */
export interface IAttribution extends B.IBase {
  attributedBy: string | null;
  captureId: string | null;
  confidence: number | null;
  documentId: string;
  locator: string | null;
  methodId: string;
  relation: AttributionRelation;
  targetField: string | null;
  targetId: string;
  targetKind: string;
  readonly document?: DocumentTypes.IDocument;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AttributionKey = keyof IAttribution;

export type AttributionRelationKey = (typeof ATTRIBUTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAttributionReadonlyFields = B.IBaseReadonlyFields;

export type IAttributionContextualFields = never;

export type IAttributionSensitiveFields = never;

export type IAttributionTransitionFields = never;

export type IAttributionImmutableFields =
  | IAttributionReadonlyFields
  | IAttributionContextualFields
  | IAttributionSensitiveFields
  | IAttributionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAttributionCreatable = Omit<IAttribution, IAttributionImmutableFields | AttributionRelationKey>;

export type IAttributionSystemWritable = Omit<IAttribution, B.IBaseReadonlyFields | AttributionRelationKey>;

export type IAttributionUpdatable = Partial<Omit<IAttribution, IAttributionImmutableFields | AttributionRelationKey>>;

export interface IAttributionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AttributionSortableField = (typeof ATTRIBUTION_SORTABLE_FIELDS)[number];

export type AttributionSearchableField = (typeof ATTRIBUTION_SEARCHABLE_FIELDS)[number];

export type AttributionFilterableField = (typeof ATTRIBUTION_FILTERABLE_FIELDS)[number];

export type AttributionDateRangeField = (typeof ATTRIBUTION_DATE_RANGE_FIELDS)[number];

export type AttributionSelectableField = (typeof ATTRIBUTION_SELECTABLE_FIELDS)[number];

export type AttributionDefaultSelectField = (typeof ATTRIBUTION_DEFAULT_SELECT_FIELDS)[number];

export type AttributionEditableField = (typeof ATTRIBUTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAttributionAsOneRelationConfig = Q.IOneRelationConfig<'attribution', AttributionSelectableField>;

export type IAttributionAsManyRelationConfig = Q.IManyRelationConfig<'attributions', AttributionSelectableField, AttributionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAttributionAsOneRelationQuery = Q.IAsOneRelationQuery<IAttribution, AttributionSelectableField>;

export type IAttributionAsManyRelationQuery = Q.IAsManyRelationQuery<IAttribution, AttributionSelectableField, AttributionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAttributionRelationMap extends Record<AttributionRelationKey, unknown> {
  document: DocumentTypes.IDocumentAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAttributionRelationQueries = Q.IBaseRelationQueries<IAttribution, AttributionRelationKey, IAttributionRelationMap>;

export type IAttributionItemQuery = Q.IBaseItemQuery<
  IAttribution,
  AttributionRelationKey,
  AttributionSelectableField,
  AttributionRelationKey,
  AttributionSelectableField,
  IAttributionRelationMap,
  IAttributionRelationQueries
>;

export type IAttributionListQuery = Q.IBaseListQuery<
  IAttribution,
  AttributionRelationKey,
  AttributionSelectableField,
  AttributionSortableField,
  AttributionRelationKey,
  AttributionSelectableField,
  AttributionSortableField,
  AttributionDateRangeField,
  AttributionFilterableField,
  IAttributionRelationMap,
  IAttributionRelationQueries,
  IAttributionItemQuery
>;