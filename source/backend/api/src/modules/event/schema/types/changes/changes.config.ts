// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IChanges,
  ChangesKey,
  ChangesRelationKey,
  ChangesSortableField,
  ChangesFilterableField,
  ChangesDateRangeField,
  ChangesSelectableField,
  IChangesAsOneRelationConfig,
  IChangesAsManyRelationConfig,
} from "./changes.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CHANGES_RELATION_KEYS = [
  "authorityEntity",
  "basisProvision",
  "changeKind",
  "occurrence",
  "reason",
  "replacementOccurrence",
  "sourceCitation",
] as const satisfies readonly ChangesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CHANGES_SORTABLE_FIELDS = [
  "authorityEntityId",
  "basisProvisionId",
  "changeKindId",
  "code",
  "createdAt",
  "decidedOn",
  "deletedAt",
  "explanation",
  "fromOn",
  "id",
  "occurrenceId",
  "reasonId",
  "replacementOccurrenceId",
  "sourceCitationId",
  "toOn",
  "updatedAt",
  "version",
] as const satisfies readonly ChangesKey[];

export const CHANGES_SEARCHABLE_FIELDS = [
  "code",
  "explanation",
] as const satisfies readonly ChangesKey[];

export const CHANGES_FILTERABLE_FIELDS = [
  "authorityEntityId",
  "basisProvisionId",
  "changeKindId",
  "id",
  "occurrenceId",
  "reasonId",
  "replacementOccurrenceId",
  "sourceCitationId",
] as const satisfies readonly ChangesKey[];

export const CHANGES_DATE_RANGE_FIELDS = [
  "createdAt",
  "decidedOn",
  "deletedAt",
  "fromOn",
  "toOn",
  "updatedAt",
] as const satisfies readonly ChangesKey[];

export const CHANGES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IChanges> = {
  searchableFields: [...CHANGES_SEARCHABLE_FIELDS],
  filterFields: [...CHANGES_FILTERABLE_FIELDS],
  dateRangeFields: [...CHANGES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CHANGES_SELECTABLE_FIELDS = [
  "authorityEntityId",
  "basisProvisionId",
  "changeKindId",
  "code",
  "createdAt",
  "decidedOn",
  "deletedAt",
  "explanation",
  "fromOn",
  "id",
  "occurrenceId",
  "reasonId",
  "replacementOccurrenceId",
  "sourceCitationId",
  "toOn",
  "updatedAt",
  "version",
] as const satisfies readonly ChangesKey[];

export const CHANGES_DEFAULT_SELECT_FIELDS = [
  "authorityEntityId",
  "basisProvisionId",
  "changeKindId",
  "code",
  "createdAt",
  "decidedOn",
  "deletedAt",
  "explanation",
  "fromOn",
  "id",
  "occurrenceId",
  "reasonId",
  "replacementOccurrenceId",
  "sourceCitationId",
  "toOn",
  "updatedAt",
  "version",
] as const satisfies readonly ChangesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CHANGES_EDITABLE_FIELDS = [
  "authorityEntityId",
  "basisProvisionId",
  "changeKindId",
  "code",
  "decidedOn",
  "explanation",
  "fromOn",
  "occurrenceId",
  "reasonId",
  "replacementOccurrenceId",
  "sourceCitationId",
  "toOn",
] as const satisfies readonly ChangesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CHANGES_AS_ONE_RELATION_CONFIG = {
  relation: "changes",
  type: ERelationType.One,
  selectableFields: CHANGES_SELECTABLE_FIELDS,
  defaultSelectFields: CHANGES_DEFAULT_SELECT_FIELDS,
} as const satisfies IChangesAsOneRelationConfig;

export const CHANGES_AS_MANY_RELATION_CONFIG = {
  relation: "changes",
  type: ERelationType.Many,
  selectableFields: CHANGES_SELECTABLE_FIELDS,
  defaultSelectFields: CHANGES_DEFAULT_SELECT_FIELDS,
  sortableFields: CHANGES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IChangesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CHANGES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "authorityEntity",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "changeKind",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "reason",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "replacementOccurrence",
  ),
  Q.createRelationKeyMapper<ChangesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const CHANGES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CHANGES_QUERY_OPTIONS = {
  searchableFields: CHANGES_SEARCHABLE_FIELDS,
  selectableFields: CHANGES_SELECTABLE_FIELDS,
  defaultSelectFields: CHANGES_DEFAULT_SELECT_FIELDS,
  sortableFields: CHANGES_SORTABLE_FIELDS,
  filterFields: CHANGES_FILTERABLE_FIELDS,
  dateRangeFields: CHANGES_DATE_RANGE_FIELDS,
  relationKeys: CHANGES_RELATION_KEYS,
  editableFields: CHANGES_EDITABLE_FIELDS,
  asOne: CHANGES_AS_ONE_RELATION_CONFIG,
  asMany: CHANGES_AS_MANY_RELATION_CONFIG,
  oneRelations: CHANGES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CHANGES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IChanges,
  ChangesSortableField,
  ChangesSelectableField,
  ChangesFilterableField,
  ChangesDateRangeField,
  ChangesRelationKey,
  typeof CHANGES_ONE_RELATION_QUERY_OPTIONS,
  typeof CHANGES_MANY_RELATION_QUERY_OPTIONS
>;
