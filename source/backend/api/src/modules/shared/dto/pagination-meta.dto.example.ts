import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of PaginationMeta, for generated tests. */
export const paginationMetaExample: ContractExample = contractExample({
  name: "PaginationMeta",
  fields: [
    {
      name: "limit",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "page",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "totalPages",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
  ],
  invariants: [
  ],
});