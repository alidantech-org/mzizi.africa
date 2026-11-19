// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ContactsTypes from "#/modules/official/schema/types/contacts/contacts.types";
import type * as DomainsTypes from "#/modules/source/schema/types/domains/domains.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as OfficesTypes from "#/modules/governance/schema/types/offices/offices.types";
import type * as PositionsTypes from "#/modules/governance/schema/types/positions/positions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as TemplateTypes from "#/modules/reference/schema/types/template/template.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INSTANCE_RELATION_KEYS,
  INSTANCE_SORTABLE_FIELDS,
  INSTANCE_SEARCHABLE_FIELDS,
  INSTANCE_FILTERABLE_FIELDS,
  INSTANCE_DATE_RANGE_FIELDS,
  INSTANCE_SELECTABLE_FIELDS,
  INSTANCE_DEFAULT_SELECT_FIELDS,
  INSTANCE_EDITABLE_FIELDS,
} from "./instance.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified. */
export interface IInstance extends B.IBase {
  contactId: string | null;
  domainId: string | null;
  generatedAt: Date;
  institutionId: string | null;
  officeId: string | null;
  positionId: string | null;
  statusId: string;
  templateId: string;
  unitFeatureId: string | null;
  verifiedCitationId: string | null;
  readonly contact?: ContactsTypes.IContacts;
  readonly domain?: DomainsTypes.IDomains;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly office?: OfficesTypes.IOffices;
  readonly position?: PositionsTypes.IPositions;
  readonly status?: ValueTypes.IValue;
  readonly template?: TemplateTypes.ITemplate;
  readonly unitFeature?: FeaturesTypes.IFeatures;
  readonly verifiedCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InstanceKey = keyof IInstance;

export type InstanceRelationKey = (typeof INSTANCE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInstanceReadonlyFields = B.IBaseReadonlyFields;

export type IInstanceContextualFields = never;

export type IInstanceSensitiveFields = never;

export type IInstanceTransitionFields = never;

export type IInstanceImmutableFields =
  | IInstanceReadonlyFields
  | IInstanceContextualFields
  | IInstanceSensitiveFields
  | IInstanceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInstanceCreatable = Omit<IInstance, IInstanceImmutableFields | InstanceRelationKey>;

export type IInstanceSystemWritable = Omit<IInstance, B.IBaseReadonlyFields | InstanceRelationKey>;

export type IInstanceUpdatable = Partial<
  Omit<IInstance, IInstanceImmutableFields | InstanceRelationKey>
>;

export interface IInstanceTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InstanceSortableField = (typeof INSTANCE_SORTABLE_FIELDS)[number];

export type InstanceSearchableField = (typeof INSTANCE_SEARCHABLE_FIELDS)[number];

export type InstanceFilterableField = (typeof INSTANCE_FILTERABLE_FIELDS)[number];

export type InstanceDateRangeField = (typeof INSTANCE_DATE_RANGE_FIELDS)[number];

export type InstanceSelectableField = (typeof INSTANCE_SELECTABLE_FIELDS)[number];

export type InstanceDefaultSelectField = (typeof INSTANCE_DEFAULT_SELECT_FIELDS)[number];

export type InstanceEditableField = (typeof INSTANCE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInstanceAsOneRelationConfig = Q.IOneRelationConfig<
  "instance",
  InstanceSelectableField
>;

export type IInstanceAsManyRelationConfig = Q.IManyRelationConfig<
  "instances",
  InstanceSelectableField,
  InstanceSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInstanceAsOneRelationQuery = Q.IAsOneRelationQuery<IInstance, InstanceSelectableField>;

export type IInstanceAsManyRelationQuery = Q.IAsManyRelationQuery<
  IInstance,
  InstanceSelectableField,
  InstanceSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInstanceRelationMap extends Record<InstanceRelationKey, unknown> {
  contact: ContactsTypes.IContactsAsOneRelationQuery;
  domain: DomainsTypes.IDomainsAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  position: PositionsTypes.IPositionsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
  template: TemplateTypes.ITemplateAsOneRelationQuery;
  unitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  verifiedCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInstanceRelationQueries = Q.IBaseRelationQueries<
  IInstance,
  InstanceRelationKey,
  IInstanceRelationMap
>;

export type IInstanceItemQuery = Q.IBaseItemQuery<
  IInstance,
  InstanceRelationKey,
  InstanceSelectableField,
  InstanceRelationKey,
  InstanceSelectableField,
  IInstanceRelationMap,
  IInstanceRelationQueries
>;

export type IInstanceListQuery = Q.IBaseListQuery<
  IInstance,
  InstanceRelationKey,
  InstanceSelectableField,
  InstanceSortableField,
  InstanceRelationKey,
  InstanceSelectableField,
  InstanceSortableField,
  InstanceDateRangeField,
  InstanceFilterableField,
  IInstanceRelationMap,
  IInstanceRelationQueries,
  IInstanceItemQuery
>;
