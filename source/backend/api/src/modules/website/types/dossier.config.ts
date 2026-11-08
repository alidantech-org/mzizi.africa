// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDossier,
  DossierKey,
  DossierRelationKey,
  DossierSortableField,
  DossierFilterableField,
  DossierDateRangeField,
  DossierSelectableField,
  IDossierAsOneRelationConfig,
  IDossierAsManyRelationConfig
} from './dossier.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOSSIER_RELATION_KEYS = [] as const satisfies readonly DossierKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOSSIER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly DossierKey[];

export const DOSSIER_SEARCHABLE_FIELDS = [] as const satisfies readonly DossierKey[];

export const DOSSIER_FILTERABLE_FIELDS = ['id', 'isCurrent', 'jurisdictionId', 'launchStage', 'reviewerId', 'supersedesId', 'version', ] as const satisfies readonly DossierKey[];

export const DOSSIER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly DossierKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOSSIER_SELECTABLE_FIELDS = ['applicableLaws', 'createdAt', 'id', 'isCurrent', 'jurisdictionId', 'launchStage', 'legislationRepositoryUrl', 'openQuestions', 'regulator', 'reviewDueAt', 'reviewedAt', 'reviewerId', 'supersedesId', 'treatyStatus', 'updatedAt', ] as const satisfies readonly DossierKey[];

export const DOSSIER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DossierSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOSSIER_EDITABLE_FIELDS = ['applicableLaws', 'isCurrent', 'jurisdictionId', 'launchStage', 'legislationRepositoryUrl', 'openQuestions', 'regulator', 'reviewDueAt', 'reviewedAt', 'reviewerId', 'supersedesId', 'treatyStatus', ] as const satisfies readonly DossierKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOSSIER_AS_ONE_RELATION_CONFIG = {
  relation: 'dossier',
  type: ERelationType.One,
  selectableFields: DOSSIER_SELECTABLE_FIELDS,
  defaultSelectFields: DOSSIER_DEFAULT_SELECT_FIELDS
} as const satisfies IDossierAsOneRelationConfig;

export const DOSSIER_AS_MANY_RELATION_CONFIG = {
  relation: 'dossiers',
  type: ERelationType.Many,
  selectableFields: DOSSIER_SELECTABLE_FIELDS,
  defaultSelectFields: DOSSIER_DEFAULT_SELECT_FIELDS,
  sortableFields: DOSSIER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDossierAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOSSIER_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const DOSSIER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOSSIER_QUERY_OPTIONS = {
  searchableFields: DOSSIER_SEARCHABLE_FIELDS,
  selectableFields: DOSSIER_SELECTABLE_FIELDS,
  defaultSelectFields: DOSSIER_DEFAULT_SELECT_FIELDS,
  sortableFields: DOSSIER_SORTABLE_FIELDS,
  filterFields: DOSSIER_FILTERABLE_FIELDS,
  dateRangeFields: DOSSIER_DATE_RANGE_FIELDS,
  oneRelations: DOSSIER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOSSIER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDossier,
  DossierSortableField,
  DossierSelectableField,
  DossierFilterableField,
  DossierDateRangeField,
  DossierRelationKey,
  typeof DOSSIER_ONE_RELATION_QUERY_OPTIONS,
  typeof DOSSIER_MANY_RELATION_QUERY_OPTIONS
>;