// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROJECT_FEATURES_RELATION_KEYS,
  PROJECT_FEATURES_SORTABLE_FIELDS,
  PROJECT_FEATURES_SEARCHABLE_FIELDS,
  PROJECT_FEATURES_FILTERABLE_FIELDS,
  PROJECT_FEATURES_DATE_RANGE_FIELDS,
  PROJECT_FEATURES_SELECTABLE_FIELDS,
  PROJECT_FEATURES_DEFAULT_SELECT_FIELDS,
  PROJECT_FEATURES_EDITABLE_FIELDS,
} from "./project-features.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One typed relationship between a Civic project and one Geography feature. */
export interface IProjectFeatures extends B.IBase {
  featureId: string;
  featureKindId: string;
  projectId: string;
  sourceCitationId: string | null;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly featureKind?: ValueTypes.IValue;
  readonly project?: ProjectsTypes.IProjects;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProjectFeaturesKey = keyof IProjectFeatures;

export type ProjectFeaturesRelationKey = (typeof PROJECT_FEATURES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProjectFeaturesReadonlyFields = B.IBaseReadonlyFields;

export type IProjectFeaturesContextualFields = never;

export type IProjectFeaturesSensitiveFields = never;

export type IProjectFeaturesTransitionFields = never;

export type IProjectFeaturesImmutableFields =
  | IProjectFeaturesReadonlyFields
  | IProjectFeaturesContextualFields
  | IProjectFeaturesSensitiveFields
  | IProjectFeaturesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProjectFeaturesCreatable = Omit<
  IProjectFeatures,
  IProjectFeaturesImmutableFields | ProjectFeaturesRelationKey
>;

export type IProjectFeaturesSystemWritable = Omit<
  IProjectFeatures,
  B.IBaseReadonlyFields | ProjectFeaturesRelationKey
>;

export type IProjectFeaturesUpdatable = Partial<
  Omit<IProjectFeatures, IProjectFeaturesImmutableFields | ProjectFeaturesRelationKey>
>;

export interface IProjectFeaturesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProjectFeaturesSortableField = (typeof PROJECT_FEATURES_SORTABLE_FIELDS)[number];

export type ProjectFeaturesSearchableField = (typeof PROJECT_FEATURES_SEARCHABLE_FIELDS)[number];

export type ProjectFeaturesFilterableField = (typeof PROJECT_FEATURES_FILTERABLE_FIELDS)[number];

export type ProjectFeaturesDateRangeField = (typeof PROJECT_FEATURES_DATE_RANGE_FIELDS)[number];

export type ProjectFeaturesSelectableField = (typeof PROJECT_FEATURES_SELECTABLE_FIELDS)[number];

export type ProjectFeaturesDefaultSelectField =
  (typeof PROJECT_FEATURES_DEFAULT_SELECT_FIELDS)[number];

export type ProjectFeaturesEditableField = (typeof PROJECT_FEATURES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProjectFeaturesAsOneRelationConfig = Q.IOneRelationConfig<
  "projectFeatures",
  ProjectFeaturesSelectableField
>;

export type IProjectFeaturesAsManyRelationConfig = Q.IManyRelationConfig<
  "projectFeatures",
  ProjectFeaturesSelectableField,
  ProjectFeaturesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProjectFeaturesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IProjectFeatures,
  ProjectFeaturesSelectableField
>;

export type IProjectFeaturesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProjectFeatures,
  ProjectFeaturesSelectableField,
  ProjectFeaturesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProjectFeaturesRelationMap extends Record<ProjectFeaturesRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  featureKind: ValueTypes.IValueAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProjectFeaturesRelationQueries = Q.IBaseRelationQueries<
  IProjectFeatures,
  ProjectFeaturesRelationKey,
  IProjectFeaturesRelationMap
>;

export type IProjectFeaturesItemQuery = Q.IBaseItemQuery<
  IProjectFeatures,
  ProjectFeaturesRelationKey,
  ProjectFeaturesSelectableField,
  ProjectFeaturesRelationKey,
  ProjectFeaturesSelectableField,
  IProjectFeaturesRelationMap,
  IProjectFeaturesRelationQueries
>;

export type IProjectFeaturesListQuery = Q.IBaseListQuery<
  IProjectFeatures,
  ProjectFeaturesRelationKey,
  ProjectFeaturesSelectableField,
  ProjectFeaturesSortableField,
  ProjectFeaturesRelationKey,
  ProjectFeaturesSelectableField,
  ProjectFeaturesSortableField,
  ProjectFeaturesDateRangeField,
  ProjectFeaturesFilterableField,
  IProjectFeaturesRelationMap,
  IProjectFeaturesRelationQueries,
  IProjectFeaturesItemQuery
>;
