import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of LoanListQuery, for generated tests. */
export const loanListQueryExample: ContractExample = contractExample({
  name: "LoanListQuery",
  fields: [
    {
      name: "borrowerUnitId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lenderEntityId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "order",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "status",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LoanStatus) },
    },
  ],
  invariants: [
  ],
});