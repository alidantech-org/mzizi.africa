// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CHANGES_RELATION_KEYS,
  CHANGES_SORTABLE_FIELDS,
  CHANGES_SEARCHABLE_FIELDS,
  CHANGES_FILTERABLE_FIELDS,
  CHANGES_DATE_RANGE_FIELDS,
  CHANGES_SELECTABLE_FIELDS,
  CHANGES_DEFAULT_SELECT_FIELDS,
  CHANGES_EDITABLE_FIELDS,
} from "./changes.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities. */
export interface IChanges extends B.IBase {
  changeKindId: string;
  effectiveOn: Date | null;
  explanation: string | null;
  predecessorFeatureId: string | null;
  sourceId: string | null;
  successorFeatureId: string | null;
  transformationId: string;
  readonly changeKind?: ValueTypes.IValue;
  readonly predecessorFeature?: FeaturesTypes.IFeatures;
  readonly source?: SourcesTypes.ISources;
  readonly successorFeature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ChangesKey = keyof IChanges;

export type ChangesRelationKey = (typeof CHANGES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IChangesReadonlyFields = B.IBaseReadonlyFields;

export type IChangesContextualFields = never;

export type IChangesSensitiveFields = never;

export type IChangesTransitionFields = never;

export type IChangesImmutableFields =
  | IChangesReadonlyFields
  | IChangesContextualFields
  | IChangesSensitiveFields
  | IChangesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IChangesCreatable = Omit<IChanges, IChangesImmutableFields | ChangesRelationKey>;

export type IChangesSystemWritable = Omit<IChanges, B.IBaseReadonlyFields | ChangesRelationKey>;

export type IChangesUpdatable = Partial<
  Omit<IChanges, IChangesImmutableFields | ChangesRelationKey>
>;

export interface IChangesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ChangesSortableField = (typeof CHANGES_SORTABLE_FIELDS)[number];

export type ChangesSearchableField = (typeof CHANGES_SEARCHABLE_FIELDS)[number];

export type ChangesFilterableField = (typeof CHANGES_FILTERABLE_FIELDS)[number];

export type ChangesDateRangeField = (typeof CHANGES_DATE_RANGE_FIELDS)[number];

export type ChangesSelectableField = (typeof CHANGES_SELECTABLE_FIELDS)[number];

export type ChangesDefaultSelectField = (typeof CHANGES_DEFAULT_SELECT_FIELDS)[number];

export type ChangesEditableField = (typeof CHANGES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IChangesAsOneRelationConfig = Q.IOneRelationConfig<"changes", ChangesSelectableField>;

export type IChangesAsManyRelationConfig = Q.IManyRelationConfig<
  "changes",
  ChangesSelectableField,
  ChangesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IChangesAsOneRelationQuery = Q.IAsOneRelationQuery<IChanges, ChangesSelectableField>;

export type IChangesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IChanges,
  ChangesSelectableField,
  ChangesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IChangesRelationMap extends Record<ChangesRelationKey, unknown> {
  changeKind: ValueTypes.IValueAsOneRelationQuery;
  predecessorFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
  successorFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IChangesRelationQueries = Q.IBaseRelationQueries<
  IChanges,
  ChangesRelationKey,
  IChangesRelationMap
>;

export type IChangesItemQuery = Q.IBaseItemQuery<
  IChanges,
  ChangesRelationKey,
  ChangesSelectableField,
  ChangesRelationKey,
  ChangesSelectableField,
  IChangesRelationMap,
  IChangesRelationQueries
>;

export type IChangesListQuery = Q.IBaseListQuery<
  IChanges,
  ChangesRelationKey,
  ChangesSelectableField,
  ChangesSortableField,
  ChangesRelationKey,
  ChangesSelectableField,
  ChangesSortableField,
  ChangesDateRangeField,
  ChangesFilterableField,
  IChangesRelationMap,
  IChangesRelationQueries,
  IChangesItemQuery
>;
