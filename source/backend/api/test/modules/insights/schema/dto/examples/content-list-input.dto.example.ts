import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentListInput, for generated tests. */
export const contentListInputExample: ContractExample = contractExample({
  name: "ContentListInput",
  fields: [
    {
      name: "category",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 500 },
    },
    {
      name: "query",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "tag",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
  ],
  invariants: [],
});
