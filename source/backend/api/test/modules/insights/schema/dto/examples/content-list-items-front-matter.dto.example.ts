import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContentListItemsFrontMatter, for generated tests. */
export const contentListItemsFrontMatterExample: ContractExample = contractExample({
  name: "ContentListItemsFrontMatter",
  fields: [
    {
      name: "image",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
