// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalProvisionConfig from '#/modules/legal/types/legal-provision.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILegalAuthorityLink,
  LegalAuthorityLinkKey,
  LegalAuthorityLinkRelationKey,
  LegalAuthorityLinkSortableField,
  LegalAuthorityLinkFilterableField,
  LegalAuthorityLinkDateRangeField,
  LegalAuthorityLinkSelectableField,
  ILegalAuthorityLinkAsOneRelationConfig,
  ILegalAuthorityLinkAsManyRelationConfig
} from './legal-authority-link.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_RELATION_KEYS = ['legalProvision', ] as const satisfies readonly LegalAuthorityLinkKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalAuthorityLinkKey[];

export const LEGAL_AUTHORITY_LINK_SEARCHABLE_FIELDS = [] as const satisfies readonly LegalAuthorityLinkKey[];

export const LEGAL_AUTHORITY_LINK_FILTERABLE_FIELDS = ['id', 'isCurrent', 'provisionId', 'targetId', 'targetKind', 'version', ] as const satisfies readonly LegalAuthorityLinkKey[];

export const LEGAL_AUTHORITY_LINK_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalAuthorityLinkKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'note', 'provisionId', 'targetId', 'targetKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAuthorityLinkKey[];

export const LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalAuthorityLinkSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_EDITABLE_FIELDS = ['isCurrent', 'note', 'provisionId', 'targetId', 'targetKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalAuthorityLinkKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_AS_ONE_RELATION_CONFIG = {
  relation: 'legalAuthorityLink',
  type: ERelationType.One,
  selectableFields: LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalAuthorityLinkAsOneRelationConfig;

export const LEGAL_AUTHORITY_LINK_AS_MANY_RELATION_CONFIG = {
  relation: 'legalAuthorityLinks',
  type: ERelationType.Many,
  selectableFields: LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AUTHORITY_LINK_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalAuthorityLinkAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LegalAuthorityLinkRelationKey>().one(LegalProvisionConfig.LEGAL_PROVISION_AS_ONE_RELATION_CONFIG, 'legalProvision'),
] as const;

export const LEGAL_AUTHORITY_LINK_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_AUTHORITY_LINK_QUERY_OPTIONS = {
  searchableFields: LEGAL_AUTHORITY_LINK_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_AUTHORITY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_AUTHORITY_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_AUTHORITY_LINK_SORTABLE_FIELDS,
  filterFields: LEGAL_AUTHORITY_LINK_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_AUTHORITY_LINK_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_AUTHORITY_LINK_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_AUTHORITY_LINK_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalAuthorityLink,
  LegalAuthorityLinkSortableField,
  LegalAuthorityLinkSelectableField,
  LegalAuthorityLinkFilterableField,
  LegalAuthorityLinkDateRangeField,
  LegalAuthorityLinkRelationKey,
  typeof LEGAL_AUTHORITY_LINK_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_AUTHORITY_LINK_MANY_RELATION_QUERY_OPTIONS
>;