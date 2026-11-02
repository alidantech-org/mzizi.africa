// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FundRestriction } from '#/types/finance/fund-restriction.enum';
import type { TransferStatus } from '#/types/finance/transfer-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetaryUnitTypes from '#/modules/finance/types/budgetary-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TRANSFER_RELATION_KEYS,
  TRANSFER_SORTABLE_FIELDS,
  TRANSFER_SEARCHABLE_FIELDS,
  TRANSFER_FILTERABLE_FIELDS,
  TRANSFER_DATE_RANGE_FIELDS,
  TRANSFER_SELECTABLE_FIELDS,
  TRANSFER_DEFAULT_SELECT_FIELDS,
  TRANSFER_EDITABLE_FIELDS
} from './transfer.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Transfer */
export interface ITransfer extends B.IBase {
  amount: number;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  currencyCode: string;
  fiscalYearId: string;
  fromUnitId: string;
  isCurrent: boolean;
  legalBasisId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  restriction: FundRestriction;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: TransferStatus;
  toUnitId: string;
  toolOrModel: string | null;
  transferTypeId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly budgetaryUnit?: BudgetaryUnitTypes.IBudgetaryUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TransferKey = keyof ITransfer;

export type TransferRelationKey = (typeof TRANSFER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITransferReadonlyFields = B.IBaseReadonlyFields;

export type ITransferContextualFields = never;

export type ITransferSensitiveFields = never;

export type ITransferTransitionFields = never;

export type ITransferImmutableFields =
  | ITransferReadonlyFields
  | ITransferContextualFields
  | ITransferSensitiveFields
  | ITransferTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITransferCreatable = Omit<ITransfer, ITransferImmutableFields | TransferRelationKey>;

export type ITransferSystemWritable = Omit<ITransfer, B.IBaseReadonlyFields | TransferRelationKey>;

export type ITransferUpdatable = Partial<Omit<ITransfer, ITransferImmutableFields | TransferRelationKey>>;

export interface ITransferTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TransferSortableField = (typeof TRANSFER_SORTABLE_FIELDS)[number];

export type TransferSearchableField = (typeof TRANSFER_SEARCHABLE_FIELDS)[number];

export type TransferFilterableField = (typeof TRANSFER_FILTERABLE_FIELDS)[number];

export type TransferDateRangeField = (typeof TRANSFER_DATE_RANGE_FIELDS)[number];

export type TransferSelectableField = (typeof TRANSFER_SELECTABLE_FIELDS)[number];

export type TransferDefaultSelectField = (typeof TRANSFER_DEFAULT_SELECT_FIELDS)[number];

export type TransferEditableField = (typeof TRANSFER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITransferAsOneRelationConfig = Q.IOneRelationConfig<'transfer', TransferSelectableField>;

export type ITransferAsManyRelationConfig = Q.IManyRelationConfig<'transfers', TransferSelectableField, TransferSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITransferAsOneRelationQuery = Q.IAsOneRelationQuery<ITransfer, TransferSelectableField>;

export type ITransferAsManyRelationQuery = Q.IAsManyRelationQuery<ITransfer, TransferSelectableField, TransferSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITransferRelationMap extends Record<TransferRelationKey, unknown> {
  budgetaryUnit: BudgetaryUnitTypes.IBudgetaryUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITransferRelationQueries = Q.IBaseRelationQueries<ITransfer, TransferRelationKey, ITransferRelationMap>;

export type ITransferItemQuery = Q.IBaseItemQuery<
  ITransfer,
  TransferRelationKey,
  TransferSelectableField,
  TransferRelationKey,
  TransferSelectableField,
  ITransferRelationMap,
  ITransferRelationQueries
>;

export type ITransferListQuery = Q.IBaseListQuery<
  ITransfer,
  TransferRelationKey,
  TransferSelectableField,
  TransferSortableField,
  TransferRelationKey,
  TransferSelectableField,
  TransferSortableField,
  TransferDateRangeField,
  TransferFilterableField,
  ITransferRelationMap,
  ITransferRelationQueries,
  ITransferItemQuery
>;