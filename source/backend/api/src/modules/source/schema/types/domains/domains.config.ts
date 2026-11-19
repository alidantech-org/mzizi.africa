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
import * as ContactsConfig from "#/modules/official/schema/types/contacts/contacts.config";
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as TemplateConfig from "#/modules/reference/schema/types/template/template.config";

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

export const DOMAINS_RELATION_KEYS = [
  "entity",
  "officialContact",
  "source",
  "status",
  "template",
] as const satisfies readonly DomainsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOMAINS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "endsOn",
  "entityId",
  "fromToPrecision",
  "fromYear",
  "host",
  "id",
  "lastCheckedAt",
  "officialContactId",
  "sourceId",
  "startsOn",
  "statusId",
  "templateId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_SEARCHABLE_FIELDS = ["code", "host"] as const satisfies readonly DomainsKey[];

export const DOMAINS_FILTERABLE_FIELDS = [
  "entityId",
  "fromToPrecision",
  "id",
  "officialContactId",
  "sourceId",
  "statusId",
  "templateId",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "lastCheckedAt",
  "startsOn",
  "updatedAt",
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
  "endsOn",
  "entityId",
  "fromToPrecision",
  "fromYear",
  "host",
  "id",
  "lastCheckedAt",
  "officialContactId",
  "sourceId",
  "startsOn",
  "statusId",
  "templateId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly DomainsKey[];

export const DOMAINS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "endsOn",
  "entityId",
  "fromToPrecision",
  "fromYear",
  "host",
  "id",
  "lastCheckedAt",
  "officialContactId",
  "sourceId",
  "startsOn",
  "statusId",
  "templateId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly DomainsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOMAINS_EDITABLE_FIELDS = [
  "code",
  "endsOn",
  "entityId",
  "fromToPrecision",
  "fromYear",
  "host",
  "lastCheckedAt",
  "officialContactId",
  "sourceId",
  "startsOn",
  "statusId",
  "templateId",
  "toYear",
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
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "entity",
  ),
  Q.createRelationKeyMapper<DomainsRelationKey>().one(
    () => ContactsConfig.CONTACTS_AS_ONE_RELATION_CONFIG,
    "officialContact",
  ),
  Q.createRelationKeyMapper<DomainsRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
  Q.createRelationKeyMapper<DomainsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
  Q.createRelationKeyMapper<DomainsRelationKey>().one(
    () => TemplateConfig.TEMPLATE_AS_ONE_RELATION_CONFIG,
    "template",
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
