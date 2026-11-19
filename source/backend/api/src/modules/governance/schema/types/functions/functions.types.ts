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
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as TopicTypes from "#/modules/reference/schema/types/topic/topic.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FUNCTIONS_RELATION_KEYS,
  FUNCTIONS_SORTABLE_FIELDS,
  FUNCTIONS_SEARCHABLE_FIELDS,
  FUNCTIONS_FILTERABLE_FIELDS,
  FUNCTIONS_DATE_RANGE_FIELDS,
  FUNCTIONS_SELECTABLE_FIELDS,
  FUNCTIONS_DEFAULT_SELECT_FIELDS,
  FUNCTIONS_EDITABLE_FIELDS,
} from "./functions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A public function that a constitution or law assigns to a level of government. Its name and plain wording are copy keyed by code. */
export interface IFunctions extends B.IBase {
  basisProvisionId: string | null;
  code: string;
  countryId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  parentFunctionId: string | null;
  sourceCitationId: string | null;
  toYear: number | null;
  topicId: string | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly country?: CountryTypes.ICountry;
  readonly parentFunction?: IFunctions;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly topic?: TopicTypes.ITopic;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FunctionsKey = keyof IFunctions;

export type FunctionsRelationKey = (typeof FUNCTIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFunctionsReadonlyFields = B.IBaseReadonlyFields;

export type IFunctionsContextualFields = never;

export type IFunctionsSensitiveFields = never;

export type IFunctionsTransitionFields = never;

export type IFunctionsImmutableFields =
  | IFunctionsReadonlyFields
  | IFunctionsContextualFields
  | IFunctionsSensitiveFields
  | IFunctionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFunctionsCreatable = Omit<
  IFunctions,
  IFunctionsImmutableFields | FunctionsRelationKey
>;

export type IFunctionsSystemWritable = Omit<
  IFunctions,
  B.IBaseReadonlyFields | FunctionsRelationKey
>;

export type IFunctionsUpdatable = Partial<
  Omit<IFunctions, IFunctionsImmutableFields | FunctionsRelationKey>
>;

export interface IFunctionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FunctionsSortableField = (typeof FUNCTIONS_SORTABLE_FIELDS)[number];

export type FunctionsSearchableField = (typeof FUNCTIONS_SEARCHABLE_FIELDS)[number];

export type FunctionsFilterableField = (typeof FUNCTIONS_FILTERABLE_FIELDS)[number];

export type FunctionsDateRangeField = (typeof FUNCTIONS_DATE_RANGE_FIELDS)[number];

export type FunctionsSelectableField = (typeof FUNCTIONS_SELECTABLE_FIELDS)[number];

export type FunctionsDefaultSelectField = (typeof FUNCTIONS_DEFAULT_SELECT_FIELDS)[number];

export type FunctionsEditableField = (typeof FUNCTIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFunctionsAsOneRelationConfig = Q.IOneRelationConfig<
  "functions",
  FunctionsSelectableField
>;

export type IFunctionsAsManyRelationConfig = Q.IManyRelationConfig<
  "functions",
  FunctionsSelectableField,
  FunctionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFunctionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IFunctions,
  FunctionsSelectableField
>;

export type IFunctionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFunctions,
  FunctionsSelectableField,
  FunctionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFunctionsRelationMap extends Record<FunctionsRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  parentFunction: IFunctionsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  topic: TopicTypes.ITopicAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFunctionsRelationQueries = Q.IBaseRelationQueries<
  IFunctions,
  FunctionsRelationKey,
  IFunctionsRelationMap
>;

export type IFunctionsItemQuery = Q.IBaseItemQuery<
  IFunctions,
  FunctionsRelationKey,
  FunctionsSelectableField,
  FunctionsRelationKey,
  FunctionsSelectableField,
  IFunctionsRelationMap,
  IFunctionsRelationQueries
>;

export type IFunctionsListQuery = Q.IBaseListQuery<
  IFunctions,
  FunctionsRelationKey,
  FunctionsSelectableField,
  FunctionsSortableField,
  FunctionsRelationKey,
  FunctionsSelectableField,
  FunctionsSortableField,
  FunctionsDateRangeField,
  FunctionsFilterableField,
  IFunctionsRelationMap,
  IFunctionsRelationQueries,
  IFunctionsItemQuery
>;
