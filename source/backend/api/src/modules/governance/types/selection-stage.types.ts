// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { StageKind } from '#/types/governance/stage-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SelectionProcedureTypes from '#/modules/governance/types/selection-procedure.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SELECTION_STAGE_RELATION_KEYS,
  SELECTION_STAGE_SORTABLE_FIELDS,
  SELECTION_STAGE_SEARCHABLE_FIELDS,
  SELECTION_STAGE_FILTERABLE_FIELDS,
  SELECTION_STAGE_DATE_RANGE_FIELDS,
  SELECTION_STAGE_SELECTABLE_FIELDS,
  SELECTION_STAGE_DEFAULT_SELECT_FIELDS,
  SELECTION_STAGE_EDITABLE_FIELDS
} from './selection-stage.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Selection Stage */
export interface ISelectionStage extends B.IBase {
  actorInstitutionId: string | null;
  actorOfficeId: string | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  description: string | null;
  isCurrent: boolean;
  kind: StageKind;
  licence: string | null;
  method: ProvenanceMethod;
  procedureId: string;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  stageOrder: number;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly selectionProcedure?: SelectionProcedureTypes.ISelectionProcedure;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SelectionStageKey = keyof ISelectionStage;

export type SelectionStageRelationKey = (typeof SELECTION_STAGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISelectionStageReadonlyFields = B.IBaseReadonlyFields;

export type ISelectionStageContextualFields = never;

export type ISelectionStageSensitiveFields = never;

export type ISelectionStageTransitionFields = never;

export type ISelectionStageImmutableFields =
  | ISelectionStageReadonlyFields
  | ISelectionStageContextualFields
  | ISelectionStageSensitiveFields
  | ISelectionStageTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISelectionStageCreatable = Omit<ISelectionStage, ISelectionStageImmutableFields | SelectionStageRelationKey>;

export type ISelectionStageSystemWritable = Omit<ISelectionStage, B.IBaseReadonlyFields | SelectionStageRelationKey>;

export type ISelectionStageUpdatable = Partial<Omit<ISelectionStage, ISelectionStageImmutableFields | SelectionStageRelationKey>>;

export interface ISelectionStageTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SelectionStageSortableField = (typeof SELECTION_STAGE_SORTABLE_FIELDS)[number];

export type SelectionStageSearchableField = (typeof SELECTION_STAGE_SEARCHABLE_FIELDS)[number];

export type SelectionStageFilterableField = (typeof SELECTION_STAGE_FILTERABLE_FIELDS)[number];

export type SelectionStageDateRangeField = (typeof SELECTION_STAGE_DATE_RANGE_FIELDS)[number];

export type SelectionStageSelectableField = (typeof SELECTION_STAGE_SELECTABLE_FIELDS)[number];

export type SelectionStageDefaultSelectField = (typeof SELECTION_STAGE_DEFAULT_SELECT_FIELDS)[number];

export type SelectionStageEditableField = (typeof SELECTION_STAGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISelectionStageAsOneRelationConfig = Q.IOneRelationConfig<'selectionStage', SelectionStageSelectableField>;

export type ISelectionStageAsManyRelationConfig = Q.IManyRelationConfig<'selectionStages', SelectionStageSelectableField, SelectionStageSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISelectionStageAsOneRelationQuery = Q.IAsOneRelationQuery<ISelectionStage, SelectionStageSelectableField>;

export type ISelectionStageAsManyRelationQuery = Q.IAsManyRelationQuery<ISelectionStage, SelectionStageSelectableField, SelectionStageSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISelectionStageRelationMap extends Record<SelectionStageRelationKey, unknown> {
  selectionProcedure: SelectionProcedureTypes.ISelectionProcedureAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISelectionStageRelationQueries = Q.IBaseRelationQueries<ISelectionStage, SelectionStageRelationKey, ISelectionStageRelationMap>;

export type ISelectionStageItemQuery = Q.IBaseItemQuery<
  ISelectionStage,
  SelectionStageRelationKey,
  SelectionStageSelectableField,
  SelectionStageRelationKey,
  SelectionStageSelectableField,
  ISelectionStageRelationMap,
  ISelectionStageRelationQueries
>;

export type ISelectionStageListQuery = Q.IBaseListQuery<
  ISelectionStage,
  SelectionStageRelationKey,
  SelectionStageSelectableField,
  SelectionStageSortableField,
  SelectionStageRelationKey,
  SelectionStageSelectableField,
  SelectionStageSortableField,
  SelectionStageDateRangeField,
  SelectionStageFilterableField,
  ISelectionStageRelationMap,
  ISelectionStageRelationQueries,
  ISelectionStageItemQuery
>;