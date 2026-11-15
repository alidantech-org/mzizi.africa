// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from '#/modules/official/schema/types/entities/entities.types';
import type * as ValueTypes from '#/modules/reference/schema/types/value/value.types';
import type * as IndividualsTypes from '#/modules/official/schema/types/individuals/individuals.types';
import type * as OfficesTypes from '#/modules/governance/schema/types/offices/offices.types';
import type * as CitationsTypes from '#/modules/source/schema/types/citations/citations.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  HOLDERS_RELATION_KEYS,
  HOLDERS_SORTABLE_FIELDS,
  HOLDERS_SEARCHABLE_FIELDS,
  HOLDERS_FILTERABLE_FIELDS,
  HOLDERS_DATE_RANGE_FIELDS,
  HOLDERS_SELECTABLE_FIELDS,
  HOLDERS_DEFAULT_SELECT_FIELDS,
  HOLDERS_EDITABLE_FIELDS
} from './holders.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One person's continuous tenure in one office, with appointment kind and effective dates. */
export interface IHolders extends B.IBase {
  appointedByEntityId: string | null;
  appointmentKindId: string;
  individualId: string;
  officeId: string;
  sourceCitationId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly appointedByEntity?: EntitiesTypes.IEntities;
  readonly appointmentKind?: ValueTypes.IValue;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly office?: OfficesTypes.IOffices;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type HoldersKey = keyof IHolders;

export type HoldersRelationKey = (typeof HOLDERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IHoldersReadonlyFields = B.IBaseReadonlyFields;

export type IHoldersContextualFields = never;

export type IHoldersSensitiveFields = never;

export type IHoldersTransitionFields = never;

export type IHoldersImmutableFields =
  | IHoldersReadonlyFields
  | IHoldersContextualFields
  | IHoldersSensitiveFields
  | IHoldersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IHoldersCreatable = Omit<IHolders, IHoldersImmutableFields | HoldersRelationKey>;

export type IHoldersSystemWritable = Omit<IHolders, B.IBaseReadonlyFields | HoldersRelationKey>;

export type IHoldersUpdatable = Partial<Omit<IHolders, IHoldersImmutableFields | HoldersRelationKey>>;

export interface IHoldersTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type HoldersSortableField = (typeof HOLDERS_SORTABLE_FIELDS)[number];

export type HoldersSearchableField = (typeof HOLDERS_SEARCHABLE_FIELDS)[number];

export type HoldersFilterableField = (typeof HOLDERS_FILTERABLE_FIELDS)[number];

export type HoldersDateRangeField = (typeof HOLDERS_DATE_RANGE_FIELDS)[number];

export type HoldersSelectableField = (typeof HOLDERS_SELECTABLE_FIELDS)[number];

export type HoldersDefaultSelectField = (typeof HOLDERS_DEFAULT_SELECT_FIELDS)[number];

export type HoldersEditableField = (typeof HOLDERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IHoldersAsOneRelationConfig = Q.IOneRelationConfig<'holders', HoldersSelectableField>;

export type IHoldersAsManyRelationConfig = Q.IManyRelationConfig<'holderss', HoldersSelectableField, HoldersSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IHoldersAsOneRelationQuery = Q.IAsOneRelationQuery<IHolders, HoldersSelectableField>;

export type IHoldersAsManyRelationQuery = Q.IAsManyRelationQuery<IHolders, HoldersSelectableField, HoldersSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IHoldersRelationMap extends Record<HoldersRelationKey, unknown> {
  appointedByEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  appointmentKind: ValueTypes.IValueAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IHoldersRelationQueries = Q.IBaseRelationQueries<IHolders, HoldersRelationKey, IHoldersRelationMap>;

export type IHoldersItemQuery = Q.IBaseItemQuery<
  IHolders,
  HoldersRelationKey,
  HoldersSelectableField,
  HoldersRelationKey,
  HoldersSelectableField,
  IHoldersRelationMap,
  IHoldersRelationQueries
>;

export type IHoldersListQuery = Q.IBaseListQuery<
  IHolders,
  HoldersRelationKey,
  HoldersSelectableField,
  HoldersSortableField,
  HoldersRelationKey,
  HoldersSelectableField,
  HoldersSortableField,
  HoldersDateRangeField,
  HoldersFilterableField,
  IHoldersRelationMap,
  IHoldersRelationQueries,
  IHoldersItemQuery
>;