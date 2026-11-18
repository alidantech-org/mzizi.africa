// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FACILITIES_RELATION_KEYS,
  FACILITIES_SORTABLE_FIELDS,
  FACILITIES_SEARCHABLE_FIELDS,
  FACILITIES_FILTERABLE_FIELDS,
  FACILITIES_DATE_RANGE_FIELDS,
  FACILITIES_SELECTABLE_FIELDS,
  FACILITIES_DEFAULT_SELECT_FIELDS,
  FACILITIES_EDITABLE_FIELDS,
} from "./facilities.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links. */
export interface IFacilities extends B.IBase {
  closedOn: Date | null;
  code: string;
  countryId: string | null;
  facilityClassId: string;
  featureId: string;
  openedOn: Date | null;
  operatorEntityId: string | null;
  ownerEntityId: string | null;
  ownershipId: string | null;
  responsibleInstitutionId: string | null;
  sourceCitationId: string | null;
  statusId: string;
  readonly country?: CountryTypes.ICountry;
  readonly facilityClass?: ValueTypes.IValue;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly operatorEntity?: EntitiesTypes.IEntities;
  readonly ownerEntity?: EntitiesTypes.IEntities;
  readonly ownership?: ValueTypes.IValue;
  readonly responsibleInstitution?: InstitutionsTypes.IInstitutions;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FacilitiesKey = keyof IFacilities;

export type FacilitiesRelationKey = (typeof FACILITIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFacilitiesReadonlyFields = B.IBaseReadonlyFields;

export type IFacilitiesContextualFields = never;

export type IFacilitiesSensitiveFields = never;

export type IFacilitiesTransitionFields = never;

export type IFacilitiesImmutableFields =
  | IFacilitiesReadonlyFields
  | IFacilitiesContextualFields
  | IFacilitiesSensitiveFields
  | IFacilitiesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFacilitiesCreatable = Omit<
  IFacilities,
  IFacilitiesImmutableFields | FacilitiesRelationKey
>;

export type IFacilitiesSystemWritable = Omit<
  IFacilities,
  B.IBaseReadonlyFields | FacilitiesRelationKey
>;

export type IFacilitiesUpdatable = Partial<
  Omit<IFacilities, IFacilitiesImmutableFields | FacilitiesRelationKey>
>;

export interface IFacilitiesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FacilitiesSortableField = (typeof FACILITIES_SORTABLE_FIELDS)[number];

export type FacilitiesSearchableField = (typeof FACILITIES_SEARCHABLE_FIELDS)[number];

export type FacilitiesFilterableField = (typeof FACILITIES_FILTERABLE_FIELDS)[number];

export type FacilitiesDateRangeField = (typeof FACILITIES_DATE_RANGE_FIELDS)[number];

export type FacilitiesSelectableField = (typeof FACILITIES_SELECTABLE_FIELDS)[number];

export type FacilitiesDefaultSelectField = (typeof FACILITIES_DEFAULT_SELECT_FIELDS)[number];

export type FacilitiesEditableField = (typeof FACILITIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFacilitiesAsOneRelationConfig = Q.IOneRelationConfig<
  "facilities",
  FacilitiesSelectableField
>;

export type IFacilitiesAsManyRelationConfig = Q.IManyRelationConfig<
  "facilities",
  FacilitiesSelectableField,
  FacilitiesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFacilitiesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IFacilities,
  FacilitiesSelectableField
>;

export type IFacilitiesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFacilities,
  FacilitiesSelectableField,
  FacilitiesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFacilitiesRelationMap extends Record<FacilitiesRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  facilityClass: ValueTypes.IValueAsOneRelationQuery;
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  operatorEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  ownerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  ownership: ValueTypes.IValueAsOneRelationQuery;
  responsibleInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFacilitiesRelationQueries = Q.IBaseRelationQueries<
  IFacilities,
  FacilitiesRelationKey,
  IFacilitiesRelationMap
>;

export type IFacilitiesItemQuery = Q.IBaseItemQuery<
  IFacilities,
  FacilitiesRelationKey,
  FacilitiesSelectableField,
  FacilitiesRelationKey,
  FacilitiesSelectableField,
  IFacilitiesRelationMap,
  IFacilitiesRelationQueries
>;

export type IFacilitiesListQuery = Q.IBaseListQuery<
  IFacilities,
  FacilitiesRelationKey,
  FacilitiesSelectableField,
  FacilitiesSortableField,
  FacilitiesRelationKey,
  FacilitiesSelectableField,
  FacilitiesSortableField,
  FacilitiesDateRangeField,
  FacilitiesFilterableField,
  IFacilitiesRelationMap,
  IFacilitiesRelationQueries,
  IFacilitiesItemQuery
>;
