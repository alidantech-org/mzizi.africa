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
import type * as LegalProvisionTypes from '#/modules/legal/types/legal-provision.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_AUTHORITY_LINK_RELATION_KEYS,
  LEGAL_AUTHORITY_LINK_SORTABLE_FIELDS,
  LEGAL_AUTHORITY_LINK_SEARCHABLE_FIELDS,
  LEGAL_AUTHORITY_LINK_FILTERABLE_FIELDS,
  LEGAL_AUTHORITY_LINK_DATE_RANGE_FIELDS,
  LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS,
  LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS,
  LEGAL_AUTHORITY_LINK_EDITABLE_FIELDS
} from './legal-authority-link.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Authority Link */
export interface ILegalAuthorityLink extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  note: string | null;
  provisionId: string;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  targetId: string;
  targetKind: string;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly legalProvision?: LegalProvisionTypes.ILegalProvision;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalAuthorityLinkKey = keyof ILegalAuthorityLink;

export type LegalAuthorityLinkRelationKey = (typeof LEGAL_AUTHORITY_LINK_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalAuthorityLinkReadonlyFields = B.IBaseReadonlyFields;

export type ILegalAuthorityLinkContextualFields = never;

export type ILegalAuthorityLinkSensitiveFields = never;

export type ILegalAuthorityLinkTransitionFields = never;

export type ILegalAuthorityLinkImmutableFields =
  | ILegalAuthorityLinkReadonlyFields
  | ILegalAuthorityLinkContextualFields
  | ILegalAuthorityLinkSensitiveFields
  | ILegalAuthorityLinkTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalAuthorityLinkCreatable = Omit<ILegalAuthorityLink, ILegalAuthorityLinkImmutableFields | LegalAuthorityLinkRelationKey>;

export type ILegalAuthorityLinkSystemWritable = Omit<ILegalAuthorityLink, B.IBaseReadonlyFields | LegalAuthorityLinkRelationKey>;

export type ILegalAuthorityLinkUpdatable = Partial<Omit<ILegalAuthorityLink, ILegalAuthorityLinkImmutableFields | LegalAuthorityLinkRelationKey>>;

export interface ILegalAuthorityLinkTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalAuthorityLinkSortableField = (typeof LEGAL_AUTHORITY_LINK_SORTABLE_FIELDS)[number];

export type LegalAuthorityLinkSearchableField = (typeof LEGAL_AUTHORITY_LINK_SEARCHABLE_FIELDS)[number];

export type LegalAuthorityLinkFilterableField = (typeof LEGAL_AUTHORITY_LINK_FILTERABLE_FIELDS)[number];

export type LegalAuthorityLinkDateRangeField = (typeof LEGAL_AUTHORITY_LINK_DATE_RANGE_FIELDS)[number];

export type LegalAuthorityLinkSelectableField = (typeof LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS)[number];

export type LegalAuthorityLinkDefaultSelectField = (typeof LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS)[number];

export type LegalAuthorityLinkEditableField = (typeof LEGAL_AUTHORITY_LINK_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalAuthorityLinkAsOneRelationConfig = Q.IOneRelationConfig<'legalAuthorityLink', LegalAuthorityLinkSelectableField>;

export type ILegalAuthorityLinkAsManyRelationConfig = Q.IManyRelationConfig<'legalAuthorityLinks', LegalAuthorityLinkSelectableField, LegalAuthorityLinkSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalAuthorityLinkAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalAuthorityLink, LegalAuthorityLinkSelectableField>;

export type ILegalAuthorityLinkAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalAuthorityLink, LegalAuthorityLinkSelectableField, LegalAuthorityLinkSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalAuthorityLinkRelationMap extends Record<LegalAuthorityLinkRelationKey, unknown> {
  legalProvision: LegalProvisionTypes.ILegalProvisionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalAuthorityLinkRelationQueries = Q.IBaseRelationQueries<ILegalAuthorityLink, LegalAuthorityLinkRelationKey, ILegalAuthorityLinkRelationMap>;

export type ILegalAuthorityLinkItemQuery = Q.IBaseItemQuery<
  ILegalAuthorityLink,
  LegalAuthorityLinkRelationKey,
  LegalAuthorityLinkSelectableField,
  LegalAuthorityLinkRelationKey,
  LegalAuthorityLinkSelectableField,
  ILegalAuthorityLinkRelationMap,
  ILegalAuthorityLinkRelationQueries
>;

export type ILegalAuthorityLinkListQuery = Q.IBaseListQuery<
  ILegalAuthorityLink,
  LegalAuthorityLinkRelationKey,
  LegalAuthorityLinkSelectableField,
  LegalAuthorityLinkSortableField,
  LegalAuthorityLinkRelationKey,
  LegalAuthorityLinkSelectableField,
  LegalAuthorityLinkSortableField,
  LegalAuthorityLinkDateRangeField,
  LegalAuthorityLinkFilterableField,
  ILegalAuthorityLinkRelationMap,
  ILegalAuthorityLinkRelationQueries,
  ILegalAuthorityLinkItemQuery
>;