// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { TemplateProduct } from "#/modules/reference/schema/enum/template-product.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as LevelsTypes from "#/modules/geography/schema/types/levels/levels.types";
import type * as PatternTypes from "#/modules/reference/schema/types/pattern/pattern.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TEMPLATE_RELATION_KEYS,
  TEMPLATE_SORTABLE_FIELDS,
  TEMPLATE_SEARCHABLE_FIELDS,
  TEMPLATE_FILTERABLE_FIELDS,
  TEMPLATE_DATE_RANGE_FIELDS,
  TEMPLATE_SELECTABLE_FIELDS,
  TEMPLATE_DEFAULT_SELECT_FIELDS,
  TEMPLATE_EDITABLE_FIELDS,
} from "./template.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people. */
export interface ITemplate extends B.IBase {
  armId: string | null;
  classId: string | null;
  code: string;
  codeTemplate: string;
  fanOutLevelId: string | null;
  institutionKindId: string | null;
  nameTemplate: string;
  parentTemplateId: string | null;
  patternId: string;
  produces: TemplateProduct;
  roleId: string | null;
  seatBasisId: string | null;
  seatCount: number | null;
  selectionMethodId: string | null;
  sourceCitationId: string | null;
  termLimit: number | null;
  termYears: number | null;
  readonly arm?: ValueTypes.IValue;
  readonly class?: ValueTypes.IValue;
  readonly fanOutLevel?: LevelsTypes.ILevels;
  readonly institutionKind?: ValueTypes.IValue;
  readonly parentTemplate?: ITemplate;
  readonly pattern?: PatternTypes.IPattern;
  readonly role?: ValueTypes.IValue;
  readonly seatBasis?: ValueTypes.IValue;
  readonly selectionMethod?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TemplateKey = keyof ITemplate;

export type TemplateRelationKey = (typeof TEMPLATE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITemplateReadonlyFields = B.IBaseReadonlyFields;

export type ITemplateContextualFields = never;

export type ITemplateSensitiveFields = never;

export type ITemplateTransitionFields = never;

export type ITemplateImmutableFields =
  | ITemplateReadonlyFields
  | ITemplateContextualFields
  | ITemplateSensitiveFields
  | ITemplateTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITemplateCreatable = Omit<ITemplate, ITemplateImmutableFields | TemplateRelationKey>;

export type ITemplateSystemWritable = Omit<ITemplate, B.IBaseReadonlyFields | TemplateRelationKey>;

export type ITemplateUpdatable = Partial<
  Omit<ITemplate, ITemplateImmutableFields | TemplateRelationKey>
>;

export interface ITemplateTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TemplateSortableField = (typeof TEMPLATE_SORTABLE_FIELDS)[number];

export type TemplateSearchableField = (typeof TEMPLATE_SEARCHABLE_FIELDS)[number];

export type TemplateFilterableField = (typeof TEMPLATE_FILTERABLE_FIELDS)[number];

export type TemplateDateRangeField = (typeof TEMPLATE_DATE_RANGE_FIELDS)[number];

export type TemplateSelectableField = (typeof TEMPLATE_SELECTABLE_FIELDS)[number];

export type TemplateDefaultSelectField = (typeof TEMPLATE_DEFAULT_SELECT_FIELDS)[number];

export type TemplateEditableField = (typeof TEMPLATE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITemplateAsOneRelationConfig = Q.IOneRelationConfig<
  "template",
  TemplateSelectableField
>;

export type ITemplateAsManyRelationConfig = Q.IManyRelationConfig<
  "templates",
  TemplateSelectableField,
  TemplateSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITemplateAsOneRelationQuery = Q.IAsOneRelationQuery<ITemplate, TemplateSelectableField>;

export type ITemplateAsManyRelationQuery = Q.IAsManyRelationQuery<
  ITemplate,
  TemplateSelectableField,
  TemplateSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITemplateRelationMap extends Record<TemplateRelationKey, unknown> {
  arm: ValueTypes.IValueAsOneRelationQuery;
  class: ValueTypes.IValueAsOneRelationQuery;
  fanOutLevel: LevelsTypes.ILevelsAsOneRelationQuery;
  institutionKind: ValueTypes.IValueAsOneRelationQuery;
  parentTemplate: ITemplateAsOneRelationQuery;
  pattern: PatternTypes.IPatternAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
  seatBasis: ValueTypes.IValueAsOneRelationQuery;
  selectionMethod: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITemplateRelationQueries = Q.IBaseRelationQueries<
  ITemplate,
  TemplateRelationKey,
  ITemplateRelationMap
>;

export type ITemplateItemQuery = Q.IBaseItemQuery<
  ITemplate,
  TemplateRelationKey,
  TemplateSelectableField,
  TemplateRelationKey,
  TemplateSelectableField,
  ITemplateRelationMap,
  ITemplateRelationQueries
>;

export type ITemplateListQuery = Q.IBaseListQuery<
  ITemplate,
  TemplateRelationKey,
  TemplateSelectableField,
  TemplateSortableField,
  TemplateRelationKey,
  TemplateSelectableField,
  TemplateSortableField,
  TemplateDateRangeField,
  TemplateFilterableField,
  ITemplateRelationMap,
  ITemplateRelationQueries,
  ITemplateItemQuery
>;
