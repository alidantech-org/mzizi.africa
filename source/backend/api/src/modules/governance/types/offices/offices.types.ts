// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as InstitutionsTypes from '#/modules/governance/types/institutions/institutions.types';
import type * as ValueTypes from '#/modules/reference/types/value/value.types';
import type * as CitationsTypes from '#/modules/source/types/citations/citations.types';
import type * as UnitsTypes from '#/modules/geography/types/units/units.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OFFICES_RELATION_KEYS,
  OFFICES_SORTABLE_FIELDS,
  OFFICES_SEARCHABLE_FIELDS,
  OFFICES_FILTERABLE_FIELDS,
  OFFICES_DATE_RANGE_FIELDS,
  OFFICES_SELECTABLE_FIELDS,
  OFFICES_DEFAULT_SELECT_FIELDS,
  OFFICES_EDITABLE_FIELDS
} from './offices.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One established public office, independent of any current holder and optionally scoped to a geographic unit. */
export interface IOffices extends B.IBase {
  code: string;
  institutionId: string;
  officeKindId: string;
  sourceCitationId: string | null;
  unitFeatureId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly officeKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly unitFeature?: UnitsTypes.IUnits;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OfficesKey = keyof IOffices;

export type OfficesRelationKey = (typeof OFFICES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOfficesReadonlyFields = B.IBaseReadonlyFields;

export type IOfficesContextualFields = never;

export type IOfficesSensitiveFields = never;

export type IOfficesTransitionFields = never;

export type IOfficesImmutableFields =
  | IOfficesReadonlyFields
  | IOfficesContextualFields
  | IOfficesSensitiveFields
  | IOfficesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOfficesCreatable = Omit<IOffices, IOfficesImmutableFields | OfficesRelationKey>;

export type IOfficesSystemWritable = Omit<IOffices, B.IBaseReadonlyFields | OfficesRelationKey>;

export type IOfficesUpdatable = Partial<Omit<IOffices, IOfficesImmutableFields | OfficesRelationKey>>;

export interface IOfficesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OfficesSortableField = (typeof OFFICES_SORTABLE_FIELDS)[number];

export type OfficesSearchableField = (typeof OFFICES_SEARCHABLE_FIELDS)[number];

export type OfficesFilterableField = (typeof OFFICES_FILTERABLE_FIELDS)[number];

export type OfficesDateRangeField = (typeof OFFICES_DATE_RANGE_FIELDS)[number];

export type OfficesSelectableField = (typeof OFFICES_SELECTABLE_FIELDS)[number];

export type OfficesDefaultSelectField = (typeof OFFICES_DEFAULT_SELECT_FIELDS)[number];

export type OfficesEditableField = (typeof OFFICES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOfficesAsOneRelationConfig = Q.IOneRelationConfig<'offices', OfficesSelectableField>;

export type IOfficesAsManyRelationConfig = Q.IManyRelationConfig<'officess', OfficesSelectableField, OfficesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOfficesAsOneRelationQuery = Q.IAsOneRelationQuery<IOffices, OfficesSelectableField>;

export type IOfficesAsManyRelationQuery = Q.IAsManyRelationQuery<IOffices, OfficesSelectableField, OfficesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOfficesRelationMap extends Record<OfficesRelationKey, unknown> {
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  officeKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  unitFeature: UnitsTypes.IUnitsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOfficesRelationQueries = Q.IBaseRelationQueries<IOffices, OfficesRelationKey, IOfficesRelationMap>;

export type IOfficesItemQuery = Q.IBaseItemQuery<
  IOffices,
  OfficesRelationKey,
  OfficesSelectableField,
  OfficesRelationKey,
  OfficesSelectableField,
  IOfficesRelationMap,
  IOfficesRelationQueries
>;

export type IOfficesListQuery = Q.IBaseListQuery<
  IOffices,
  OfficesRelationKey,
  OfficesSelectableField,
  OfficesSortableField,
  OfficesRelationKey,
  OfficesSelectableField,
  OfficesSortableField,
  OfficesDateRangeField,
  OfficesFilterableField,
  IOfficesRelationMap,
  IOfficesRelationQueries,
  IOfficesItemQuery
>;