// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CitationsTypes from '#/modules/source/types/citations/citations.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INDIVIDUALS_RELATION_KEYS,
  INDIVIDUALS_SORTABLE_FIELDS,
  INDIVIDUALS_SEARCHABLE_FIELDS,
  INDIVIDUALS_FILTERABLE_FIELDS,
  INDIVIDUALS_DATE_RANGE_FIELDS,
  INDIVIDUALS_SELECTABLE_FIELDS,
  INDIVIDUALS_DEFAULT_SELECT_FIELDS,
  INDIVIDUALS_EDITABLE_FIELDS
} from './individuals.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One real human identity; names, identifiers and contacts are normalized in shared tables. */
export interface IIndividuals extends B.IBase {
  birthDate: Date | null;
  code: string;
  deathDate: Date | null;
  sourceCitationId: string | null;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IndividualsKey = keyof IIndividuals;

export type IndividualsRelationKey = (typeof INDIVIDUALS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIndividualsReadonlyFields = B.IBaseReadonlyFields;

export type IIndividualsContextualFields = never;

export type IIndividualsSensitiveFields = never;

export type IIndividualsTransitionFields = never;

export type IIndividualsImmutableFields =
  | IIndividualsReadonlyFields
  | IIndividualsContextualFields
  | IIndividualsSensitiveFields
  | IIndividualsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIndividualsCreatable = Omit<IIndividuals, IIndividualsImmutableFields | IndividualsRelationKey>;

export type IIndividualsSystemWritable = Omit<IIndividuals, B.IBaseReadonlyFields | IndividualsRelationKey>;

export type IIndividualsUpdatable = Partial<Omit<IIndividuals, IIndividualsImmutableFields | IndividualsRelationKey>>;

export interface IIndividualsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IndividualsSortableField = (typeof INDIVIDUALS_SORTABLE_FIELDS)[number];

export type IndividualsSearchableField = (typeof INDIVIDUALS_SEARCHABLE_FIELDS)[number];

export type IndividualsFilterableField = (typeof INDIVIDUALS_FILTERABLE_FIELDS)[number];

export type IndividualsDateRangeField = (typeof INDIVIDUALS_DATE_RANGE_FIELDS)[number];

export type IndividualsSelectableField = (typeof INDIVIDUALS_SELECTABLE_FIELDS)[number];

export type IndividualsDefaultSelectField = (typeof INDIVIDUALS_DEFAULT_SELECT_FIELDS)[number];

export type IndividualsEditableField = (typeof INDIVIDUALS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIndividualsAsOneRelationConfig = Q.IOneRelationConfig<'individuals', IndividualsSelectableField>;

export type IIndividualsAsManyRelationConfig = Q.IManyRelationConfig<'individualss', IndividualsSelectableField, IndividualsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIndividualsAsOneRelationQuery = Q.IAsOneRelationQuery<IIndividuals, IndividualsSelectableField>;

export type IIndividualsAsManyRelationQuery = Q.IAsManyRelationQuery<IIndividuals, IndividualsSelectableField, IndividualsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIndividualsRelationMap extends Record<IndividualsRelationKey, unknown> {
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIndividualsRelationQueries = Q.IBaseRelationQueries<IIndividuals, IndividualsRelationKey, IIndividualsRelationMap>;

export type IIndividualsItemQuery = Q.IBaseItemQuery<
  IIndividuals,
  IndividualsRelationKey,
  IndividualsSelectableField,
  IndividualsRelationKey,
  IndividualsSelectableField,
  IIndividualsRelationMap,
  IIndividualsRelationQueries
>;

export type IIndividualsListQuery = Q.IBaseListQuery<
  IIndividuals,
  IndividualsRelationKey,
  IndividualsSelectableField,
  IndividualsSortableField,
  IndividualsRelationKey,
  IndividualsSelectableField,
  IndividualsSortableField,
  IndividualsDateRangeField,
  IndividualsFilterableField,
  IIndividualsRelationMap,
  IIndividualsRelationQueries,
  IIndividualsItemQuery
>;