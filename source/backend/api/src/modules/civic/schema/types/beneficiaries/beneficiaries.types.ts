// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as ProcurementsTypes from "#/modules/civic/schema/types/procurements/procurements.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BENEFICIARIES_RELATION_KEYS,
  BENEFICIARIES_SORTABLE_FIELDS,
  BENEFICIARIES_SEARCHABLE_FIELDS,
  BENEFICIARIES_FILTERABLE_FIELDS,
  BENEFICIARIES_DATE_RANGE_FIELDS,
  BENEFICIARIES_SELECTABLE_FIELDS,
  BENEFICIARIES_DEFAULT_SELECT_FIELDS,
  BENEFICIARIES_EDITABLE_FIELDS,
} from "./beneficiaries.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles. */
export interface IBeneficiaries extends B.IBase {
  benefitKindId: string;
  code: string;
  contractId: string | null;
  procurementId: string | null;
  projectId: string | null;
  sharePercent: number | null;
  sourceCitationId: string | null;
  subjectId: string;
  subjectTable: SubjectTable;
  readonly benefitKind?: ValueTypes.IValue;
  readonly contract?: ContractsTypes.IContracts;
  readonly procurement?: ProcurementsTypes.IProcurements;
  readonly project?: ProjectsTypes.IProjects;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BeneficiariesKey = keyof IBeneficiaries;

export type BeneficiariesRelationKey = (typeof BENEFICIARIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBeneficiariesReadonlyFields = B.IBaseReadonlyFields;

export type IBeneficiariesContextualFields = never;

export type IBeneficiariesSensitiveFields = never;

export type IBeneficiariesTransitionFields = never;

export type IBeneficiariesImmutableFields =
  | IBeneficiariesReadonlyFields
  | IBeneficiariesContextualFields
  | IBeneficiariesSensitiveFields
  | IBeneficiariesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBeneficiariesCreatable = Omit<
  IBeneficiaries,
  IBeneficiariesImmutableFields | BeneficiariesRelationKey
>;

export type IBeneficiariesSystemWritable = Omit<
  IBeneficiaries,
  B.IBaseReadonlyFields | BeneficiariesRelationKey
>;

export type IBeneficiariesUpdatable = Partial<
  Omit<IBeneficiaries, IBeneficiariesImmutableFields | BeneficiariesRelationKey>
>;

export interface IBeneficiariesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BeneficiariesSortableField = (typeof BENEFICIARIES_SORTABLE_FIELDS)[number];

export type BeneficiariesSearchableField = (typeof BENEFICIARIES_SEARCHABLE_FIELDS)[number];

export type BeneficiariesFilterableField = (typeof BENEFICIARIES_FILTERABLE_FIELDS)[number];

export type BeneficiariesDateRangeField = (typeof BENEFICIARIES_DATE_RANGE_FIELDS)[number];

export type BeneficiariesSelectableField = (typeof BENEFICIARIES_SELECTABLE_FIELDS)[number];

export type BeneficiariesDefaultSelectField = (typeof BENEFICIARIES_DEFAULT_SELECT_FIELDS)[number];

export type BeneficiariesEditableField = (typeof BENEFICIARIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBeneficiariesAsOneRelationConfig = Q.IOneRelationConfig<
  "beneficiaries",
  BeneficiariesSelectableField
>;

export type IBeneficiariesAsManyRelationConfig = Q.IManyRelationConfig<
  "beneficiaries",
  BeneficiariesSelectableField,
  BeneficiariesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBeneficiariesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IBeneficiaries,
  BeneficiariesSelectableField
>;

export type IBeneficiariesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBeneficiaries,
  BeneficiariesSelectableField,
  BeneficiariesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBeneficiariesRelationMap extends Record<BeneficiariesRelationKey, unknown> {
  benefitKind: ValueTypes.IValueAsOneRelationQuery;
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  procurement: ProcurementsTypes.IProcurementsAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBeneficiariesRelationQueries = Q.IBaseRelationQueries<
  IBeneficiaries,
  BeneficiariesRelationKey,
  IBeneficiariesRelationMap
>;

export type IBeneficiariesItemQuery = Q.IBaseItemQuery<
  IBeneficiaries,
  BeneficiariesRelationKey,
  BeneficiariesSelectableField,
  BeneficiariesRelationKey,
  BeneficiariesSelectableField,
  IBeneficiariesRelationMap,
  IBeneficiariesRelationQueries
>;

export type IBeneficiariesListQuery = Q.IBaseListQuery<
  IBeneficiaries,
  BeneficiariesRelationKey,
  BeneficiariesSelectableField,
  BeneficiariesSortableField,
  BeneficiariesRelationKey,
  BeneficiariesSelectableField,
  BeneficiariesSortableField,
  BeneficiariesDateRangeField,
  BeneficiariesFilterableField,
  IBeneficiariesRelationMap,
  IBeneficiariesRelationQueries,
  IBeneficiariesItemQuery
>;
