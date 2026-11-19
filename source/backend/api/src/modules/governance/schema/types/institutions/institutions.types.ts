// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INSTITUTIONS_RELATION_KEYS,
  INSTITUTIONS_SORTABLE_FIELDS,
  INSTITUTIONS_SEARCHABLE_FIELDS,
  INSTITUTIONS_FILTERABLE_FIELDS,
  INSTITUTIONS_DATE_RANGE_FIELDS,
  INSTITUTIONS_SELECTABLE_FIELDS,
  INSTITUTIONS_DEFAULT_SELECT_FIELDS,
  INSTITUTIONS_EDITABLE_FIELDS,
} from "./institutions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One government institution specialization of an Official entity. */
export interface IInstitutions extends B.IBase {
  armId: string | null;
  classId: string | null;
  code: string;
  countryId: string;
  dissolvedOn: Date | null;
  entityId: string;
  establishedOn: Date | null;
  establishmentBasisId: string | null;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  institutionKindId: string;
  sourceCitationId: string | null;
  toYear: number | null;
  readonly arm?: ValueTypes.IValue;
  readonly class?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly entity?: EntitiesTypes.IEntities;
  readonly establishmentBasis?: ValueTypes.IValue;
  readonly institutionKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InstitutionsKey = keyof IInstitutions;

export type InstitutionsRelationKey = (typeof INSTITUTIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInstitutionsReadonlyFields = B.IBaseReadonlyFields;

export type IInstitutionsContextualFields = never;

export type IInstitutionsSensitiveFields = never;

export type IInstitutionsTransitionFields = never;

export type IInstitutionsImmutableFields =
  | IInstitutionsReadonlyFields
  | IInstitutionsContextualFields
  | IInstitutionsSensitiveFields
  | IInstitutionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInstitutionsCreatable = Omit<
  IInstitutions,
  IInstitutionsImmutableFields | InstitutionsRelationKey
>;

export type IInstitutionsSystemWritable = Omit<
  IInstitutions,
  B.IBaseReadonlyFields | InstitutionsRelationKey
>;

export type IInstitutionsUpdatable = Partial<
  Omit<IInstitutions, IInstitutionsImmutableFields | InstitutionsRelationKey>
>;

export interface IInstitutionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InstitutionsSortableField = (typeof INSTITUTIONS_SORTABLE_FIELDS)[number];

export type InstitutionsSearchableField = (typeof INSTITUTIONS_SEARCHABLE_FIELDS)[number];

export type InstitutionsFilterableField = (typeof INSTITUTIONS_FILTERABLE_FIELDS)[number];

export type InstitutionsDateRangeField = (typeof INSTITUTIONS_DATE_RANGE_FIELDS)[number];

export type InstitutionsSelectableField = (typeof INSTITUTIONS_SELECTABLE_FIELDS)[number];

export type InstitutionsDefaultSelectField = (typeof INSTITUTIONS_DEFAULT_SELECT_FIELDS)[number];

export type InstitutionsEditableField = (typeof INSTITUTIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInstitutionsAsOneRelationConfig = Q.IOneRelationConfig<
  "institutions",
  InstitutionsSelectableField
>;

export type IInstitutionsAsManyRelationConfig = Q.IManyRelationConfig<
  "institutions",
  InstitutionsSelectableField,
  InstitutionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInstitutionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IInstitutions,
  InstitutionsSelectableField
>;

export type IInstitutionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IInstitutions,
  InstitutionsSelectableField,
  InstitutionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInstitutionsRelationMap extends Record<InstitutionsRelationKey, unknown> {
  arm: ValueTypes.IValueAsOneRelationQuery;
  class: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  establishmentBasis: ValueTypes.IValueAsOneRelationQuery;
  institutionKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInstitutionsRelationQueries = Q.IBaseRelationQueries<
  IInstitutions,
  InstitutionsRelationKey,
  IInstitutionsRelationMap
>;

export type IInstitutionsItemQuery = Q.IBaseItemQuery<
  IInstitutions,
  InstitutionsRelationKey,
  InstitutionsSelectableField,
  InstitutionsRelationKey,
  InstitutionsSelectableField,
  IInstitutionsRelationMap,
  IInstitutionsRelationQueries
>;

export type IInstitutionsListQuery = Q.IBaseListQuery<
  IInstitutions,
  InstitutionsRelationKey,
  InstitutionsSelectableField,
  InstitutionsSortableField,
  InstitutionsRelationKey,
  InstitutionsSelectableField,
  InstitutionsSortableField,
  InstitutionsDateRangeField,
  InstitutionsFilterableField,
  IInstitutionsRelationMap,
  IInstitutionsRelationQueries,
  IInstitutionsItemQuery
>;
