import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentList, for generated tests. */
export const contentListExample: ContractExample = contractExample({
  name: "ContentList",
  fields: [
    {
      name: "categories",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "items",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
