// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from '#/modules/official/types/entities.types';
import type * as IndividualsTypes from '#/modules/official/types/individuals.types';
import type * as ValueTypes from '#/modules/reference/types/value.types';
import type * as CitationsTypes from '#/modules/source/types/citations.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  NAMES_RELATION_KEYS,
  NAMES_SORTABLE_FIELDS,
  NAMES_SEARCHABLE_FIELDS,
  NAMES_FILTERABLE_FIELDS,
  NAMES_DATE_RANGE_FIELDS,
  NAMES_SELECTABLE_FIELDS,
  NAMES_DEFAULT_SELECT_FIELDS,
  NAMES_EDITABLE_FIELDS
} from './names.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One attested name form for exactly one entity or individual, with optional language and validity. */
export interface INames extends B.IBase {
  entityId: string | null;
  individualId: string | null;
  isPreferred: boolean;
  languageTag: string | null;
  name: string;
  nameKindId: string;
  sourceCitationId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly entity?: EntitiesTypes.IEntities;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly nameKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type NamesKey = keyof INames;

export type NamesRelationKey = (typeof NAMES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type INamesReadonlyFields = B.IBaseReadonlyFields;

export type INamesContextualFields = never;

export type INamesSensitiveFields = never;

export type INamesTransitionFields = never;

export type INamesImmutableFields =
  | INamesReadonlyFields
  | INamesContextualFields
  | INamesSensitiveFields
  | INamesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type INamesCreatable = Omit<INames, INamesImmutableFields | NamesRelationKey>;

export type INamesSystemWritable = Omit<INames, B.IBaseReadonlyFields | NamesRelationKey>;

export type INamesUpdatable = Partial<Omit<INames, INamesImmutableFields | NamesRelationKey>>;

export interface INamesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type NamesSortableField = (typeof NAMES_SORTABLE_FIELDS)[number];

export type NamesSearchableField = (typeof NAMES_SEARCHABLE_FIELDS)[number];

export type NamesFilterableField = (typeof NAMES_FILTERABLE_FIELDS)[number];

export type NamesDateRangeField = (typeof NAMES_DATE_RANGE_FIELDS)[number];

export type NamesSelectableField = (typeof NAMES_SELECTABLE_FIELDS)[number];

export type NamesDefaultSelectField = (typeof NAMES_DEFAULT_SELECT_FIELDS)[number];

export type NamesEditableField = (typeof NAMES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type INamesAsOneRelationConfig = Q.IOneRelationConfig<'names', NamesSelectableField>;

export type INamesAsManyRelationConfig = Q.IManyRelationConfig<'namess', NamesSelectableField, NamesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type INamesAsOneRelationQuery = Q.IAsOneRelationQuery<INames, NamesSelectableField>;

export type INamesAsManyRelationQuery = Q.IAsManyRelationQuery<INames, NamesSelectableField, NamesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface INamesRelationMap extends Record<NamesRelationKey, unknown> {
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  nameKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type INamesRelationQueries = Q.IBaseRelationQueries<INames, NamesRelationKey, INamesRelationMap>;

export type INamesItemQuery = Q.IBaseItemQuery<
  INames,
  NamesRelationKey,
  NamesSelectableField,
  NamesRelationKey,
  NamesSelectableField,
  INamesRelationMap,
  INamesRelationQueries
>;

export type INamesListQuery = Q.IBaseListQuery<
  INames,
  NamesRelationKey,
  NamesSelectableField,
  NamesSortableField,
  NamesRelationKey,
  NamesSelectableField,
  NamesSortableField,
  NamesDateRangeField,
  NamesFilterableField,
  INamesRelationMap,
  INamesRelationQueries,
  INamesItemQuery
>;