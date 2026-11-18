// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SERVICES_RELATION_KEYS,
  SERVICES_SORTABLE_FIELDS,
  SERVICES_SEARCHABLE_FIELDS,
  SERVICES_FILTERABLE_FIELDS,
  SERVICES_DATE_RANGE_FIELDS,
  SERVICES_SELECTABLE_FIELDS,
  SERVICES_DEFAULT_SELECT_FIELDS,
  SERVICES_EDITABLE_FIELDS,
} from "./services.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One provider's service provision at a physical place or geographic coverage unit during a service period. */
export interface IServices extends B.IBase {
  code: string;
  description: string;
  endsOn: Date | null;
  name: string;
  placeFeatureId: string | null;
  providerEntityId: string;
  responsibleInstitutionId: string | null;
  scopeUnitFeatureId: string | null;
  serviceKindId: string;
  sourceCitationId: string | null;
  startsOn: Date | null;
  readonly placeFeature?: FeaturesTypes.IFeatures;
  readonly providerEntity?: EntitiesTypes.IEntities;
  readonly responsibleInstitution?: InstitutionsTypes.IInstitutions;
  readonly scopeUnitFeature?: FeaturesTypes.IFeatures;
  readonly serviceKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ServicesKey = keyof IServices;

export type ServicesRelationKey = (typeof SERVICES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IServicesReadonlyFields = B.IBaseReadonlyFields;

export type IServicesContextualFields = never;

export type IServicesSensitiveFields = never;

export type IServicesTransitionFields = never;

export type IServicesImmutableFields =
  | IServicesReadonlyFields
  | IServicesContextualFields
  | IServicesSensitiveFields
  | IServicesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IServicesCreatable = Omit<IServices, IServicesImmutableFields | ServicesRelationKey>;

export type IServicesSystemWritable = Omit<IServices, B.IBaseReadonlyFields | ServicesRelationKey>;

export type IServicesUpdatable = Partial<
  Omit<IServices, IServicesImmutableFields | ServicesRelationKey>
>;

export interface IServicesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ServicesSortableField = (typeof SERVICES_SORTABLE_FIELDS)[number];

export type ServicesSearchableField = (typeof SERVICES_SEARCHABLE_FIELDS)[number];

export type ServicesFilterableField = (typeof SERVICES_FILTERABLE_FIELDS)[number];

export type ServicesDateRangeField = (typeof SERVICES_DATE_RANGE_FIELDS)[number];

export type ServicesSelectableField = (typeof SERVICES_SELECTABLE_FIELDS)[number];

export type ServicesDefaultSelectField = (typeof SERVICES_DEFAULT_SELECT_FIELDS)[number];

export type ServicesEditableField = (typeof SERVICES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IServicesAsOneRelationConfig = Q.IOneRelationConfig<
  "services",
  ServicesSelectableField
>;

export type IServicesAsManyRelationConfig = Q.IManyRelationConfig<
  "services",
  ServicesSelectableField,
  ServicesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IServicesAsOneRelationQuery = Q.IAsOneRelationQuery<IServices, ServicesSelectableField>;

export type IServicesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IServices,
  ServicesSelectableField,
  ServicesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IServicesRelationMap extends Record<ServicesRelationKey, unknown> {
  placeFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  providerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  responsibleInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  scopeUnitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  serviceKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IServicesRelationQueries = Q.IBaseRelationQueries<
  IServices,
  ServicesRelationKey,
  IServicesRelationMap
>;

export type IServicesItemQuery = Q.IBaseItemQuery<
  IServices,
  ServicesRelationKey,
  ServicesSelectableField,
  ServicesRelationKey,
  ServicesSelectableField,
  IServicesRelationMap,
  IServicesRelationQueries
>;

export type IServicesListQuery = Q.IBaseListQuery<
  IServices,
  ServicesRelationKey,
  ServicesSelectableField,
  ServicesSortableField,
  ServicesRelationKey,
  ServicesSelectableField,
  ServicesSortableField,
  ServicesDateRangeField,
  ServicesFilterableField,
  IServicesRelationMap,
  IServicesRelationQueries,
  IServicesItemQuery
>;
