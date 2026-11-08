// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { StructureOwnerKind } from '#/types/website/structure-owner-kind.enum';
import type { StructureStatus } from '#/types/website/structure-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STRUCTURE_RELATION_KEYS,
  STRUCTURE_SORTABLE_FIELDS,
  STRUCTURE_SEARCHABLE_FIELDS,
  STRUCTURE_FILTERABLE_FIELDS,
  STRUCTURE_DATE_RANGE_FIELDS,
  STRUCTURE_SELECTABLE_FIELDS,
  STRUCTURE_DEFAULT_SELECT_FIELDS,
  STRUCTURE_EDITABLE_FIELDS
} from './structure.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Structure */
export interface IStructure extends B.IBase {
  currentVersionId: string | null;
  ownerId: string;
  ownerKind: StructureOwnerKind;
  purpose: string;
  status: StructureStatus;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StructureKey = keyof IStructure;

export type StructureRelationKey = (typeof STRUCTURE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStructureReadonlyFields = B.IBaseReadonlyFields;

export type IStructureContextualFields = never;

export type IStructureSensitiveFields = never;

export type IStructureTransitionFields = never;

export type IStructureImmutableFields =
  | IStructureReadonlyFields
  | IStructureContextualFields
  | IStructureSensitiveFields
  | IStructureTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStructureCreatable = Omit<IStructure, IStructureImmutableFields | StructureRelationKey>;

export type IStructureSystemWritable = Omit<IStructure, B.IBaseReadonlyFields | StructureRelationKey>;

export type IStructureUpdatable = Partial<Omit<IStructure, IStructureImmutableFields | StructureRelationKey>>;

export interface IStructureTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StructureSortableField = (typeof STRUCTURE_SORTABLE_FIELDS)[number];

export type StructureSearchableField = (typeof STRUCTURE_SEARCHABLE_FIELDS)[number];

export type StructureFilterableField = (typeof STRUCTURE_FILTERABLE_FIELDS)[number];

export type StructureDateRangeField = (typeof STRUCTURE_DATE_RANGE_FIELDS)[number];

export type StructureSelectableField = (typeof STRUCTURE_SELECTABLE_FIELDS)[number];

export type StructureDefaultSelectField = (typeof STRUCTURE_DEFAULT_SELECT_FIELDS)[number];

export type StructureEditableField = (typeof STRUCTURE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStructureAsOneRelationConfig = Q.IOneRelationConfig<'structure', StructureSelectableField>;

export type IStructureAsManyRelationConfig = Q.IManyRelationConfig<'structures', StructureSelectableField, StructureSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStructureAsOneRelationQuery = Q.IAsOneRelationQuery<IStructure, StructureSelectableField>;

export type IStructureAsManyRelationQuery = Q.IAsManyRelationQuery<IStructure, StructureSelectableField, StructureSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStructureRelationMap extends Record<StructureRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStructureRelationQueries = Q.IBaseRelationQueries<IStructure, StructureRelationKey, IStructureRelationMap>;

export type IStructureItemQuery = Q.IBaseItemQuery<
  IStructure,
  StructureRelationKey,
  StructureSelectableField,
  StructureRelationKey,
  StructureSelectableField,
  IStructureRelationMap,
  IStructureRelationQueries
>;

export type IStructureListQuery = Q.IBaseListQuery<
  IStructure,
  StructureRelationKey,
  StructureSelectableField,
  StructureSortableField,
  StructureRelationKey,
  StructureSelectableField,
  StructureSortableField,
  StructureDateRangeField,
  StructureFilterableField,
  IStructureRelationMap,
  IStructureRelationQueries,
  IStructureItemQuery
>;