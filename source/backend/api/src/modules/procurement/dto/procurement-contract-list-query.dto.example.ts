import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of ProcurementContractListQuery, for generated tests. */
export const procurementContractListQueryExample: ContractExample = contractExample({
  name: "ProcurementContractListQuery",
  fields: [
    {
      name: "awardedEntityId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contractingUnitId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
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
      name: "tenderId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});