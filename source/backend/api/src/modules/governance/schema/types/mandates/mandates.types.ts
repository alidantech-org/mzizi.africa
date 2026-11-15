// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as OfficesTypes from "#/modules/governance/schema/types/offices/offices.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANDATES_RELATION_KEYS,
  MANDATES_SORTABLE_FIELDS,
  MANDATES_SEARCHABLE_FIELDS,
  MANDATES_FILTERABLE_FIELDS,
  MANDATES_DATE_RANGE_FIELDS,
  MANDATES_SELECTABLE_FIELDS,
  MANDATES_DEFAULT_SELECT_FIELDS,
  MANDATES_EDITABLE_FIELDS,
} from "./mandates.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One responsibility or authority assignment for an institution or office. */
export interface IMandates extends B.IBase {
  description: string;
  institutionId: string | null;
  mandateKindId: string;
  officeId: string | null;
  sourceCitationId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly mandateKind?: ValueTypes.IValue;
  readonly office?: OfficesTypes.IOffices;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type MandatesKey = keyof IMandates;

export type MandatesRelationKey = (typeof MANDATES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IMandatesReadonlyFields = B.IBaseReadonlyFields;

export type IMandatesContextualFields = never;

export type IMandatesSensitiveFields = never;

export type IMandatesTransitionFields = never;

export type IMandatesImmutableFields =
  | IMandatesReadonlyFields
  | IMandatesContextualFields
  | IMandatesSensitiveFields
  | IMandatesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IMandatesCreatable = Omit<IMandates, IMandatesImmutableFields | MandatesRelationKey>;

export type IMandatesSystemWritable = Omit<IMandates, B.IBaseReadonlyFields | MandatesRelationKey>;

export type IMandatesUpdatable = Partial<
  Omit<IMandates, IMandatesImmutableFields | MandatesRelationKey>
>;

export interface IMandatesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type MandatesSortableField = (typeof MANDATES_SORTABLE_FIELDS)[number];

export type MandatesSearchableField = (typeof MANDATES_SEARCHABLE_FIELDS)[number];

export type MandatesFilterableField = (typeof MANDATES_FILTERABLE_FIELDS)[number];

export type MandatesDateRangeField = (typeof MANDATES_DATE_RANGE_FIELDS)[number];

export type MandatesSelectableField = (typeof MANDATES_SELECTABLE_FIELDS)[number];

export type MandatesDefaultSelectField = (typeof MANDATES_DEFAULT_SELECT_FIELDS)[number];

export type MandatesEditableField = (typeof MANDATES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IMandatesAsOneRelationConfig = Q.IOneRelationConfig<
  "mandates",
  MandatesSelectableField
>;

export type IMandatesAsManyRelationConfig = Q.IManyRelationConfig<
  "mandates",
  MandatesSelectableField,
  MandatesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IMandatesAsOneRelationQuery = Q.IAsOneRelationQuery<IMandates, MandatesSelectableField>;

export type IMandatesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IMandates,
  MandatesSelectableField,
  MandatesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IMandatesRelationMap extends Record<MandatesRelationKey, unknown> {
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  mandateKind: ValueTypes.IValueAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IMandatesRelationQueries = Q.IBaseRelationQueries<
  IMandates,
  MandatesRelationKey,
  IMandatesRelationMap
>;

export type IMandatesItemQuery = Q.IBaseItemQuery<
  IMandates,
  MandatesRelationKey,
  MandatesSelectableField,
  MandatesRelationKey,
  MandatesSelectableField,
  IMandatesRelationMap,
  IMandatesRelationQueries
>;

export type IMandatesListQuery = Q.IBaseListQuery<
  IMandates,
  MandatesRelationKey,
  MandatesSelectableField,
  MandatesSortableField,
  MandatesRelationKey,
  MandatesSelectableField,
  MandatesSortableField,
  MandatesDateRangeField,
  MandatesFilterableField,
  IMandatesRelationMap,
  IMandatesRelationQueries,
  IMandatesItemQuery
>;
