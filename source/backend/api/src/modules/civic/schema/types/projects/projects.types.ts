// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROJECTS_RELATION_KEYS,
  PROJECTS_SORTABLE_FIELDS,
  PROJECTS_SEARCHABLE_FIELDS,
  PROJECTS_FILTERABLE_FIELDS,
  PROJECTS_DATE_RANGE_FIELDS,
  PROJECTS_SELECTABLE_FIELDS,
  PROJECTS_DEFAULT_SELECT_FIELDS,
  PROJECTS_EDITABLE_FIELDS,
} from "./projects.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One public development or infrastructure project with responsible institution, status, geographic scope and evidence. */
export interface IProjects extends B.IBase {
  code: string;
  completedOn: Date | null;
  countryId: string | null;
  description: string;
  implementingEntityId: string | null;
  location: unknown | null;
  name: string;
  responsibleInstitutionId: string | null;
  scopeUnitFeatureId: string | null;
  sourceCitationId: string | null;
  sponsorEntityId: string | null;
  startedOn: Date | null;
  statusId: string;
  readonly country?: CountryTypes.ICountry;
  readonly implementingEntity?: EntitiesTypes.IEntities;
  readonly responsibleInstitution?: InstitutionsTypes.IInstitutions;
  readonly scopeUnitFeature?: FeaturesTypes.IFeatures;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly sponsorEntity?: EntitiesTypes.IEntities;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProjectsKey = keyof IProjects;

export type ProjectsRelationKey = (typeof PROJECTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProjectsReadonlyFields = B.IBaseReadonlyFields;

export type IProjectsContextualFields = never;

export type IProjectsSensitiveFields = never;

export type IProjectsTransitionFields = never;

export type IProjectsImmutableFields =
  | IProjectsReadonlyFields
  | IProjectsContextualFields
  | IProjectsSensitiveFields
  | IProjectsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProjectsCreatable = Omit<IProjects, IProjectsImmutableFields | ProjectsRelationKey>;

export type IProjectsSystemWritable = Omit<IProjects, B.IBaseReadonlyFields | ProjectsRelationKey>;

export type IProjectsUpdatable = Partial<
  Omit<IProjects, IProjectsImmutableFields | ProjectsRelationKey>
>;

export interface IProjectsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProjectsSortableField = (typeof PROJECTS_SORTABLE_FIELDS)[number];

export type ProjectsSearchableField = (typeof PROJECTS_SEARCHABLE_FIELDS)[number];

export type ProjectsFilterableField = (typeof PROJECTS_FILTERABLE_FIELDS)[number];

export type ProjectsDateRangeField = (typeof PROJECTS_DATE_RANGE_FIELDS)[number];

export type ProjectsSelectableField = (typeof PROJECTS_SELECTABLE_FIELDS)[number];

export type ProjectsDefaultSelectField = (typeof PROJECTS_DEFAULT_SELECT_FIELDS)[number];

export type ProjectsEditableField = (typeof PROJECTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProjectsAsOneRelationConfig = Q.IOneRelationConfig<
  "projects",
  ProjectsSelectableField
>;

export type IProjectsAsManyRelationConfig = Q.IManyRelationConfig<
  "projects",
  ProjectsSelectableField,
  ProjectsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProjectsAsOneRelationQuery = Q.IAsOneRelationQuery<IProjects, ProjectsSelectableField>;

export type IProjectsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProjects,
  ProjectsSelectableField,
  ProjectsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProjectsRelationMap extends Record<ProjectsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  implementingEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  responsibleInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  scopeUnitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  sponsorEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProjectsRelationQueries = Q.IBaseRelationQueries<
  IProjects,
  ProjectsRelationKey,
  IProjectsRelationMap
>;

export type IProjectsItemQuery = Q.IBaseItemQuery<
  IProjects,
  ProjectsRelationKey,
  ProjectsSelectableField,
  ProjectsRelationKey,
  ProjectsSelectableField,
  IProjectsRelationMap,
  IProjectsRelationQueries
>;

export type IProjectsListQuery = Q.IBaseListQuery<
  IProjects,
  ProjectsRelationKey,
  ProjectsSelectableField,
  ProjectsSortableField,
  ProjectsRelationKey,
  ProjectsSelectableField,
  ProjectsSortableField,
  ProjectsDateRangeField,
  ProjectsFilterableField,
  IProjectsRelationMap,
  IProjectsRelationQueries,
  IProjectsItemQuery
>;
