// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';
import type * as CountryTypes from '#/modules/reference/types/country.types';
import type * as CitationsTypes from '#/modules/source/types/citations.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ENTITIES_RELATION_KEYS,
  ENTITIES_SORTABLE_FIELDS,
  ENTITIES_SEARCHABLE_FIELDS,
  ENTITIES_FILTERABLE_FIELDS,
  ENTITIES_DATE_RANGE_FIELDS,
  ENTITIES_SELECTABLE_FIELDS,
  ENTITIES_DEFAULT_SELECT_FIELDS,
  ENTITIES_EDITABLE_FIELDS
} from './entities.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable identity for one organization or legally identified entity; its names are stored in official.names. */
export interface IEntities extends B.IBase {
  code: string;
  dissolvedOn: Date | null;
  kindId: string;
  registeredOn: Date | null;
  registrationCountryId: string | null;
  sourceCitationId: string | null;
  readonly kind?: ValueTypes.IValue;
  readonly registrationCountry?: CountryTypes.ICountry;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EntitiesKey = keyof IEntities;

export type EntitiesRelationKey = (typeof ENTITIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEntitiesReadonlyFields = B.IBaseReadonlyFields;

export type IEntitiesContextualFields = never;

export type IEntitiesSensitiveFields = never;

export type IEntitiesTransitionFields = never;

export type IEntitiesImmutableFields =
  | IEntitiesReadonlyFields
  | IEntitiesContextualFields
  | IEntitiesSensitiveFields
  | IEntitiesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEntitiesCreatable = Omit<IEntities, IEntitiesImmutableFields | EntitiesRelationKey>;

export type IEntitiesSystemWritable = Omit<IEntities, B.IBaseReadonlyFields | EntitiesRelationKey>;

export type IEntitiesUpdatable = Partial<Omit<IEntities, IEntitiesImmutableFields | EntitiesRelationKey>>;

export interface IEntitiesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EntitiesSortableField = (typeof ENTITIES_SORTABLE_FIELDS)[number];

export type EntitiesSearchableField = (typeof ENTITIES_SEARCHABLE_FIELDS)[number];

export type EntitiesFilterableField = (typeof ENTITIES_FILTERABLE_FIELDS)[number];

export type EntitiesDateRangeField = (typeof ENTITIES_DATE_RANGE_FIELDS)[number];

export type EntitiesSelectableField = (typeof ENTITIES_SELECTABLE_FIELDS)[number];

export type EntitiesDefaultSelectField = (typeof ENTITIES_DEFAULT_SELECT_FIELDS)[number];

export type EntitiesEditableField = (typeof ENTITIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEntitiesAsOneRelationConfig = Q.IOneRelationConfig<'entities', EntitiesSelectableField>;

export type IEntitiesAsManyRelationConfig = Q.IManyRelationConfig<'entitiess', EntitiesSelectableField, EntitiesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEntitiesAsOneRelationQuery = Q.IAsOneRelationQuery<IEntities, EntitiesSelectableField>;

export type IEntitiesAsManyRelationQuery = Q.IAsManyRelationQuery<IEntities, EntitiesSelectableField, EntitiesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEntitiesRelationMap extends Record<EntitiesRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  registrationCountry: CountryTypes.ICountryAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEntitiesRelationQueries = Q.IBaseRelationQueries<IEntities, EntitiesRelationKey, IEntitiesRelationMap>;

export type IEntitiesItemQuery = Q.IBaseItemQuery<
  IEntities,
  EntitiesRelationKey,
  EntitiesSelectableField,
  EntitiesRelationKey,
  EntitiesSelectableField,
  IEntitiesRelationMap,
  IEntitiesRelationQueries
>;

export type IEntitiesListQuery = Q.IBaseListQuery<
  IEntities,
  EntitiesRelationKey,
  EntitiesSelectableField,
  EntitiesSortableField,
  EntitiesRelationKey,
  EntitiesSelectableField,
  EntitiesSortableField,
  EntitiesDateRangeField,
  EntitiesFilterableField,
  IEntitiesRelationMap,
  IEntitiesRelationQueries,
  IEntitiesItemQuery
>;