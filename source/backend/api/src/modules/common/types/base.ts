// ----------------------------------
// BASE ENTITY
// ----------------------------------

export interface IBase {
  id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly version: number;
}

// ----------------------------------
// CONST TUPLE HELPER
// ----------------------------------

export const tuple =
  <TKey extends PropertyKey>() =>
  <const TFields extends readonly TKey[]>(fields: TFields) =>
    fields as TFields;

// ----------------------------------
// BASE KEYS
// ----------------------------------

export type IBaseKey = keyof IBase;

const baseKeys = tuple<IBaseKey>();

// ----------------------------------
// BASE FIELD CONSTANTS
// ----------------------------------

export const BASE_READONLY_FIELDS = baseKeys(['createdAt', 'updatedAt', 'deletedAt', 'version', 'id']);

export const BASE_SORTABLE_FIELDS = baseKeys(['id', 'createdAt', 'updatedAt']);

export const BASE_DATE_RANGE_FIELDS = baseKeys(['createdAt', 'updatedAt']);

export const BASE_SELECTABLE_FIELDS = baseKeys(['id', 'createdAt', 'updatedAt']);

export const BASE_DEFAULT_SELECT_FIELDS = baseKeys(['id', 'createdAt']);

// ----------------------------------
// BASE FIELD TYPES
// ----------------------------------

export type IBaseReadonlyFields = (typeof BASE_READONLY_FIELDS)[number];

export type BaseSortableField = (typeof BASE_SORTABLE_FIELDS)[number];

export type BaseDateRangeField = (typeof BASE_DATE_RANGE_FIELDS)[number];

export type BaseSelectableField = (typeof BASE_SELECTABLE_FIELDS)[number];

export type BaseDefaultSelectField = (typeof BASE_DEFAULT_SELECT_FIELDS)[number];
