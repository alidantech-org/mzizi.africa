// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { VersionStatus } from '#/types/website/version-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as StructureTypes from '#/modules/website/types/structure.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STRUCTURE_VERSION_RELATION_KEYS,
  STRUCTURE_VERSION_SORTABLE_FIELDS,
  STRUCTURE_VERSION_SEARCHABLE_FIELDS,
  STRUCTURE_VERSION_FILTERABLE_FIELDS,
  STRUCTURE_VERSION_DATE_RANGE_FIELDS,
  STRUCTURE_VERSION_SELECTABLE_FIELDS,
  STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS,
  STRUCTURE_VERSION_EDITABLE_FIELDS
} from './structure-version.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Structure Version */
export interface IStructureVersion extends B.IBase {
  createdBy: string | null;
  folderId: string | null;
  manifestHash: string;
  methodId: string | null;
  notesSummary: string | null;
  number: number;
  schemaVersion: string;
  status: VersionStatus;
  structureId: string;
  supersedesId: string | null;
  validationReport: string | null;
  readonly structure?: StructureTypes.IStructure;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StructureVersionKey = keyof IStructureVersion;

export type StructureVersionRelationKey = (typeof STRUCTURE_VERSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStructureVersionReadonlyFields = B.IBaseReadonlyFields;

export type IStructureVersionContextualFields = never;

export type IStructureVersionSensitiveFields = never;

export type IStructureVersionTransitionFields = never;

export type IStructureVersionImmutableFields =
  | IStructureVersionReadonlyFields
  | IStructureVersionContextualFields
  | IStructureVersionSensitiveFields
  | IStructureVersionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStructureVersionCreatable = Omit<IStructureVersion, IStructureVersionImmutableFields | StructureVersionRelationKey>;

export type IStructureVersionSystemWritable = Omit<IStructureVersion, B.IBaseReadonlyFields | StructureVersionRelationKey>;

export type IStructureVersionUpdatable = Partial<Omit<IStructureVersion, IStructureVersionImmutableFields | StructureVersionRelationKey>>;

export interface IStructureVersionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StructureVersionSortableField = (typeof STRUCTURE_VERSION_SORTABLE_FIELDS)[number];

export type StructureVersionSearchableField = (typeof STRUCTURE_VERSION_SEARCHABLE_FIELDS)[number];

export type StructureVersionFilterableField = (typeof STRUCTURE_VERSION_FILTERABLE_FIELDS)[number];

export type StructureVersionDateRangeField = (typeof STRUCTURE_VERSION_DATE_RANGE_FIELDS)[number];

export type StructureVersionSelectableField = (typeof STRUCTURE_VERSION_SELECTABLE_FIELDS)[number];

export type StructureVersionDefaultSelectField = (typeof STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS)[number];

export type StructureVersionEditableField = (typeof STRUCTURE_VERSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStructureVersionAsOneRelationConfig = Q.IOneRelationConfig<'structureVersion', StructureVersionSelectableField>;

export type IStructureVersionAsManyRelationConfig = Q.IManyRelationConfig<'structureVersions', StructureVersionSelectableField, StructureVersionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStructureVersionAsOneRelationQuery = Q.IAsOneRelationQuery<IStructureVersion, StructureVersionSelectableField>;

export type IStructureVersionAsManyRelationQuery = Q.IAsManyRelationQuery<IStructureVersion, StructureVersionSelectableField, StructureVersionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStructureVersionRelationMap extends Record<StructureVersionRelationKey, unknown> {
  structure: StructureTypes.IStructureAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStructureVersionRelationQueries = Q.IBaseRelationQueries<IStructureVersion, StructureVersionRelationKey, IStructureVersionRelationMap>;

export type IStructureVersionItemQuery = Q.IBaseItemQuery<
  IStructureVersion,
  StructureVersionRelationKey,
  StructureVersionSelectableField,
  StructureVersionRelationKey,
  StructureVersionSelectableField,
  IStructureVersionRelationMap,
  IStructureVersionRelationQueries
>;

export type IStructureVersionListQuery = Q.IBaseListQuery<
  IStructureVersion,
  StructureVersionRelationKey,
  StructureVersionSelectableField,
  StructureVersionSortableField,
  StructureVersionRelationKey,
  StructureVersionSelectableField,
  StructureVersionSortableField,
  StructureVersionDateRangeField,
  StructureVersionFilterableField,
  IStructureVersionRelationMap,
  IStructureVersionRelationQueries,
  IStructureVersionItemQuery
>;