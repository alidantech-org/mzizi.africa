// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as OfficesConfig from "#/modules/governance/schema/types/offices/offices.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IMandates,
  MandatesKey,
  MandatesRelationKey,
  MandatesSortableField,
  MandatesFilterableField,
  MandatesDateRangeField,
  MandatesSelectableField,
  IMandatesAsOneRelationConfig,
  IMandatesAsManyRelationConfig,
} from "./mandates.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANDATES_RELATION_KEYS = [
  "institution",
  "mandateKind",
  "office",
  "sourceCitation",
] as const satisfies readonly MandatesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANDATES_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "institutionId",
  "mandateKindId",
  "officeId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly MandatesKey[];

export const MANDATES_SEARCHABLE_FIELDS = ["description"] as const satisfies readonly MandatesKey[];

export const MANDATES_FILTERABLE_FIELDS = [
  "id",
  "institutionId",
  "mandateKindId",
  "officeId",
  "sourceCitationId",
] as const satisfies readonly MandatesKey[];

export const MANDATES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly MandatesKey[];

export const MANDATES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IMandates> = {
  searchableFields: [...MANDATES_SEARCHABLE_FIELDS],
  filterFields: [...MANDATES_FILTERABLE_FIELDS],
  dateRangeFields: [...MANDATES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANDATES_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "institutionId",
  "mandateKindId",
  "officeId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly MandatesKey[];

export const MANDATES_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "institutionId",
  "mandateKindId",
  "officeId",
  "sourceCitationId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly MandatesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANDATES_EDITABLE_FIELDS = [
  "description",
  "institutionId",
  "mandateKindId",
  "officeId",
  "sourceCitationId",
  "validFrom",
  "validUntil",
] as const satisfies readonly MandatesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANDATES_AS_ONE_RELATION_CONFIG = {
  relation: "mandates",
  type: ERelationType.One,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS,
} as const satisfies IMandatesAsOneRelationConfig;

export const MANDATES_AS_MANY_RELATION_CONFIG = {
  relation: "mandates",
  type: ERelationType.Many,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANDATES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IMandatesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANDATES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<MandatesRelationKey>().one(
    InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(
    ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "mandateKind",
  ),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(
    OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG,
    "office",
  ),
  Q.createRelationKeyMapper<MandatesRelationKey>().one(
    CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const MANDATES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANDATES_QUERY_OPTIONS = {
  searchableFields: MANDATES_SEARCHABLE_FIELDS,
  selectableFields: MANDATES_SELECTABLE_FIELDS,
  defaultSelectFields: MANDATES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANDATES_SORTABLE_FIELDS,
  filterFields: MANDATES_FILTERABLE_FIELDS,
  dateRangeFields: MANDATES_DATE_RANGE_FIELDS,
  relationKeys: MANDATES_RELATION_KEYS,
  editableFields: MANDATES_EDITABLE_FIELDS,
  asOne: MANDATES_AS_ONE_RELATION_CONFIG,
  asMany: MANDATES_AS_MANY_RELATION_CONFIG,
  oneRelations: MANDATES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANDATES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IMandates,
  MandatesSortableField,
  MandatesSelectableField,
  MandatesFilterableField,
  MandatesDateRangeField,
  MandatesRelationKey,
  typeof MANDATES_ONE_RELATION_QUERY_OPTIONS,
  typeof MANDATES_MANY_RELATION_QUERY_OPTIONS
>;
