// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BillsConfig from "#/modules/governance/schema/types/bills/bills.config";
import * as HansardsConfig from "#/modules/governance/schema/types/hansards/hansards.config";
import * as HoldersConfig from "#/modules/governance/schema/types/holders/holders.config";
import * as MotionsConfig from "#/modules/governance/schema/types/motions/motions.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISpeeches,
  SpeechesKey,
  SpeechesRelationKey,
  SpeechesSortableField,
  SpeechesFilterableField,
  SpeechesDateRangeField,
  SpeechesSelectableField,
  ISpeechesAsOneRelationConfig,
  ISpeechesAsManyRelationConfig,
} from "./speeches.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SPEECHES_RELATION_KEYS = [
  "bill",
  "hansard",
  "holder",
  "motion",
  "sitting",
  "sourceCitation",
  "speechKind",
] as const satisfies readonly SpeechesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SPEECHES_SORTABLE_FIELDS = [
  "billId",
  "code",
  "createdAt",
  "deletedAt",
  "hansardId",
  "holderId",
  "id",
  "motionId",
  "pageReference",
  "position",
  "sittingId",
  "sourceCitationId",
  "speechKindId",
  "summary",
  "updatedAt",
  "version",
  "wordCount",
] as const satisfies readonly SpeechesKey[];

export const SPEECHES_SEARCHABLE_FIELDS = [
  "code",
  "pageReference",
  "summary",
] as const satisfies readonly SpeechesKey[];

export const SPEECHES_FILTERABLE_FIELDS = [
  "billId",
  "hansardId",
  "holderId",
  "id",
  "motionId",
  "sittingId",
  "sourceCitationId",
  "speechKindId",
] as const satisfies readonly SpeechesKey[];

export const SPEECHES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SpeechesKey[];

export const SPEECHES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISpeeches> = {
  searchableFields: [...SPEECHES_SEARCHABLE_FIELDS],
  filterFields: [...SPEECHES_FILTERABLE_FIELDS],
  dateRangeFields: [...SPEECHES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SPEECHES_SELECTABLE_FIELDS = [
  "billId",
  "code",
  "createdAt",
  "deletedAt",
  "hansardId",
  "holderId",
  "id",
  "motionId",
  "pageReference",
  "position",
  "sittingId",
  "sourceCitationId",
  "speechKindId",
  "summary",
  "updatedAt",
  "version",
  "wordCount",
] as const satisfies readonly SpeechesKey[];

export const SPEECHES_DEFAULT_SELECT_FIELDS = [
  "billId",
  "code",
  "createdAt",
  "deletedAt",
  "hansardId",
  "holderId",
  "id",
  "motionId",
  "pageReference",
  "position",
  "sittingId",
  "sourceCitationId",
  "speechKindId",
  "summary",
  "updatedAt",
  "version",
  "wordCount",
] as const satisfies readonly SpeechesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SPEECHES_EDITABLE_FIELDS = [
  "billId",
  "code",
  "hansardId",
  "holderId",
  "motionId",
  "pageReference",
  "position",
  "sittingId",
  "sourceCitationId",
  "speechKindId",
  "summary",
  "wordCount",
] as const satisfies readonly SpeechesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SPEECHES_AS_ONE_RELATION_CONFIG = {
  relation: "speeches",
  type: ERelationType.One,
  selectableFields: SPEECHES_SELECTABLE_FIELDS,
  defaultSelectFields: SPEECHES_DEFAULT_SELECT_FIELDS,
} as const satisfies ISpeechesAsOneRelationConfig;

export const SPEECHES_AS_MANY_RELATION_CONFIG = {
  relation: "speeches",
  type: ERelationType.Many,
  selectableFields: SPEECHES_SELECTABLE_FIELDS,
  defaultSelectFields: SPEECHES_DEFAULT_SELECT_FIELDS,
  sortableFields: SPEECHES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISpeechesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SPEECHES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => BillsConfig.BILLS_AS_ONE_RELATION_CONFIG,
    "bill",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => HansardsConfig.HANSARDS_AS_ONE_RELATION_CONFIG,
    "hansard",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => HoldersConfig.HOLDERS_AS_ONE_RELATION_CONFIG,
    "holder",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => MotionsConfig.MOTIONS_AS_ONE_RELATION_CONFIG,
    "motion",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<SpeechesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "speechKind",
  ),
] as const;

export const SPEECHES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SPEECHES_QUERY_OPTIONS = {
  searchableFields: SPEECHES_SEARCHABLE_FIELDS,
  selectableFields: SPEECHES_SELECTABLE_FIELDS,
  defaultSelectFields: SPEECHES_DEFAULT_SELECT_FIELDS,
  sortableFields: SPEECHES_SORTABLE_FIELDS,
  filterFields: SPEECHES_FILTERABLE_FIELDS,
  dateRangeFields: SPEECHES_DATE_RANGE_FIELDS,
  relationKeys: SPEECHES_RELATION_KEYS,
  editableFields: SPEECHES_EDITABLE_FIELDS,
  asOne: SPEECHES_AS_ONE_RELATION_CONFIG,
  asMany: SPEECHES_AS_MANY_RELATION_CONFIG,
  oneRelations: SPEECHES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SPEECHES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISpeeches,
  SpeechesSortableField,
  SpeechesSelectableField,
  SpeechesFilterableField,
  SpeechesDateRangeField,
  SpeechesRelationKey,
  typeof SPEECHES_ONE_RELATION_QUERY_OPTIONS,
  typeof SPEECHES_MANY_RELATION_QUERY_OPTIONS
>;
