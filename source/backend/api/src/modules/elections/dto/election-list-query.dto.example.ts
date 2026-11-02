import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ElectionStatus } from "#/types/elections/election-status.enum.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of ElectionListQuery, for generated tests. */
export const electionListQueryExample: ContractExample = contractExample({
  name: "ElectionListQuery",
  fields: [
    {
      name: "jurisdictionId",
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
      name: "q",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
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
      spec: { kind: "enum", values: Object.values(ElectionStatus) },
    },
  ],
  invariants: [
  ],
});