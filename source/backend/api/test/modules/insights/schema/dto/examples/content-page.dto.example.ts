import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentPage, for generated tests. */
export const contentPageExample: ContractExample = contractExample({
  name: "ContentPage",
  fields: [
    {
      name: "content",
      optional: true,
      nullable: true,
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
      name: "related",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
