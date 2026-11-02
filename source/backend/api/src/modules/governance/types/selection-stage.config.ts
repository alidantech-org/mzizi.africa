// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SelectionProcedureConfig from '#/modules/governance/types/selection-procedure.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISelectionStage,
  SelectionStageKey,
  SelectionStageRelationKey,
  SelectionStageSortableField,
  SelectionStageFilterableField,
  SelectionStageDateRangeField,
  SelectionStageSelectableField,
  ISelectionStageAsOneRelationConfig,
  ISelectionStageAsManyRelationConfig
} from './selection-stage.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SELECTION_STAGE_RELATION_KEYS = ['selectionProcedure', ] as const satisfies readonly SelectionStageKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SELECTION_STAGE_SORTABLE_FIELDS = ['createdAt', 'stageOrder', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly SelectionStageKey[];

export const SELECTION_STAGE_SEARCHABLE_FIELDS = [] as const satisfies readonly SelectionStageKey[];

export const SELECTION_STAGE_FILTERABLE_FIELDS = ['actorInstitutionId', 'actorOfficeId', 'id', 'isCurrent', 'kind', 'method', 'procedureId', 'verificationState', 'version', ] as const satisfies readonly SelectionStageKey[];

export const SELECTION_STAGE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SelectionStageKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SELECTION_STAGE_SELECTABLE_FIELDS = ['actorInstitutionId', 'actorOfficeId', 'artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'description', 'id', 'isCurrent', 'kind', 'licence', 'method', 'procedureId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'stageOrder', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly SelectionStageKey[];

export const SELECTION_STAGE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SelectionStageSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SELECTION_STAGE_EDITABLE_FIELDS = ['actorInstitutionId', 'actorOfficeId', 'artifactChecksum', 'artifactId', 'confidence', 'description', 'isCurrent', 'kind', 'licence', 'method', 'procedureId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'stageOrder', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly SelectionStageKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SELECTION_STAGE_AS_ONE_RELATION_CONFIG = {
  relation: 'selectionStage',
  type: ERelationType.One,
  selectableFields: SELECTION_STAGE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_STAGE_DEFAULT_SELECT_FIELDS
} as const satisfies ISelectionStageAsOneRelationConfig;

export const SELECTION_STAGE_AS_MANY_RELATION_CONFIG = {
  relation: 'selectionStages',
  type: ERelationType.Many,
  selectableFields: SELECTION_STAGE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_STAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: SELECTION_STAGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISelectionStageAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SELECTION_STAGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SelectionStageRelationKey>().one(SelectionProcedureConfig.SELECTION_PROCEDURE_AS_ONE_RELATION_CONFIG, 'selectionProcedure'),
] as const;

export const SELECTION_STAGE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SELECTION_STAGE_QUERY_OPTIONS = {
  searchableFields: SELECTION_STAGE_SEARCHABLE_FIELDS,
  selectableFields: SELECTION_STAGE_SELECTABLE_FIELDS,
  defaultSelectFields: SELECTION_STAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: SELECTION_STAGE_SORTABLE_FIELDS,
  filterFields: SELECTION_STAGE_FILTERABLE_FIELDS,
  dateRangeFields: SELECTION_STAGE_DATE_RANGE_FIELDS,
  oneRelations: SELECTION_STAGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SELECTION_STAGE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISelectionStage,
  SelectionStageSortableField,
  SelectionStageSelectableField,
  SelectionStageFilterableField,
  SelectionStageDateRangeField,
  SelectionStageRelationKey,
  typeof SELECTION_STAGE_ONE_RELATION_QUERY_OPTIONS,
  typeof SELECTION_STAGE_MANY_RELATION_QUERY_OPTIONS
>;