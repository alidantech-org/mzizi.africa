import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/modules/shared/enum/sort-direction.enum.ts";

/** The contract shape of BaseQuery, for generated tests. */
export const baseQueryExample: ContractExample = contractExample({
  name: "BaseQuery",
  fields: [
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
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
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [
  ],
});