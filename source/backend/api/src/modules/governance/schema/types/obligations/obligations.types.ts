// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OBLIGATIONS_RELATION_KEYS,
  OBLIGATIONS_SORTABLE_FIELDS,
  OBLIGATIONS_SEARCHABLE_FIELDS,
  OBLIGATIONS_FILTERABLE_FIELDS,
  OBLIGATIONS_DATE_RANGE_FIELDS,
  OBLIGATIONS_SELECTABLE_FIELDS,
  OBLIGATIONS_DEFAULT_SELECT_FIELDS,
  OBLIGATIONS_EDITABLE_FIELDS,
} from "./obligations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report. */
export interface IObligations extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  countryId: string;
  description: string;
  frequencyId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  obligationKindId: string;
  obligorInstitutionId: string | null;
  obligorKindId: string | null;
  recipientEntityId: string | null;
  sourceCitationId: string | null;
  toYear: number | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly country?: CountryTypes.ICountry;
  readonly frequency?: ValueTypes.IValue;
  readonly obligationKind?: ValueTypes.IValue;
  readonly obligorInstitution?: InstitutionsTypes.IInstitutions;
  readonly obligorKind?: ValueTypes.IValue;
  readonly recipientEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ObligationsKey = keyof IObligations;

export type ObligationsRelationKey = (typeof OBLIGATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IObligationsReadonlyFields = B.IBaseReadonlyFields;

export type IObligationsContextualFields = never;

export type IObligationsSensitiveFields = never;

export type IObligationsTransitionFields = never;

export type IObligationsImmutableFields =
  | IObligationsReadonlyFields
  | IObligationsContextualFields
  | IObligationsSensitiveFields
  | IObligationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IObligationsCreatable = Omit<
  IObligations,
  IObligationsImmutableFields | ObligationsRelationKey
>;

export type IObligationsSystemWritable = Omit<
  IObligations,
  B.IBaseReadonlyFields | ObligationsRelationKey
>;

export type IObligationsUpdatable = Partial<
  Omit<IObligations, IObligationsImmutableFields | ObligationsRelationKey>
>;

export interface IObligationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ObligationsSortableField = (typeof OBLIGATIONS_SORTABLE_FIELDS)[number];

export type ObligationsSearchableField = (typeof OBLIGATIONS_SEARCHABLE_FIELDS)[number];

export type ObligationsFilterableField = (typeof OBLIGATIONS_FILTERABLE_FIELDS)[number];

export type ObligationsDateRangeField = (typeof OBLIGATIONS_DATE_RANGE_FIELDS)[number];

export type ObligationsSelectableField = (typeof OBLIGATIONS_SELECTABLE_FIELDS)[number];

export type ObligationsDefaultSelectField = (typeof OBLIGATIONS_DEFAULT_SELECT_FIELDS)[number];

export type ObligationsEditableField = (typeof OBLIGATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IObligationsAsOneRelationConfig = Q.IOneRelationConfig<
  "obligations",
  ObligationsSelectableField
>;

export type IObligationsAsManyRelationConfig = Q.IManyRelationConfig<
  "obligations",
  ObligationsSelectableField,
  ObligationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IObligationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IObligations,
  ObligationsSelectableField
>;

export type IObligationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IObligations,
  ObligationsSelectableField,
  ObligationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IObligationsRelationMap extends Record<ObligationsRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  frequency: ValueTypes.IValueAsOneRelationQuery;
  obligationKind: ValueTypes.IValueAsOneRelationQuery;
  obligorInstitution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  obligorKind: ValueTypes.IValueAsOneRelationQuery;
  recipientEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IObligationsRelationQueries = Q.IBaseRelationQueries<
  IObligations,
  ObligationsRelationKey,
  IObligationsRelationMap
>;

export type IObligationsItemQuery = Q.IBaseItemQuery<
  IObligations,
  ObligationsRelationKey,
  ObligationsSelectableField,
  ObligationsRelationKey,
  ObligationsSelectableField,
  IObligationsRelationMap,
  IObligationsRelationQueries
>;

export type IObligationsListQuery = Q.IBaseListQuery<
  IObligations,
  ObligationsRelationKey,
  ObligationsSelectableField,
  ObligationsSortableField,
  ObligationsRelationKey,
  ObligationsSelectableField,
  ObligationsSortableField,
  ObligationsDateRangeField,
  ObligationsFilterableField,
  IObligationsRelationMap,
  IObligationsRelationQueries,
  IObligationsItemQuery
>;
