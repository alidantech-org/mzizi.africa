// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BidsTypes from "#/modules/civic/schema/types/bids/bids.types";
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTNERS_RELATION_KEYS,
  PARTNERS_SORTABLE_FIELDS,
  PARTNERS_SEARCHABLE_FIELDS,
  PARTNERS_FILTERABLE_FIELDS,
  PARTNERS_DATE_RANGE_FIELDS,
  PARTNERS_SELECTABLE_FIELDS,
  PARTNERS_DEFAULT_SELECT_FIELDS,
  PARTNERS_EDITABLE_FIELDS,
} from "./partners.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor. */
export interface IPartners extends B.IBase {
  bidId: string | null;
  contractId: string | null;
  partnerEntityId: string;
  roleId: string;
  sharePercentage: number | null;
  sourceCitationId: string | null;
  readonly bid?: BidsTypes.IBids;
  readonly contract?: ContractsTypes.IContracts;
  readonly partnerEntity?: EntitiesTypes.IEntities;
  readonly role?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartnersKey = keyof IPartners;

export type PartnersRelationKey = (typeof PARTNERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartnersReadonlyFields = B.IBaseReadonlyFields;

export type IPartnersContextualFields = never;

export type IPartnersSensitiveFields = never;

export type IPartnersTransitionFields = never;

export type IPartnersImmutableFields =
  | IPartnersReadonlyFields
  | IPartnersContextualFields
  | IPartnersSensitiveFields
  | IPartnersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartnersCreatable = Omit<IPartners, IPartnersImmutableFields | PartnersRelationKey>;

export type IPartnersSystemWritable = Omit<IPartners, B.IBaseReadonlyFields | PartnersRelationKey>;

export type IPartnersUpdatable = Partial<
  Omit<IPartners, IPartnersImmutableFields | PartnersRelationKey>
>;

export interface IPartnersTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartnersSortableField = (typeof PARTNERS_SORTABLE_FIELDS)[number];

export type PartnersSearchableField = (typeof PARTNERS_SEARCHABLE_FIELDS)[number];

export type PartnersFilterableField = (typeof PARTNERS_FILTERABLE_FIELDS)[number];

export type PartnersDateRangeField = (typeof PARTNERS_DATE_RANGE_FIELDS)[number];

export type PartnersSelectableField = (typeof PARTNERS_SELECTABLE_FIELDS)[number];

export type PartnersDefaultSelectField = (typeof PARTNERS_DEFAULT_SELECT_FIELDS)[number];

export type PartnersEditableField = (typeof PARTNERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartnersAsOneRelationConfig = Q.IOneRelationConfig<
  "partners",
  PartnersSelectableField
>;

export type IPartnersAsManyRelationConfig = Q.IManyRelationConfig<
  "partners",
  PartnersSelectableField,
  PartnersSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartnersAsOneRelationQuery = Q.IAsOneRelationQuery<IPartners, PartnersSelectableField>;

export type IPartnersAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPartners,
  PartnersSelectableField,
  PartnersSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartnersRelationMap extends Record<PartnersRelationKey, unknown> {
  bid: BidsTypes.IBidsAsOneRelationQuery;
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  partnerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartnersRelationQueries = Q.IBaseRelationQueries<
  IPartners,
  PartnersRelationKey,
  IPartnersRelationMap
>;

export type IPartnersItemQuery = Q.IBaseItemQuery<
  IPartners,
  PartnersRelationKey,
  PartnersSelectableField,
  PartnersRelationKey,
  PartnersSelectableField,
  IPartnersRelationMap,
  IPartnersRelationQueries
>;

export type IPartnersListQuery = Q.IBaseListQuery<
  IPartners,
  PartnersRelationKey,
  PartnersSelectableField,
  PartnersSortableField,
  PartnersRelationKey,
  PartnersSelectableField,
  PartnersSortableField,
  PartnersDateRangeField,
  PartnersFilterableField,
  IPartnersRelationMap,
  IPartnersRelationQueries,
  IPartnersItemQuery
>;
