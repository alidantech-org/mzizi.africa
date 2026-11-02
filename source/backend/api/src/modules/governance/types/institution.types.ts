// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INSTITUTION_RELATION_KEYS,
  INSTITUTION_SORTABLE_FIELDS,
  INSTITUTION_SEARCHABLE_FIELDS,
  INSTITUTION_FILTERABLE_FIELDS,
  INSTITUTION_DATE_RANGE_FIELDS,
  INSTITUTION_SELECTABLE_FIELDS,
  INSTITUTION_DEFAULT_SELECT_FIELDS,
  INSTITUTION_EDITABLE_FIELDS
} from './institution.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Institution */
export interface IInstitution extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  branchId: string | null;
  code: string;
  confidence: number | null;
  description: string | null;
  isCurrent: boolean;
  jurisdictionId: string;
  legalBasisId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  typeId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InstitutionKey = keyof IInstitution;

export type InstitutionRelationKey = (typeof INSTITUTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInstitutionReadonlyFields = B.IBaseReadonlyFields;

export type IInstitutionContextualFields = never;

export type IInstitutionSensitiveFields = never;

export type IInstitutionTransitionFields = never;

export type IInstitutionImmutableFields =
  | IInstitutionReadonlyFields
  | IInstitutionContextualFields
  | IInstitutionSensitiveFields
  | IInstitutionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInstitutionCreatable = Omit<IInstitution, IInstitutionImmutableFields | InstitutionRelationKey>;

export type IInstitutionSystemWritable = Omit<IInstitution, B.IBaseReadonlyFields | InstitutionRelationKey>;

export type IInstitutionUpdatable = Partial<Omit<IInstitution, IInstitutionImmutableFields | InstitutionRelationKey>>;

export interface IInstitutionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InstitutionSortableField = (typeof INSTITUTION_SORTABLE_FIELDS)[number];

export type InstitutionSearchableField = (typeof INSTITUTION_SEARCHABLE_FIELDS)[number];

export type InstitutionFilterableField = (typeof INSTITUTION_FILTERABLE_FIELDS)[number];

export type InstitutionDateRangeField = (typeof INSTITUTION_DATE_RANGE_FIELDS)[number];

export type InstitutionSelectableField = (typeof INSTITUTION_SELECTABLE_FIELDS)[number];

export type InstitutionDefaultSelectField = (typeof INSTITUTION_DEFAULT_SELECT_FIELDS)[number];

export type InstitutionEditableField = (typeof INSTITUTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInstitutionAsOneRelationConfig = Q.IOneRelationConfig<'institution', InstitutionSelectableField>;

export type IInstitutionAsManyRelationConfig = Q.IManyRelationConfig<'institutions', InstitutionSelectableField, InstitutionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInstitutionAsOneRelationQuery = Q.IAsOneRelationQuery<IInstitution, InstitutionSelectableField>;

export type IInstitutionAsManyRelationQuery = Q.IAsManyRelationQuery<IInstitution, InstitutionSelectableField, InstitutionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInstitutionRelationMap extends Record<InstitutionRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInstitutionRelationQueries = Q.IBaseRelationQueries<IInstitution, InstitutionRelationKey, IInstitutionRelationMap>;

export type IInstitutionItemQuery = Q.IBaseItemQuery<
  IInstitution,
  InstitutionRelationKey,
  InstitutionSelectableField,
  InstitutionRelationKey,
  InstitutionSelectableField,
  IInstitutionRelationMap,
  IInstitutionRelationQueries
>;

export type IInstitutionListQuery = Q.IBaseListQuery<
  IInstitution,
  InstitutionRelationKey,
  InstitutionSelectableField,
  InstitutionSortableField,
  InstitutionRelationKey,
  InstitutionSelectableField,
  InstitutionSortableField,
  InstitutionDateRangeField,
  InstitutionFilterableField,
  IInstitutionRelationMap,
  IInstitutionRelationQueries,
  IInstitutionItemQuery
>;