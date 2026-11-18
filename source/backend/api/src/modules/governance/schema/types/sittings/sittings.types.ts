// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as OccurrencesTypes from "#/modules/event/schema/types/occurrences/occurrences.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as TermsTypes from "#/modules/governance/schema/types/terms/terms.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITTINGS_RELATION_KEYS,
  SITTINGS_SORTABLE_FIELDS,
  SITTINGS_SEARCHABLE_FIELDS,
  SITTINGS_FILTERABLE_FIELDS,
  SITTINGS_DATE_RANGE_FIELDS,
  SITTINGS_SELECTABLE_FIELDS,
  SITTINGS_DEFAULT_SELECT_FIELDS,
  SITTINGS_EDITABLE_FIELDS,
} from "./sittings.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered. */
export interface ISittings extends B.IBase {
  code: string;
  institutionId: string;
  occurrenceId: string;
  sequenceNumber: number | null;
  sessionLabel: string | null;
  sittingKindId: string;
  sourceCitationId: string | null;
  termId: string | null;
  title: string;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly occurrence?: OccurrencesTypes.IOccurrences;
  readonly sittingKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly term?: TermsTypes.ITerms;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SittingsKey = keyof ISittings;

export type SittingsRelationKey = (typeof SITTINGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISittingsReadonlyFields = B.IBaseReadonlyFields;

export type ISittingsContextualFields = never;

export type ISittingsSensitiveFields = never;

export type ISittingsTransitionFields = never;

export type ISittingsImmutableFields =
  | ISittingsReadonlyFields
  | ISittingsContextualFields
  | ISittingsSensitiveFields
  | ISittingsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISittingsCreatable = Omit<ISittings, ISittingsImmutableFields | SittingsRelationKey>;

export type ISittingsSystemWritable = Omit<ISittings, B.IBaseReadonlyFields | SittingsRelationKey>;

export type ISittingsUpdatable = Partial<
  Omit<ISittings, ISittingsImmutableFields | SittingsRelationKey>
>;

export interface ISittingsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SittingsSortableField = (typeof SITTINGS_SORTABLE_FIELDS)[number];

export type SittingsSearchableField = (typeof SITTINGS_SEARCHABLE_FIELDS)[number];

export type SittingsFilterableField = (typeof SITTINGS_FILTERABLE_FIELDS)[number];

export type SittingsDateRangeField = (typeof SITTINGS_DATE_RANGE_FIELDS)[number];

export type SittingsSelectableField = (typeof SITTINGS_SELECTABLE_FIELDS)[number];

export type SittingsDefaultSelectField = (typeof SITTINGS_DEFAULT_SELECT_FIELDS)[number];

export type SittingsEditableField = (typeof SITTINGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISittingsAsOneRelationConfig = Q.IOneRelationConfig<
  "sittings",
  SittingsSelectableField
>;

export type ISittingsAsManyRelationConfig = Q.IManyRelationConfig<
  "sittings",
  SittingsSelectableField,
  SittingsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISittingsAsOneRelationQuery = Q.IAsOneRelationQuery<ISittings, SittingsSelectableField>;

export type ISittingsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISittings,
  SittingsSelectableField,
  SittingsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISittingsRelationMap extends Record<SittingsRelationKey, unknown> {
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  occurrence: OccurrencesTypes.IOccurrencesAsOneRelationQuery;
  sittingKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  term: TermsTypes.ITermsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISittingsRelationQueries = Q.IBaseRelationQueries<
  ISittings,
  SittingsRelationKey,
  ISittingsRelationMap
>;

export type ISittingsItemQuery = Q.IBaseItemQuery<
  ISittings,
  SittingsRelationKey,
  SittingsSelectableField,
  SittingsRelationKey,
  SittingsSelectableField,
  ISittingsRelationMap,
  ISittingsRelationQueries
>;

export type ISittingsListQuery = Q.IBaseListQuery<
  ISittings,
  SittingsRelationKey,
  SittingsSelectableField,
  SittingsSortableField,
  SittingsRelationKey,
  SittingsSelectableField,
  SittingsSortableField,
  SittingsDateRangeField,
  SittingsFilterableField,
  ISittingsRelationMap,
  ISittingsRelationQueries,
  ISittingsItemQuery
>;
