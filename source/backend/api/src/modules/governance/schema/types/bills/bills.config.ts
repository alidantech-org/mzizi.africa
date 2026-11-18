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
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as HoldersConfig from "#/modules/governance/schema/types/holders/holders.config";
import * as TermsConfig from "#/modules/governance/schema/types/terms/terms.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBills,
  BillsKey,
  BillsRelationKey,
  BillsSortableField,
  BillsFilterableField,
  BillsDateRangeField,
  BillsSelectableField,
  IBillsAsOneRelationConfig,
  IBillsAsManyRelationConfig,
} from "./bills.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BILLS_RELATION_KEYS = [
  "billKind",
  "country",
  "institution",
  "instrument",
  "sourceCitation",
  "sponsorHolder",
  "status",
  "term",
] as const satisfies readonly BillsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BILLS_SORTABLE_FIELDS = [
  "billKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "instrumentId",
  "sourceCitationId",
  "sponsorHolderId",
  "statusId",
  "summary",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly BillsKey[];

export const BILLS_SEARCHABLE_FIELDS = [
  "code",
  "summary",
  "title",
] as const satisfies readonly BillsKey[];

export const BILLS_FILTERABLE_FIELDS = [
  "billKindId",
  "countryId",
  "id",
  "institutionId",
  "instrumentId",
  "sourceCitationId",
  "sponsorHolderId",
  "statusId",
  "termId",
] as const satisfies readonly BillsKey[];

export const BILLS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly BillsKey[];

export const BILLS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBills> = {
  searchableFields: [...BILLS_SEARCHABLE_FIELDS],
  filterFields: [...BILLS_FILTERABLE_FIELDS],
  dateRangeFields: [...BILLS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BILLS_SELECTABLE_FIELDS = [
  "billKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "instrumentId",
  "sourceCitationId",
  "sponsorHolderId",
  "statusId",
  "summary",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly BillsKey[];

export const BILLS_DEFAULT_SELECT_FIELDS = [
  "billKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "institutionId",
  "instrumentId",
  "sourceCitationId",
  "sponsorHolderId",
  "statusId",
  "summary",
  "termId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly BillsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BILLS_EDITABLE_FIELDS = [
  "billKindId",
  "code",
  "countryId",
  "institutionId",
  "instrumentId",
  "sourceCitationId",
  "sponsorHolderId",
  "statusId",
  "summary",
  "termId",
  "title",
] as const satisfies readonly BillsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BILLS_AS_ONE_RELATION_CONFIG = {
  relation: "bills",
  type: ERelationType.One,
  selectableFields: BILLS_SELECTABLE_FIELDS,
  defaultSelectFields: BILLS_DEFAULT_SELECT_FIELDS,
} as const satisfies IBillsAsOneRelationConfig;

export const BILLS_AS_MANY_RELATION_CONFIG = {
  relation: "bills",
  type: ERelationType.Many,
  selectableFields: BILLS_SELECTABLE_FIELDS,
  defaultSelectFields: BILLS_DEFAULT_SELECT_FIELDS,
  sortableFields: BILLS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBillsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BILLS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "billKind",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => HoldersConfig.HOLDERS_AS_ONE_RELATION_CONFIG,
    "sponsorHolder",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
  Q.createRelationKeyMapper<BillsRelationKey>().one(
    () => TermsConfig.TERMS_AS_ONE_RELATION_CONFIG,
    "term",
  ),
] as const;

export const BILLS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BILLS_QUERY_OPTIONS = {
  searchableFields: BILLS_SEARCHABLE_FIELDS,
  selectableFields: BILLS_SELECTABLE_FIELDS,
  defaultSelectFields: BILLS_DEFAULT_SELECT_FIELDS,
  sortableFields: BILLS_SORTABLE_FIELDS,
  filterFields: BILLS_FILTERABLE_FIELDS,
  dateRangeFields: BILLS_DATE_RANGE_FIELDS,
  relationKeys: BILLS_RELATION_KEYS,
  editableFields: BILLS_EDITABLE_FIELDS,
  asOne: BILLS_AS_ONE_RELATION_CONFIG,
  asMany: BILLS_AS_MANY_RELATION_CONFIG,
  oneRelations: BILLS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BILLS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBills,
  BillsSortableField,
  BillsSelectableField,
  BillsFilterableField,
  BillsDateRangeField,
  BillsRelationKey,
  typeof BILLS_ONE_RELATION_QUERY_OPTIONS,
  typeof BILLS_MANY_RELATION_QUERY_OPTIONS
>;
