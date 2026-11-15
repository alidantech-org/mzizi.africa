// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as PublishersTypes from "#/modules/source/schema/types/publishers/publishers.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ATTRIBUTIONS_RELATION_KEYS,
  ATTRIBUTIONS_SORTABLE_FIELDS,
  ATTRIBUTIONS_SEARCHABLE_FIELDS,
  ATTRIBUTIONS_FILTERABLE_FIELDS,
  ATTRIBUTIONS_DATE_RANGE_FIELDS,
  ATTRIBUTIONS_SELECTABLE_FIELDS,
  ATTRIBUTIONS_DEFAULT_SELECT_FIELDS,
  ATTRIBUTIONS_EDITABLE_FIELDS,
} from "./attributions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Accepted rights and credit statement tied to exact content and publisher. */
export interface IAttributions extends B.IBase {
  assessedAt: Date;
  assessorSnapshot: string;
  credit: string;
  fileVersionId: string;
  licenseValueId: string | null;
  publisherId: string;
  rightsStatement: string;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly licenseValue?: ValueTypes.IValue;
  readonly publisher?: PublishersTypes.IPublishers;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AttributionsKey = keyof IAttributions;

export type AttributionsRelationKey = (typeof ATTRIBUTIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAttributionsReadonlyFields = B.IBaseReadonlyFields;

export type IAttributionsContextualFields = never;

export type IAttributionsSensitiveFields = never;

export type IAttributionsTransitionFields = never;

export type IAttributionsImmutableFields =
  | IAttributionsReadonlyFields
  | IAttributionsContextualFields
  | IAttributionsSensitiveFields
  | IAttributionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAttributionsCreatable = Omit<
  IAttributions,
  IAttributionsImmutableFields | AttributionsRelationKey
>;

export type IAttributionsSystemWritable = Omit<
  IAttributions,
  B.IBaseReadonlyFields | AttributionsRelationKey
>;

export type IAttributionsUpdatable = Partial<
  Omit<IAttributions, IAttributionsImmutableFields | AttributionsRelationKey>
>;

export interface IAttributionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AttributionsSortableField = (typeof ATTRIBUTIONS_SORTABLE_FIELDS)[number];

export type AttributionsSearchableField = (typeof ATTRIBUTIONS_SEARCHABLE_FIELDS)[number];

export type AttributionsFilterableField = (typeof ATTRIBUTIONS_FILTERABLE_FIELDS)[number];

export type AttributionsDateRangeField = (typeof ATTRIBUTIONS_DATE_RANGE_FIELDS)[number];

export type AttributionsSelectableField = (typeof ATTRIBUTIONS_SELECTABLE_FIELDS)[number];

export type AttributionsDefaultSelectField = (typeof ATTRIBUTIONS_DEFAULT_SELECT_FIELDS)[number];

export type AttributionsEditableField = (typeof ATTRIBUTIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAttributionsAsOneRelationConfig = Q.IOneRelationConfig<
  "attributions",
  AttributionsSelectableField
>;

export type IAttributionsAsManyRelationConfig = Q.IManyRelationConfig<
  "attributions",
  AttributionsSelectableField,
  AttributionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAttributionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IAttributions,
  AttributionsSelectableField
>;

export type IAttributionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAttributions,
  AttributionsSelectableField,
  AttributionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAttributionsRelationMap extends Record<AttributionsRelationKey, unknown> {
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  licenseValue: ValueTypes.IValueAsOneRelationQuery;
  publisher: PublishersTypes.IPublishersAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAttributionsRelationQueries = Q.IBaseRelationQueries<
  IAttributions,
  AttributionsRelationKey,
  IAttributionsRelationMap
>;

export type IAttributionsItemQuery = Q.IBaseItemQuery<
  IAttributions,
  AttributionsRelationKey,
  AttributionsSelectableField,
  AttributionsRelationKey,
  AttributionsSelectableField,
  IAttributionsRelationMap,
  IAttributionsRelationQueries
>;

export type IAttributionsListQuery = Q.IBaseListQuery<
  IAttributions,
  AttributionsRelationKey,
  AttributionsSelectableField,
  AttributionsSortableField,
  AttributionsRelationKey,
  AttributionsSelectableField,
  AttributionsSortableField,
  AttributionsDateRangeField,
  AttributionsFilterableField,
  IAttributionsRelationMap,
  IAttributionsRelationQueries,
  IAttributionsItemQuery
>;
