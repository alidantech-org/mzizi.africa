// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDomains,
  DomainsKey,
  DomainsRelationKey,
  DomainsSortableField,
  DomainsFilterableField,
  DomainsDateRangeField,
  DomainsSelectableField,
  IDomainsAsOneRelationConfig,
  IDomainsAsManyRelationConfig,
} from "./domains.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOMAINS_RELATION_KEYS = ["source"] as const satisfies readonly DomainsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOMAINS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "host",
  "id",
  "sourceId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_SEARCHABLE_FIELDS = ["code", "host"] as const satisfies readonly DomainsKey[];

export const DOMAINS_FILTERABLE_FIELDS = [
  "id",
  "sourceId",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDomains> = {
  searchableFields: [...DOMAINS_SEARCHABLE_FIELDS],
  filterFields: [...DOMAINS_FILTERABLE_FIELDS],
  dateRangeFields: [...DOMAINS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOMAINS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "host",
  "id",
  "sourceId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "host",
  "id",
  "sourceId",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly DomainsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOMAINS_EDITABLE_FIELDS = [
  "code",
  "host",
  "sourceId",
  "validFrom",
  "validUntil",
] as const satisfies readonly DomainsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOMAINS_AS_ONE_RELATION_CONFIG = {
  relation: "domains",
  type: ERelationType.One,
  selectableFields: DOMAINS_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAINS_DEFAULT_SELECT_FIELDS,
} as const satisfies IDomainsAsOneRelationConfig;

export const DOMAINS_AS_MANY_RELATION_CONFIG = {
  relation: "domains",
  type: ERelationType.Many,
  selectableFields: DOMAINS_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAINS_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAINS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDomainsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOMAINS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DomainsRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
] as const;

export const DOMAINS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOMAINS_QUERY_OPTIONS = {
  searchableFields: DOMAINS_SEARCHABLE_FIELDS,
  selectableFields: DOMAINS_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAINS_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAINS_SORTABLE_FIELDS,
  filterFields: DOMAINS_FILTERABLE_FIELDS,
  dateRangeFields: DOMAINS_DATE_RANGE_FIELDS,
  relationKeys: DOMAINS_RELATION_KEYS,
  editableFields: DOMAINS_EDITABLE_FIELDS,
  asOne: DOMAINS_AS_ONE_RELATION_CONFIG,
  asMany: DOMAINS_AS_MANY_RELATION_CONFIG,
  oneRelations: DOMAINS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOMAINS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDomains,
  DomainsSortableField,
  DomainsSelectableField,
  DomainsFilterableField,
  DomainsDateRangeField,
  DomainsRelationKey,
  typeof DOMAINS_ONE_RELATION_QUERY_OPTIONS,
  typeof DOMAINS_MANY_RELATION_QUERY_OPTIONS
>;
