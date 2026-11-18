// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as HoldersTypes from "#/modules/governance/schema/types/holders/holders.types";
import type * as TermsTypes from "#/modules/governance/schema/types/terms/terms.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BILLS_RELATION_KEYS,
  BILLS_SORTABLE_FIELDS,
  BILLS_SEARCHABLE_FIELDS,
  BILLS_FILTERABLE_FIELDS,
  BILLS_DATE_RANGE_FIELDS,
  BILLS_SELECTABLE_FIELDS,
  BILLS_DEFAULT_SELECT_FIELDS,
  BILLS_EDITABLE_FIELDS,
} from "./bills.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument. */
export interface IBills extends B.IBase {
  billKindId: string;
  code: string;
  countryId: string;
  institutionId: string;
  instrumentId: string | null;
  sourceCitationId: string | null;
  sponsorHolderId: string | null;
  statusId: string;
  summary: string | null;
  termId: string | null;
  title: string;
  readonly billKind?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly instrument?: InstrumentsTypes.IInstruments;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly sponsorHolder?: HoldersTypes.IHolders;
  readonly status?: ValueTypes.IValue;
  readonly term?: TermsTypes.ITerms;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BillsKey = keyof IBills;

export type BillsRelationKey = (typeof BILLS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBillsReadonlyFields = B.IBaseReadonlyFields;

export type IBillsContextualFields = never;

export type IBillsSensitiveFields = never;

export type IBillsTransitionFields = never;

export type IBillsImmutableFields =
  IBillsReadonlyFields | IBillsContextualFields | IBillsSensitiveFields | IBillsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBillsCreatable = Omit<IBills, IBillsImmutableFields | BillsRelationKey>;

export type IBillsSystemWritable = Omit<IBills, B.IBaseReadonlyFields | BillsRelationKey>;

export type IBillsUpdatable = Partial<Omit<IBills, IBillsImmutableFields | BillsRelationKey>>;

export interface IBillsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BillsSortableField = (typeof BILLS_SORTABLE_FIELDS)[number];

export type BillsSearchableField = (typeof BILLS_SEARCHABLE_FIELDS)[number];

export type BillsFilterableField = (typeof BILLS_FILTERABLE_FIELDS)[number];

export type BillsDateRangeField = (typeof BILLS_DATE_RANGE_FIELDS)[number];

export type BillsSelectableField = (typeof BILLS_SELECTABLE_FIELDS)[number];

export type BillsDefaultSelectField = (typeof BILLS_DEFAULT_SELECT_FIELDS)[number];

export type BillsEditableField = (typeof BILLS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBillsAsOneRelationConfig = Q.IOneRelationConfig<"bills", BillsSelectableField>;

export type IBillsAsManyRelationConfig = Q.IManyRelationConfig<
  "bills",
  BillsSelectableField,
  BillsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBillsAsOneRelationQuery = Q.IAsOneRelationQuery<IBills, BillsSelectableField>;

export type IBillsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBills,
  BillsSelectableField,
  BillsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBillsRelationMap extends Record<BillsRelationKey, unknown> {
  billKind: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  instrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  sponsorHolder: HoldersTypes.IHoldersAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
  term: TermsTypes.ITermsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBillsRelationQueries = Q.IBaseRelationQueries<
  IBills,
  BillsRelationKey,
  IBillsRelationMap
>;

export type IBillsItemQuery = Q.IBaseItemQuery<
  IBills,
  BillsRelationKey,
  BillsSelectableField,
  BillsRelationKey,
  BillsSelectableField,
  IBillsRelationMap,
  IBillsRelationQueries
>;

export type IBillsListQuery = Q.IBaseListQuery<
  IBills,
  BillsRelationKey,
  BillsSelectableField,
  BillsSortableField,
  BillsRelationKey,
  BillsSelectableField,
  BillsSortableField,
  BillsDateRangeField,
  BillsFilterableField,
  IBillsRelationMap,
  IBillsRelationQueries,
  IBillsItemQuery
>;
