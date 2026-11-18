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
import * as BillsConfig from "#/modules/governance/schema/types/bills/bills.config";
import * as MotionsConfig from "#/modules/governance/schema/types/motions/motions.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAgenda,
  AgendaKey,
  AgendaRelationKey,
  AgendaSortableField,
  AgendaFilterableField,
  AgendaDateRangeField,
  AgendaSelectableField,
  IAgendaAsOneRelationConfig,
  IAgendaAsManyRelationConfig,
} from "./agenda.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const AGENDA_RELATION_KEYS = [
  "agendaKind",
  "bill",
  "motion",
  "sitting",
  "sourceCitation",
] as const satisfies readonly AgendaKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const AGENDA_SORTABLE_FIELDS = [
  "agendaKindId",
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "position",
  "sittingId",
  "sourceCitationId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly AgendaKey[];

export const AGENDA_SEARCHABLE_FIELDS = ["title"] as const satisfies readonly AgendaKey[];

export const AGENDA_FILTERABLE_FIELDS = [
  "agendaKindId",
  "billId",
  "id",
  "motionId",
  "sittingId",
  "sourceCitationId",
] as const satisfies readonly AgendaKey[];

export const AGENDA_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly AgendaKey[];

export const AGENDA_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAgenda> = {
  searchableFields: [...AGENDA_SEARCHABLE_FIELDS],
  filterFields: [...AGENDA_FILTERABLE_FIELDS],
  dateRangeFields: [...AGENDA_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const AGENDA_SELECTABLE_FIELDS = [
  "agendaKindId",
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "position",
  "sittingId",
  "sourceCitationId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly AgendaKey[];

export const AGENDA_DEFAULT_SELECT_FIELDS = [
  "agendaKindId",
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "position",
  "sittingId",
  "sourceCitationId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly AgendaSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const AGENDA_EDITABLE_FIELDS = [
  "agendaKindId",
  "billId",
  "motionId",
  "position",
  "sittingId",
  "sourceCitationId",
  "title",
] as const satisfies readonly AgendaKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const AGENDA_AS_ONE_RELATION_CONFIG = {
  relation: "agenda",
  type: ERelationType.One,
  selectableFields: AGENDA_SELECTABLE_FIELDS,
  defaultSelectFields: AGENDA_DEFAULT_SELECT_FIELDS,
} as const satisfies IAgendaAsOneRelationConfig;

export const AGENDA_AS_MANY_RELATION_CONFIG = {
  relation: "agendas",
  type: ERelationType.Many,
  selectableFields: AGENDA_SELECTABLE_FIELDS,
  defaultSelectFields: AGENDA_DEFAULT_SELECT_FIELDS,
  sortableFields: AGENDA_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAgendaAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const AGENDA_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AgendaRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "agendaKind",
  ),
  Q.createRelationKeyMapper<AgendaRelationKey>().one(
    () => BillsConfig.BILLS_AS_ONE_RELATION_CONFIG,
    "bill",
  ),
  Q.createRelationKeyMapper<AgendaRelationKey>().one(
    () => MotionsConfig.MOTIONS_AS_ONE_RELATION_CONFIG,
    "motion",
  ),
  Q.createRelationKeyMapper<AgendaRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<AgendaRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const AGENDA_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const AGENDA_QUERY_OPTIONS = {
  searchableFields: AGENDA_SEARCHABLE_FIELDS,
  selectableFields: AGENDA_SELECTABLE_FIELDS,
  defaultSelectFields: AGENDA_DEFAULT_SELECT_FIELDS,
  sortableFields: AGENDA_SORTABLE_FIELDS,
  filterFields: AGENDA_FILTERABLE_FIELDS,
  dateRangeFields: AGENDA_DATE_RANGE_FIELDS,
  relationKeys: AGENDA_RELATION_KEYS,
  editableFields: AGENDA_EDITABLE_FIELDS,
  asOne: AGENDA_AS_ONE_RELATION_CONFIG,
  asMany: AGENDA_AS_MANY_RELATION_CONFIG,
  oneRelations: AGENDA_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: AGENDA_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAgenda,
  AgendaSortableField,
  AgendaSelectableField,
  AgendaFilterableField,
  AgendaDateRangeField,
  AgendaRelationKey,
  typeof AGENDA_ONE_RELATION_QUERY_OPTIONS,
  typeof AGENDA_MANY_RELATION_QUERY_OPTIONS
>;
