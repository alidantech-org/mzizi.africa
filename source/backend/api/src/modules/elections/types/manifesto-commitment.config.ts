// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ManifestoConfig from '#/modules/elections/types/manifesto.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IManifestoCommitment,
  ManifestoCommitmentKey,
  ManifestoCommitmentRelationKey,
  ManifestoCommitmentSortableField,
  ManifestoCommitmentFilterableField,
  ManifestoCommitmentDateRangeField,
  ManifestoCommitmentSelectableField,
  IManifestoCommitmentAsOneRelationConfig,
  IManifestoCommitmentAsManyRelationConfig
} from './manifesto-commitment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANIFESTO_COMMITMENT_RELATION_KEYS = ['manifesto', ] as const satisfies readonly ManifestoCommitmentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANIFESTO_COMMITMENT_SORTABLE_FIELDS = ['createdAt', 'sortOrder', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ManifestoCommitmentKey[];

export const MANIFESTO_COMMITMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly ManifestoCommitmentKey[];

export const MANIFESTO_COMMITMENT_FILTERABLE_FIELDS = ['id', 'isCurrent', 'manifestoId', 'method', 'parentId', 'topicId', 'verificationState', 'version', ] as const satisfies readonly ManifestoCommitmentKey[];

export const MANIFESTO_COMMITMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ManifestoCommitmentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANIFESTO_COMMITMENT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'licence', 'manifestoId', 'method', 'parentId', 'retrievedAt', 'sortOrder', 'sourceName', 'sourceReference', 'sourceUrl', 'text', 'toolOrModel', 'topicId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ManifestoCommitmentKey[];

export const MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ManifestoCommitmentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANIFESTO_COMMITMENT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'licence', 'manifestoId', 'method', 'parentId', 'retrievedAt', 'sortOrder', 'sourceName', 'sourceReference', 'sourceUrl', 'text', 'toolOrModel', 'topicId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ManifestoCommitmentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANIFESTO_COMMITMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'manifestoCommitment',
  type: ERelationType.One,
  selectableFields: MANIFESTO_COMMITMENT_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS
} as const satisfies IManifestoCommitmentAsOneRelationConfig;

export const MANIFESTO_COMMITMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'manifestoCommitments',
  type: ERelationType.Many,
  selectableFields: MANIFESTO_COMMITMENT_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTO_COMMITMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IManifestoCommitmentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANIFESTO_COMMITMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ManifestoCommitmentRelationKey>().one(ManifestoConfig.MANIFESTO_AS_ONE_RELATION_CONFIG, 'manifesto'),
] as const;

export const MANIFESTO_COMMITMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANIFESTO_COMMITMENT_QUERY_OPTIONS = {
  searchableFields: MANIFESTO_COMMITMENT_SEARCHABLE_FIELDS,
  selectableFields: MANIFESTO_COMMITMENT_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTO_COMMITMENT_SORTABLE_FIELDS,
  filterFields: MANIFESTO_COMMITMENT_FILTERABLE_FIELDS,
  dateRangeFields: MANIFESTO_COMMITMENT_DATE_RANGE_FIELDS,
  oneRelations: MANIFESTO_COMMITMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANIFESTO_COMMITMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IManifestoCommitment,
  ManifestoCommitmentSortableField,
  ManifestoCommitmentSelectableField,
  ManifestoCommitmentFilterableField,
  ManifestoCommitmentDateRangeField,
  ManifestoCommitmentRelationKey,
  typeof MANIFESTO_COMMITMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof MANIFESTO_COMMITMENT_MANY_RELATION_QUERY_OPTIONS
>;