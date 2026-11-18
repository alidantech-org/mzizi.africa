// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROCUREMENTS_RELATION_KEYS,
  PROCUREMENTS_SORTABLE_FIELDS,
  PROCUREMENTS_SEARCHABLE_FIELDS,
  PROCUREMENTS_FILTERABLE_FIELDS,
  PROCUREMENTS_DATE_RANGE_FIELDS,
  PROCUREMENTS_SELECTABLE_FIELDS,
  PROCUREMENTS_DEFAULT_SELECT_FIELDS,
  PROCUREMENTS_EDITABLE_FIELDS,
} from "./procurements.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One public procurement process run by a buyer, optionally linked to a project. */
export interface IProcurements extends B.IBase {
  awardedOn: Date | null;
  buyerEntityId: string;
  categoryId: string | null;
  closesOn: Date | null;
  code: string;
  countryId: string | null;
  natureId: string | null;
  procedureKindId: string;
  projectId: string | null;
  publishedOn: Date | null;
  reference: string | null;
  sourceCitationId: string | null;
  statusId: string | null;
  title: string | null;
  readonly buyerEntity?: EntitiesTypes.IEntities;
  readonly category?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly nature?: ValueTypes.IValue;
  readonly procedureKind?: ValueTypes.IValue;
  readonly project?: ProjectsTypes.IProjects;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProcurementsKey = keyof IProcurements;

export type ProcurementsRelationKey = (typeof PROCUREMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProcurementsReadonlyFields = B.IBaseReadonlyFields;

export type IProcurementsContextualFields = never;

export type IProcurementsSensitiveFields = never;

export type IProcurementsTransitionFields = never;

export type IProcurementsImmutableFields =
  | IProcurementsReadonlyFields
  | IProcurementsContextualFields
  | IProcurementsSensitiveFields
  | IProcurementsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProcurementsCreatable = Omit<
  IProcurements,
  IProcurementsImmutableFields | ProcurementsRelationKey
>;

export type IProcurementsSystemWritable = Omit<
  IProcurements,
  B.IBaseReadonlyFields | ProcurementsRelationKey
>;

export type IProcurementsUpdatable = Partial<
  Omit<IProcurements, IProcurementsImmutableFields | ProcurementsRelationKey>
>;

export interface IProcurementsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProcurementsSortableField = (typeof PROCUREMENTS_SORTABLE_FIELDS)[number];

export type ProcurementsSearchableField = (typeof PROCUREMENTS_SEARCHABLE_FIELDS)[number];

export type ProcurementsFilterableField = (typeof PROCUREMENTS_FILTERABLE_FIELDS)[number];

export type ProcurementsDateRangeField = (typeof PROCUREMENTS_DATE_RANGE_FIELDS)[number];

export type ProcurementsSelectableField = (typeof PROCUREMENTS_SELECTABLE_FIELDS)[number];

export type ProcurementsDefaultSelectField = (typeof PROCUREMENTS_DEFAULT_SELECT_FIELDS)[number];

export type ProcurementsEditableField = (typeof PROCUREMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProcurementsAsOneRelationConfig = Q.IOneRelationConfig<
  "procurements",
  ProcurementsSelectableField
>;

export type IProcurementsAsManyRelationConfig = Q.IManyRelationConfig<
  "procurements",
  ProcurementsSelectableField,
  ProcurementsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProcurementsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IProcurements,
  ProcurementsSelectableField
>;

export type IProcurementsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProcurements,
  ProcurementsSelectableField,
  ProcurementsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProcurementsRelationMap extends Record<ProcurementsRelationKey, unknown> {
  buyerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  category: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  nature: ValueTypes.IValueAsOneRelationQuery;
  procedureKind: ValueTypes.IValueAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProcurementsRelationQueries = Q.IBaseRelationQueries<
  IProcurements,
  ProcurementsRelationKey,
  IProcurementsRelationMap
>;

export type IProcurementsItemQuery = Q.IBaseItemQuery<
  IProcurements,
  ProcurementsRelationKey,
  ProcurementsSelectableField,
  ProcurementsRelationKey,
  ProcurementsSelectableField,
  IProcurementsRelationMap,
  IProcurementsRelationQueries
>;

export type IProcurementsListQuery = Q.IBaseListQuery<
  IProcurements,
  ProcurementsRelationKey,
  ProcurementsSelectableField,
  ProcurementsSortableField,
  ProcurementsRelationKey,
  ProcurementsSelectableField,
  ProcurementsSortableField,
  ProcurementsDateRangeField,
  ProcurementsFilterableField,
  IProcurementsRelationMap,
  IProcurementsRelationQueries,
  IProcurementsItemQuery
>;
