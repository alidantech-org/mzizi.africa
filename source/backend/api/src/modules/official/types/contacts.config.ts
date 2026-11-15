// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from '#/modules/official/types/entities.config';
import * as IndividualsConfig from '#/modules/official/types/individuals.config';
import * as ValueConfig from '#/modules/reference/types/value.config';
import * as CitationsConfig from '#/modules/source/types/citations.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContacts,
  ContactsKey,
  ContactsRelationKey,
  ContactsSortableField,
  ContactsFilterableField,
  ContactsDateRangeField,
  ContactsSelectableField,
  IContactsAsOneRelationConfig,
  IContactsAsManyRelationConfig
} from './contacts.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTACTS_RELATION_KEYS = ['entity', 'individual', 'kind', 'sourceCitation', 'visibility', ] as const satisfies readonly ContactsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTACTS_SORTABLE_FIELDS = [] as const satisfies readonly ContactsKey[];

export const CONTACTS_SEARCHABLE_FIELDS = [] as const satisfies readonly ContactsKey[];

export const CONTACTS_FILTERABLE_FIELDS = [] as const satisfies readonly ContactsKey[];

export const CONTACTS_DATE_RANGE_FIELDS = [] as const satisfies readonly ContactsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTACTS_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'kindId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'value', 'version', 'visibilityId', ] as const satisfies readonly ContactsKey[];

export const CONTACTS_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'entityId', 'id', 'individualId', 'kindId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'value', 'version', 'visibilityId', ] as const satisfies readonly ContactsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTACTS_EDITABLE_FIELDS = ['entityId', 'individualId', 'kindId', 'sourceCitationId', 'validFrom', 'validUntil', 'value', 'visibilityId', ] as const satisfies readonly ContactsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTACTS_AS_ONE_RELATION_CONFIG = {
  relation: 'contacts',
  type: ERelationType.One,
  selectableFields: CONTACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACTS_DEFAULT_SELECT_FIELDS
} as const satisfies IContactsAsOneRelationConfig;

export const CONTACTS_AS_MANY_RELATION_CONFIG = {
  relation: 'contactss',
  type: ERelationType.Many,
  selectableFields: CONTACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTACTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IContactsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTACTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContactsRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'entity'),
  Q.createRelationKeyMapper<ContactsRelationKey>().one(IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG, 'individual'),
  Q.createRelationKeyMapper<ContactsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
  Q.createRelationKeyMapper<ContactsRelationKey>().one(CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG, 'sourceCitation'),
  Q.createRelationKeyMapper<ContactsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'visibility'),
] as const;

export const CONTACTS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTACTS_QUERY_OPTIONS = {
  searchableFields: CONTACTS_SEARCHABLE_FIELDS,
  selectableFields: CONTACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTACTS_SORTABLE_FIELDS,
  filterFields: CONTACTS_FILTERABLE_FIELDS,
  dateRangeFields: CONTACTS_DATE_RANGE_FIELDS,
  oneRelations: CONTACTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTACTS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IContacts,
  ContactsSortableField,
  ContactsSelectableField,
  ContactsFilterableField,
  ContactsDateRangeField,
  ContactsRelationKey,
  typeof CONTACTS_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTACTS_MANY_RELATION_QUERY_OPTIONS
>;