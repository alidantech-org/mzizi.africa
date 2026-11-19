import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentListCategories, for generated tests. */
export const contentListCategoriesExample: ContractExample = contractExample({
  name: "ContentListCategories",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
