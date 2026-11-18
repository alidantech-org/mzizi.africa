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
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as TermsConfig from "#/modules/governance/schema/types/terms/terms.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISittings,
  SittingsKey,
  SittingsRelationKey,
  SittingsSortableField,
  SittingsFilterableField,
  SittingsDateRangeField,
  SittingsSelectableField,
  ISittingsAsOneRelationConfig,
  ISittingsAsManyRelationConfig,
} from "./sittings.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITTINGS_RELATION_KEYS = [
  "institution",
  "occurrence",
  "sittingKind",
  "sourceCitation",
  "term",
] as const satisfies readonly SittingsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITTINGS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "occurrenceId",
  "sequenceNumber",
  "sessionLabel",
  "sittingKindId",
  "sourceCitationId",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SittingsKey[];

export const SITTINGS_SEARCHABLE_FIELDS = [
  "code",
  "sessionLabel",
  "title",
] as const satisfies readonly SittingsKey[];

export const SITTINGS_FILTERABLE_FIELDS = [
  "id",
  "institutionId",
  "occurrenceId",
  "sittingKindId",
  "sourceCitationId",
  "termId",
] as const satisfies readonly SittingsKey[];

export const SITTINGS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SittingsKey[];

export const SITTINGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISittings> = {
  searchableFields: [...SITTINGS_SEARCHABLE_FIELDS],
  filterFields: [...SITTINGS_FILTERABLE_FIELDS],
  dateRangeFields: [...SITTINGS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITTINGS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "occurrenceId",
  "sequenceNumber",
  "sessionLabel",
  "sittingKindId",
  "sourceCitationId",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SittingsKey[];

export const SITTINGS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "occurrenceId",
  "sequenceNumber",
  "sessionLabel",
  "sittingKindId",
  "sourceCitationId",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SittingsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITTINGS_EDITABLE_FIELDS = [
  "code",
  "institutionId",
  "occurrenceId",
  "sequenceNumber",
  "sessionLabel",
  "sittingKindId",
  "sourceCitationId",
  "termId",
  "title",
] as const satisfies readonly SittingsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITTINGS_AS_ONE_RELATION_CONFIG = {
  relation: "sittings",
  type: ERelationType.One,
  selectableFields: SITTINGS_SELECTABLE_FIELDS,
  defaultSelectFields: SITTINGS_DEFAULT_SELECT_FIELDS,
} as const satisfies ISittingsAsOneRelationConfig;

export const SITTINGS_AS_MANY_RELATION_CONFIG = {
  relation: "sittings",
  type: ERelationType.Many,
  selectableFields: SITTINGS_SELECTABLE_FIELDS,
  defaultSelectFields: SITTINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: SITTINGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISittingsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITTINGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SittingsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<SittingsRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<SittingsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "sittingKind",
  ),
  Q.createRelationKeyMapper<SittingsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<SittingsRelationKey>().one(
    () => TermsConfig.TERMS_AS_ONE_RELATION_CONFIG,
    "term",
  ),
] as const;

export const SITTINGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITTINGS_QUERY_OPTIONS = {
  searchableFields: SITTINGS_SEARCHABLE_FIELDS,
  selectableFields: SITTINGS_SELECTABLE_FIELDS,
  defaultSelectFields: SITTINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: SITTINGS_SORTABLE_FIELDS,
  filterFields: SITTINGS_FILTERABLE_FIELDS,
  dateRangeFields: SITTINGS_DATE_RANGE_FIELDS,
  relationKeys: SITTINGS_RELATION_KEYS,
  editableFields: SITTINGS_EDITABLE_FIELDS,
  asOne: SITTINGS_AS_ONE_RELATION_CONFIG,
  asMany: SITTINGS_AS_MANY_RELATION_CONFIG,
  oneRelations: SITTINGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITTINGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISittings,
  SittingsSortableField,
  SittingsSelectableField,
  SittingsFilterableField,
  SittingsDateRangeField,
  SittingsRelationKey,
  typeof SITTINGS_ONE_RELATION_QUERY_OPTIONS,
  typeof SITTINGS_MANY_RELATION_QUERY_OPTIONS
>;
