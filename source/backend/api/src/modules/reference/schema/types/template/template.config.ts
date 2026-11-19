// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as LevelsConfig from "#/modules/geography/schema/types/levels/levels.config";
import * as PatternConfig from "#/modules/reference/schema/types/pattern/pattern.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ITemplate,
  TemplateKey,
  TemplateRelationKey,
  TemplateSortableField,
  TemplateFilterableField,
  TemplateDateRangeField,
  TemplateSelectableField,
  ITemplateAsOneRelationConfig,
  ITemplateAsManyRelationConfig,
} from "./template.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TEMPLATE_RELATION_KEYS = [
  "arm",
  "class",
  "fanOutLevel",
  "institutionKind",
  "parentTemplate",
  "pattern",
  "role",
  "seatBasis",
  "selectionMethod",
  "sourceCitation",
] as const satisfies readonly TemplateKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TEMPLATE_SORTABLE_FIELDS = [
  "armId",
  "classId",
  "code",
  "codeTemplate",
  "createdAt",
  "deletedAt",
  "fanOutLevelId",
  "id",
  "institutionKindId",
  "nameTemplate",
  "parentTemplateId",
  "patternId",
  "produces",
  "roleId",
  "seatBasisId",
  "seatCount",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "updatedAt",
  "version",
] as const satisfies readonly TemplateKey[];

export const TEMPLATE_SEARCHABLE_FIELDS = [
  "code",
  "codeTemplate",
  "nameTemplate",
] as const satisfies readonly TemplateKey[];

export const TEMPLATE_FILTERABLE_FIELDS = [
  "armId",
  "classId",
  "fanOutLevelId",
  "id",
  "institutionKindId",
  "parentTemplateId",
  "patternId",
  "produces",
  "roleId",
  "seatBasisId",
  "selectionMethodId",
  "sourceCitationId",
] as const satisfies readonly TemplateKey[];

export const TEMPLATE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly TemplateKey[];

export const TEMPLATE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ITemplate> = {
  searchableFields: [...TEMPLATE_SEARCHABLE_FIELDS],
  filterFields: [...TEMPLATE_FILTERABLE_FIELDS],
  dateRangeFields: [...TEMPLATE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TEMPLATE_SELECTABLE_FIELDS = [
  "armId",
  "classId",
  "code",
  "codeTemplate",
  "createdAt",
  "deletedAt",
  "fanOutLevelId",
  "id",
  "institutionKindId",
  "nameTemplate",
  "parentTemplateId",
  "patternId",
  "produces",
  "roleId",
  "seatBasisId",
  "seatCount",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "updatedAt",
  "version",
] as const satisfies readonly TemplateKey[];

export const TEMPLATE_DEFAULT_SELECT_FIELDS = [
  "armId",
  "classId",
  "code",
  "codeTemplate",
  "createdAt",
  "deletedAt",
  "fanOutLevelId",
  "id",
  "institutionKindId",
  "nameTemplate",
  "parentTemplateId",
  "patternId",
  "produces",
  "roleId",
  "seatBasisId",
  "seatCount",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "updatedAt",
  "version",
] as const satisfies readonly TemplateSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TEMPLATE_EDITABLE_FIELDS = [
  "armId",
  "classId",
  "code",
  "codeTemplate",
  "fanOutLevelId",
  "institutionKindId",
  "nameTemplate",
  "parentTemplateId",
  "patternId",
  "produces",
  "roleId",
  "seatBasisId",
  "seatCount",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
] as const satisfies readonly TemplateKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TEMPLATE_AS_ONE_RELATION_CONFIG = {
  relation: "template",
  type: ERelationType.One,
  selectableFields: TEMPLATE_SELECTABLE_FIELDS,
  defaultSelectFields: TEMPLATE_DEFAULT_SELECT_FIELDS,
} as const satisfies ITemplateAsOneRelationConfig;

export const TEMPLATE_AS_MANY_RELATION_CONFIG = {
  relation: "templates",
  type: ERelationType.Many,
  selectableFields: TEMPLATE_SELECTABLE_FIELDS,
  defaultSelectFields: TEMPLATE_DEFAULT_SELECT_FIELDS,
  sortableFields: TEMPLATE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ITemplateAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TEMPLATE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "arm",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "class",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => LevelsConfig.LEVELS_AS_ONE_RELATION_CONFIG,
    "fanOutLevel",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "institutionKind",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => PatternConfig.PATTERN_AS_ONE_RELATION_CONFIG,
    "pattern",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "seatBasis",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "selectionMethod",
  ),
  Q.createRelationKeyMapper<TemplateRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const TEMPLATE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TEMPLATE_QUERY_OPTIONS = {
  searchableFields: TEMPLATE_SEARCHABLE_FIELDS,
  selectableFields: TEMPLATE_SELECTABLE_FIELDS,
  defaultSelectFields: TEMPLATE_DEFAULT_SELECT_FIELDS,
  sortableFields: TEMPLATE_SORTABLE_FIELDS,
  filterFields: TEMPLATE_FILTERABLE_FIELDS,
  dateRangeFields: TEMPLATE_DATE_RANGE_FIELDS,
  relationKeys: TEMPLATE_RELATION_KEYS,
  editableFields: TEMPLATE_EDITABLE_FIELDS,
  asOne: TEMPLATE_AS_ONE_RELATION_CONFIG,
  asMany: TEMPLATE_AS_MANY_RELATION_CONFIG,
  oneRelations: TEMPLATE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TEMPLATE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ITemplate,
  TemplateSortableField,
  TemplateSelectableField,
  TemplateFilterableField,
  TemplateDateRangeField,
  TemplateRelationKey,
  typeof TEMPLATE_ONE_RELATION_QUERY_OPTIONS,
  typeof TEMPLATE_MANY_RELATION_QUERY_OPTIONS
>;
