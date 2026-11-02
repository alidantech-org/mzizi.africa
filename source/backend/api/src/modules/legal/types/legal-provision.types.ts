// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ProvisionKind } from '#/types/legal/provision-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LegalInstrumentTypes from '#/modules/legal/types/legal-instrument.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_PROVISION_RELATION_KEYS,
  LEGAL_PROVISION_SORTABLE_FIELDS,
  LEGAL_PROVISION_SEARCHABLE_FIELDS,
  LEGAL_PROVISION_FILTERABLE_FIELDS,
  LEGAL_PROVISION_DATE_RANGE_FIELDS,
  LEGAL_PROVISION_SELECTABLE_FIELDS,
  LEGAL_PROVISION_DEFAULT_SELECT_FIELDS,
  LEGAL_PROVISION_EDITABLE_FIELDS
} from './legal-provision.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Provision */
export interface ILegalProvision extends B.IBase {
  citation: string;
  code: string;
  content: string | null;
  heading: string | null;
  instrumentId: string;
  isCurrent: boolean;
  kind: ProvisionKind;
  parentId: string | null;
  previousVersionId: string | null;
  sortOrder: number;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly legalInstrument?: LegalInstrumentTypes.ILegalInstrument;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalProvisionKey = keyof ILegalProvision;

export type LegalProvisionRelationKey = (typeof LEGAL_PROVISION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalProvisionReadonlyFields = B.IBaseReadonlyFields;

export type ILegalProvisionContextualFields = never;

export type ILegalProvisionSensitiveFields = never;

export type ILegalProvisionTransitionFields = never;

export type ILegalProvisionImmutableFields =
  | ILegalProvisionReadonlyFields
  | ILegalProvisionContextualFields
  | ILegalProvisionSensitiveFields
  | ILegalProvisionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalProvisionCreatable = Omit<ILegalProvision, ILegalProvisionImmutableFields | LegalProvisionRelationKey>;

export type ILegalProvisionSystemWritable = Omit<ILegalProvision, B.IBaseReadonlyFields | LegalProvisionRelationKey>;

export type ILegalProvisionUpdatable = Partial<Omit<ILegalProvision, ILegalProvisionImmutableFields | LegalProvisionRelationKey>>;

export interface ILegalProvisionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalProvisionSortableField = (typeof LEGAL_PROVISION_SORTABLE_FIELDS)[number];

export type LegalProvisionSearchableField = (typeof LEGAL_PROVISION_SEARCHABLE_FIELDS)[number];

export type LegalProvisionFilterableField = (typeof LEGAL_PROVISION_FILTERABLE_FIELDS)[number];

export type LegalProvisionDateRangeField = (typeof LEGAL_PROVISION_DATE_RANGE_FIELDS)[number];

export type LegalProvisionSelectableField = (typeof LEGAL_PROVISION_SELECTABLE_FIELDS)[number];

export type LegalProvisionDefaultSelectField = (typeof LEGAL_PROVISION_DEFAULT_SELECT_FIELDS)[number];

export type LegalProvisionEditableField = (typeof LEGAL_PROVISION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalProvisionAsOneRelationConfig = Q.IOneRelationConfig<'legalProvision', LegalProvisionSelectableField>;

export type ILegalProvisionAsManyRelationConfig = Q.IManyRelationConfig<'legalProvisions', LegalProvisionSelectableField, LegalProvisionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalProvisionAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalProvision, LegalProvisionSelectableField>;

export type ILegalProvisionAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalProvision, LegalProvisionSelectableField, LegalProvisionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalProvisionRelationMap extends Record<LegalProvisionRelationKey, unknown> {
  legalInstrument: LegalInstrumentTypes.ILegalInstrumentAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalProvisionRelationQueries = Q.IBaseRelationQueries<ILegalProvision, LegalProvisionRelationKey, ILegalProvisionRelationMap>;

export type ILegalProvisionItemQuery = Q.IBaseItemQuery<
  ILegalProvision,
  LegalProvisionRelationKey,
  LegalProvisionSelectableField,
  LegalProvisionRelationKey,
  LegalProvisionSelectableField,
  ILegalProvisionRelationMap,
  ILegalProvisionRelationQueries
>;

export type ILegalProvisionListQuery = Q.IBaseListQuery<
  ILegalProvision,
  LegalProvisionRelationKey,
  LegalProvisionSelectableField,
  LegalProvisionSortableField,
  LegalProvisionRelationKey,
  LegalProvisionSelectableField,
  LegalProvisionSortableField,
  LegalProvisionDateRangeField,
  LegalProvisionFilterableField,
  ILegalProvisionRelationMap,
  ILegalProvisionRelationQueries,
  ILegalProvisionItemQuery
>;