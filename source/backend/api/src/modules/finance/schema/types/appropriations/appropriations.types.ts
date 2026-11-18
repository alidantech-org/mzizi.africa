// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetVersionsTypes from "#/modules/finance/schema/types/budget-versions/budget-versions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  APPROPRIATIONS_RELATION_KEYS,
  APPROPRIATIONS_SORTABLE_FIELDS,
  APPROPRIATIONS_SEARCHABLE_FIELDS,
  APPROPRIATIONS_FILTERABLE_FIELDS,
  APPROPRIATIONS_DATE_RANGE_FIELDS,
  APPROPRIATIONS_SELECTABLE_FIELDS,
  APPROPRIATIONS_DEFAULT_SELECT_FIELDS,
  APPROPRIATIONS_EDITABLE_FIELDS,
} from "./appropriations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One classified amount authorized in a budget version, optionally nested and assigned to a project or unit. */
export interface IAppropriations extends B.IBase {
  amountMinorUnits: number;
  budgetVersionId: string;
  classificationId: string;
  code: string;
  currencyId: string;
  parentAppropriationId: string | null;
  projectId: string | null;
  recipientEntityId: string | null;
  sourceCitationId: string | null;
  unitFeatureId: string | null;
  readonly budgetVersion?: BudgetVersionsTypes.IBudgetVersions;
  readonly classification?: ValueTypes.IValue;
  readonly currency?: ValueTypes.IValue;
  readonly parentAppropriation?: IAppropriations;
  readonly project?: ProjectsTypes.IProjects;
  readonly recipientEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly unitFeature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AppropriationsKey = keyof IAppropriations;

export type AppropriationsRelationKey = (typeof APPROPRIATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAppropriationsReadonlyFields = B.IBaseReadonlyFields;

export type IAppropriationsContextualFields = never;

export type IAppropriationsSensitiveFields = never;

export type IAppropriationsTransitionFields = never;

export type IAppropriationsImmutableFields =
  | IAppropriationsReadonlyFields
  | IAppropriationsContextualFields
  | IAppropriationsSensitiveFields
  | IAppropriationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAppropriationsCreatable = Omit<
  IAppropriations,
  IAppropriationsImmutableFields | AppropriationsRelationKey
>;

export type IAppropriationsSystemWritable = Omit<
  IAppropriations,
  B.IBaseReadonlyFields | AppropriationsRelationKey
>;

export type IAppropriationsUpdatable = Partial<
  Omit<IAppropriations, IAppropriationsImmutableFields | AppropriationsRelationKey>
>;

export interface IAppropriationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AppropriationsSortableField = (typeof APPROPRIATIONS_SORTABLE_FIELDS)[number];

export type AppropriationsSearchableField = (typeof APPROPRIATIONS_SEARCHABLE_FIELDS)[number];

export type AppropriationsFilterableField = (typeof APPROPRIATIONS_FILTERABLE_FIELDS)[number];

export type AppropriationsDateRangeField = (typeof APPROPRIATIONS_DATE_RANGE_FIELDS)[number];

export type AppropriationsSelectableField = (typeof APPROPRIATIONS_SELECTABLE_FIELDS)[number];

export type AppropriationsDefaultSelectField =
  (typeof APPROPRIATIONS_DEFAULT_SELECT_FIELDS)[number];

export type AppropriationsEditableField = (typeof APPROPRIATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAppropriationsAsOneRelationConfig = Q.IOneRelationConfig<
  "appropriations",
  AppropriationsSelectableField
>;

export type IAppropriationsAsManyRelationConfig = Q.IManyRelationConfig<
  "appropriations",
  AppropriationsSelectableField,
  AppropriationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAppropriationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IAppropriations,
  AppropriationsSelectableField
>;

export type IAppropriationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAppropriations,
  AppropriationsSelectableField,
  AppropriationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAppropriationsRelationMap extends Record<AppropriationsRelationKey, unknown> {
  budgetVersion: BudgetVersionsTypes.IBudgetVersionsAsOneRelationQuery;
  classification: ValueTypes.IValueAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  parentAppropriation: IAppropriationsAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  recipientEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  unitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAppropriationsRelationQueries = Q.IBaseRelationQueries<
  IAppropriations,
  AppropriationsRelationKey,
  IAppropriationsRelationMap
>;

export type IAppropriationsItemQuery = Q.IBaseItemQuery<
  IAppropriations,
  AppropriationsRelationKey,
  AppropriationsSelectableField,
  AppropriationsRelationKey,
  AppropriationsSelectableField,
  IAppropriationsRelationMap,
  IAppropriationsRelationQueries
>;

export type IAppropriationsListQuery = Q.IBaseListQuery<
  IAppropriations,
  AppropriationsRelationKey,
  AppropriationsSelectableField,
  AppropriationsSortableField,
  AppropriationsRelationKey,
  AppropriationsSelectableField,
  AppropriationsSortableField,
  AppropriationsDateRangeField,
  AppropriationsFilterableField,
  IAppropriationsRelationMap,
  IAppropriationsRelationQueries,
  IAppropriationsItemQuery
>;
