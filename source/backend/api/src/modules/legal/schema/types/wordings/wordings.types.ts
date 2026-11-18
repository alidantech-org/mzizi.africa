// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as EditionsTypes from "#/modules/legal/schema/types/editions/editions.types";
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  WORDINGS_RELATION_KEYS,
  WORDINGS_SORTABLE_FIELDS,
  WORDINGS_SEARCHABLE_FIELDS,
  WORDINGS_FILTERABLE_FIELDS,
  WORDINGS_DATE_RANGE_FIELDS,
  WORDINGS_SELECTABLE_FIELDS,
  WORDINGS_DEFAULT_SELECT_FIELDS,
  WORDINGS_EDITABLE_FIELDS,
} from "./wordings.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Exact authority-bearing text of one provision in one edition and language. Translations are separate rows. */
export interface IWordings extends B.IBase {
  citationId: string | null;
  code: string;
  editionId: string;
  endsOn: Date | null;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  instrumentId: string;
  languageId: string;
  observedAt: Date;
  provisionId: string;
  startsOn: Date | null;
  supersedesId: string | null;
  text: string;
  toYear: number | null;
  readonly citation?: CitationsTypes.ICitations;
  readonly edition?: EditionsTypes.IEditions;
  readonly instrument?: InstrumentsTypes.IInstruments;
  readonly language?: LanguageTypes.ILanguage;
  readonly provision?: ProvisionsTypes.IProvisions;
  readonly supersedes?: IWordings;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type WordingsKey = keyof IWordings;

export type WordingsRelationKey = (typeof WORDINGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IWordingsReadonlyFields = B.IBaseReadonlyFields;

export type IWordingsContextualFields = never;

export type IWordingsSensitiveFields = never;

export type IWordingsTransitionFields = never;

export type IWordingsImmutableFields =
  | IWordingsReadonlyFields
  | IWordingsContextualFields
  | IWordingsSensitiveFields
  | IWordingsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IWordingsCreatable = Omit<IWordings, IWordingsImmutableFields | WordingsRelationKey>;

export type IWordingsSystemWritable = Omit<IWordings, B.IBaseReadonlyFields | WordingsRelationKey>;

export type IWordingsUpdatable = Partial<
  Omit<IWordings, IWordingsImmutableFields | WordingsRelationKey>
>;

export interface IWordingsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type WordingsSortableField = (typeof WORDINGS_SORTABLE_FIELDS)[number];

export type WordingsSearchableField = (typeof WORDINGS_SEARCHABLE_FIELDS)[number];

export type WordingsFilterableField = (typeof WORDINGS_FILTERABLE_FIELDS)[number];

export type WordingsDateRangeField = (typeof WORDINGS_DATE_RANGE_FIELDS)[number];

export type WordingsSelectableField = (typeof WORDINGS_SELECTABLE_FIELDS)[number];

export type WordingsDefaultSelectField = (typeof WORDINGS_DEFAULT_SELECT_FIELDS)[number];

export type WordingsEditableField = (typeof WORDINGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IWordingsAsOneRelationConfig = Q.IOneRelationConfig<
  "wordings",
  WordingsSelectableField
>;

export type IWordingsAsManyRelationConfig = Q.IManyRelationConfig<
  "wordings",
  WordingsSelectableField,
  WordingsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IWordingsAsOneRelationQuery = Q.IAsOneRelationQuery<IWordings, WordingsSelectableField>;

export type IWordingsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IWordings,
  WordingsSelectableField,
  WordingsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IWordingsRelationMap extends Record<WordingsRelationKey, unknown> {
  citation: CitationsTypes.ICitationsAsOneRelationQuery;
  edition: EditionsTypes.IEditionsAsOneRelationQuery;
  instrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  provision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  supersedes: IWordingsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IWordingsRelationQueries = Q.IBaseRelationQueries<
  IWordings,
  WordingsRelationKey,
  IWordingsRelationMap
>;

export type IWordingsItemQuery = Q.IBaseItemQuery<
  IWordings,
  WordingsRelationKey,
  WordingsSelectableField,
  WordingsRelationKey,
  WordingsSelectableField,
  IWordingsRelationMap,
  IWordingsRelationQueries
>;

export type IWordingsListQuery = Q.IBaseListQuery<
  IWordings,
  WordingsRelationKey,
  WordingsSelectableField,
  WordingsSortableField,
  WordingsRelationKey,
  WordingsSelectableField,
  WordingsSortableField,
  WordingsDateRangeField,
  WordingsFilterableField,
  IWordingsRelationMap,
  IWordingsRelationQueries,
  IWordingsItemQuery
>;
