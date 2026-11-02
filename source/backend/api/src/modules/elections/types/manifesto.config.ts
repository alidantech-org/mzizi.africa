// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CandidateConfig from '#/modules/elections/types/candidate.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IManifesto,
  ManifestoKey,
  ManifestoRelationKey,
  ManifestoSortableField,
  ManifestoFilterableField,
  ManifestoDateRangeField,
  ManifestoSelectableField,
  IManifestoAsOneRelationConfig,
  IManifestoAsManyRelationConfig
} from './manifesto.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANIFESTO_RELATION_KEYS = ['candidate', ] as const satisfies readonly ManifestoKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANIFESTO_SORTABLE_FIELDS = ['createdAt', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ManifestoKey[];

export const MANIFESTO_SEARCHABLE_FIELDS = ['title', ] as const satisfies readonly ManifestoKey[];

export const MANIFESTO_FILTERABLE_FIELDS = ['candidateId', 'id', 'isCurrent', 'title', 'version', ] as const satisfies readonly ManifestoKey[];

export const MANIFESTO_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ManifestoKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANIFESTO_SELECTABLE_FIELDS = ['candidateId', 'createdAt', 'documentUrl', 'id', 'isCurrent', 'language', 'publishedOn', 'title', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ManifestoKey[];

export const MANIFESTO_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ManifestoSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANIFESTO_EDITABLE_FIELDS = ['candidateId', 'documentUrl', 'isCurrent', 'language', 'publishedOn', 'title', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ManifestoKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANIFESTO_AS_ONE_RELATION_CONFIG = {
  relation: 'manifesto',
  type: ERelationType.One,
  selectableFields: MANIFESTO_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_DEFAULT_SELECT_FIELDS
} as const satisfies IManifestoAsOneRelationConfig;

export const MANIFESTO_AS_MANY_RELATION_CONFIG = {
  relation: 'manifestos',
  type: ERelationType.Many,
  selectableFields: MANIFESTO_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTO_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IManifestoAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANIFESTO_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ManifestoRelationKey>().one(CandidateConfig.CANDIDATE_AS_ONE_RELATION_CONFIG, 'candidate'),
] as const;

export const MANIFESTO_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANIFESTO_QUERY_OPTIONS = {
  searchableFields: MANIFESTO_SEARCHABLE_FIELDS,
  selectableFields: MANIFESTO_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFESTO_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFESTO_SORTABLE_FIELDS,
  filterFields: MANIFESTO_FILTERABLE_FIELDS,
  dateRangeFields: MANIFESTO_DATE_RANGE_FIELDS,
  oneRelations: MANIFESTO_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANIFESTO_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IManifesto,
  ManifestoSortableField,
  ManifestoSelectableField,
  ManifestoFilterableField,
  ManifestoDateRangeField,
  ManifestoRelationKey,
  typeof MANIFESTO_ONE_RELATION_QUERY_OPTIONS,
  typeof MANIFESTO_MANY_RELATION_QUERY_OPTIONS
>;