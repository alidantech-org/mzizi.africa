// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as InstitutionTypes from '#/modules/governance/types/institution.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OFFICE_RELATION_KEYS,
  OFFICE_SORTABLE_FIELDS,
  OFFICE_SEARCHABLE_FIELDS,
  OFFICE_FILTERABLE_FIELDS,
  OFFICE_DATE_RANGE_FIELDS,
  OFFICE_SELECTABLE_FIELDS,
  OFFICE_DEFAULT_SELECT_FIELDS,
  OFFICE_EDITABLE_FIELDS
} from './office.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Office */
export interface IOffice extends B.IBase {
  code: string;
  definitionCode: string | null;
  description: string | null;
  institutionId: string;
  isCurrent: boolean;
  isSingleton: boolean;
  name: string;
  parentOfficeId: string | null;
  scopeGeoUnitId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly institution?: InstitutionTypes.IInstitution;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OfficeKey = keyof IOffice;

export type OfficeRelationKey = (typeof OFFICE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOfficeReadonlyFields = B.IBaseReadonlyFields;

export type IOfficeContextualFields = never;

export type IOfficeSensitiveFields = never;

export type IOfficeTransitionFields = never;

export type IOfficeImmutableFields =
  | IOfficeReadonlyFields
  | IOfficeContextualFields
  | IOfficeSensitiveFields
  | IOfficeTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOfficeCreatable = Omit<IOffice, IOfficeImmutableFields | OfficeRelationKey>;

export type IOfficeSystemWritable = Omit<IOffice, B.IBaseReadonlyFields | OfficeRelationKey>;

export type IOfficeUpdatable = Partial<Omit<IOffice, IOfficeImmutableFields | OfficeRelationKey>>;

export interface IOfficeTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OfficeSortableField = (typeof OFFICE_SORTABLE_FIELDS)[number];

export type OfficeSearchableField = (typeof OFFICE_SEARCHABLE_FIELDS)[number];

export type OfficeFilterableField = (typeof OFFICE_FILTERABLE_FIELDS)[number];

export type OfficeDateRangeField = (typeof OFFICE_DATE_RANGE_FIELDS)[number];

export type OfficeSelectableField = (typeof OFFICE_SELECTABLE_FIELDS)[number];

export type OfficeDefaultSelectField = (typeof OFFICE_DEFAULT_SELECT_FIELDS)[number];

export type OfficeEditableField = (typeof OFFICE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOfficeAsOneRelationConfig = Q.IOneRelationConfig<'office', OfficeSelectableField>;

export type IOfficeAsManyRelationConfig = Q.IManyRelationConfig<'offices', OfficeSelectableField, OfficeSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOfficeAsOneRelationQuery = Q.IAsOneRelationQuery<IOffice, OfficeSelectableField>;

export type IOfficeAsManyRelationQuery = Q.IAsManyRelationQuery<IOffice, OfficeSelectableField, OfficeSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOfficeRelationMap extends Record<OfficeRelationKey, unknown> {
  institution: InstitutionTypes.IInstitutionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOfficeRelationQueries = Q.IBaseRelationQueries<IOffice, OfficeRelationKey, IOfficeRelationMap>;

export type IOfficeItemQuery = Q.IBaseItemQuery<
  IOffice,
  OfficeRelationKey,
  OfficeSelectableField,
  OfficeRelationKey,
  OfficeSelectableField,
  IOfficeRelationMap,
  IOfficeRelationQueries
>;

export type IOfficeListQuery = Q.IBaseListQuery<
  IOffice,
  OfficeRelationKey,
  OfficeSelectableField,
  OfficeSortableField,
  OfficeRelationKey,
  OfficeSelectableField,
  OfficeSortableField,
  OfficeDateRangeField,
  OfficeFilterableField,
  IOfficeRelationMap,
  IOfficeRelationQueries,
  IOfficeItemQuery
>;